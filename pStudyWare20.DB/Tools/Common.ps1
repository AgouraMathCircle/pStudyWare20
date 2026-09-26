# Shared helpers for the pStudyWare20.DB tooling scripts. Dot-source, don't run directly.

$ErrorActionPreference = 'Stop'
$script:DbProjectDir = Split-Path $PSScriptRoot -Parent
$script:RepoRoot = Split-Path $script:DbProjectDir -Parent

# Reads the connection string from a (gitignored) publish profile so passwords never live in scripts or git.
function Get-ProfileConnectionString([string]$ProfileName) {
    $path = Join-Path $script:DbProjectDir "PublishProfiles\$ProfileName.publish.xml"
    if (-not (Test-Path $path)) {
        throw "Publish profile not found: $path. Create it locally (see README.md, 'Publish profiles'); it is gitignored."
    }
    [xml]$xml = Get-Content $path
    $cs = @($xml.Project.PropertyGroup | ForEach-Object { $_.TargetConnectionString } | Where-Object { $_ })[0]
    if (-not $cs) { throw "No <TargetConnectionString> in $path" }
    return $cs
}

# Loads SMO (the engine behind SSMS 'Generate Scripts'). Prefers the SqlServer PowerShell module,
# falls back to the copy shipped with SSMS 22 / 21.
function Import-Smo {
    if ('Microsoft.SqlServer.Management.Smo.Server' -as [type]) { return }
    if (Get-Module -ListAvailable SqlServer) {
        Import-Module SqlServer -DisableNameChecking
        return
    }
    $ssms = Get-ChildItem 'C:\Program Files\Microsoft SQL Server Management Studio *\Release' -Directory -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending | Select-Object -First 1
    if (-not $ssms) {
        throw "SMO not found. Install SSMS 21+ or run: Install-Module SqlServer -Scope CurrentUser"
    }
    $root = $ssms.FullName
    $script:SmoProbeDirs = @("$root\Common7\IDE", "$root\Common7\IDE\PublicAssemblies", "$root\Common7\IDE\PrivateAssemblies")
    $script:SmoShared = Get-ChildItem "$root\SharedAssemblies" -Recurse -Filter *.dll -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -match 'netf|net4' }
    # SSMS relies on binding redirects that PowerShell doesn't have; resolve dependencies by simple name.
    [AppDomain]::CurrentDomain.add_AssemblyResolve({
        param($sender, $e)
        $name = ($e.Name -split ',')[0] + '.dll'
        foreach ($d in $script:SmoProbeDirs) {
            $f = Join-Path $d $name
            if (Test-Path $f) { return [Reflection.Assembly]::LoadFrom($f) }
        }
        $m = $script:SmoShared | Where-Object Name -eq $name | Select-Object -First 1
        if ($m) { return [Reflection.Assembly]::LoadFrom($m.FullName) }
    })
    Add-Type -Path "$root\Common7\IDE\Microsoft.SqlServer.Smo.dll"
}

# The project is classic SSDT (so Visual Studio loads it), which `dotnet build` can't compile:
# use the MSBuild from a Visual Studio / SSMS install that has the SSDT component.
function Get-MSBuild {
    $vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    if (Test-Path $vswhere) {
        $found = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.SQL.SSDT `
            -find 'MSBuild\**\Bin\MSBuild.exe' | Select-Object -First 1
        if ($found) { return $found }
    }
    throw "No Visual Studio with SQL Server Data Tools found. In the VS Installer, add the 'Data storage and processing' workload."
}

# Rewrites the project's item list from the files on disk: every .sql in a schema folder is compiled,
# hand-run scripts and tooling are shown as None. Returns $true if the project file changed.
function Sync-ProjectItems {
    $projPath = Join-Path $script:DbProjectDir 'pStudyWare20.DB.sqlproj'
    $nonBuildDirs = @('ChangeScripts', 'OnetimeScript', 'Tools', 'PublishProfiles', 'bin', 'obj')
    $build = @(); $none = @(); $folders = @{}
    Get-ChildItem $script:DbProjectDir -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($script:DbProjectDir.Length + 1)
        $top = ($rel -split '\\')[0]
        if ($rel -notmatch '\\') {
            if ($_.Name -eq 'README.md') { $none += $rel }
            return
        }
        if (@('PublishProfiles', 'bin', 'obj') -contains $top) { return }
        if ($nonBuildDirs -contains $top) { $none += $rel }
        elseif ($_.Extension -eq '.sql') { $build += $rel }
        else { return }
        $dir = Split-Path $rel -Parent
        while ($dir) { $folders[$dir] = $true; $dir = Split-Path $dir -Parent }
    }

    $before = [IO.File]::ReadAllText($projPath)
    [xml]$xml = $before
    $ns = $xml.DocumentElement.NamespaceURI
    $nsm = New-Object Xml.XmlNamespaceManager $xml.NameTable
    $nsm.AddNamespace('m', $ns)
    foreach ($g in @($xml.SelectNodes('/m:Project/m:ItemGroup', $nsm))) {
        foreach ($i in @($g.ChildNodes)) {
            if (@('Build', 'None', 'Folder', 'PostDeploy', 'PreDeploy') -contains $i.LocalName) { [void]$g.RemoveChild($i) }
        }
        if (-not $g.HasChildNodes) { [void]$xml.DocumentElement.RemoveChild($g) }
    }
    $add = {
        param($kind, $paths)
        $g = $xml.CreateElement('ItemGroup', $ns)
        foreach ($p in ($paths | Sort-Object)) {
            $e = $xml.CreateElement($kind, $ns); $e.SetAttribute('Include', $p); [void]$g.AppendChild($e)
        }
        [void]$xml.DocumentElement.AppendChild($g)
    }
    & $add 'Folder' ($folders.Keys | ForEach-Object { "$_\" })
    & $add 'Build' $build
    & $add 'None' $none

    $sw = New-Object IO.StringWriter
    $settings = New-Object Xml.XmlWriterSettings
    $settings.Indent = $true; $settings.IndentChars = '  '; $settings.Encoding = New-Object Text.UTF8Encoding $false
    $w = [Xml.XmlWriter]::Create($sw, $settings); $xml.Save($w); $w.Close()
    $after = ($sw.ToString() -replace '^<\?xml[^>]*\?>', '<?xml version="1.0" encoding="utf-8"?>') -replace "`r?`n", "`r`n"
    $after = $after.TrimEnd() + "`r`n"
    if ($after -eq $before) { return $false }
    [IO.File]::WriteAllText($projPath, $after, (New-Object Text.UTF8Encoding $false))
    return $true
}

function Get-SqlPackage {
    $cmd = Get-Command sqlpackage -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $tool = Join-Path $env:USERPROFILE '.dotnet\tools\sqlpackage.exe'
    if (Test-Path $tool) { return $tool }
    throw "SqlPackage not found. Install it with: dotnet tool install -g microsoft.sqlpackage"
}

# Writes UTF-8 (no BOM) with CRLF line endings so regenerated files diff cleanly.
function Write-SqlFile([string]$Path, [string]$Text) {
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $normalized = ($Text -replace "`r`n", "`n" -replace "`n", "`r`n").TrimEnd() + "`r`n"
    [IO.File]::WriteAllText($Path, $normalized, (New-Object Text.UTF8Encoding $false))
}
