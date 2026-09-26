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
