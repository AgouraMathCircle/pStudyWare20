<#
.SYNOPSIS
    Scripts every schema object in a live database into the DB project, one file per object
    (<schema>\Tables\X.sql, <schema>\Stored Procedures\X.sql, ...).

.DESCRIPTION
    Used to (re)baseline the project from the database, and to detect drift: run it, then
    `git status` shows anything changed on the server that isn't in source control.

    Uses SMO rather than `sqlpackage /Action:Extract` because the AMC hosting logins are
    db_ddladmin without database-level VIEW DEFINITION, which Extract requires.

.EXAMPLE
    .\Tools\Export-Schema.ps1                   # from PublishProfiles\AMCQA.publish.xml
    .\Tools\Export-Schema.ps1 -Profile AMCProd
#>
param(
    [string]$Profile = 'AMCQA'
)
. "$PSScriptRoot\Common.ps1"
Import-Smo

# Folders owned by this script; everything else in the project dir (Tools, ChangeScripts, ...) is left alone.
$unmanaged = @('Tools', 'ChangeScripts', 'OnetimeScript', 'PublishProfiles', 'Properties', 'bin', 'obj')

$b = New-Object System.Data.SqlClient.SqlConnectionStringBuilder (Get-ProfileConnectionString $Profile)
$conn = New-Object Microsoft.SqlServer.Management.Common.ServerConnection($b.DataSource, $b.UserID, $b.Password)
$conn.TrustServerCertificate = $true
$conn.DatabaseName = $b.InitialCatalog
$srv = New-Object Microsoft.SqlServer.Management.Smo.Server($conn)
# Instantiate directly: enumerating $srv.Databases needs server-level rights the hosting login lacks.
$db = New-Object Microsoft.SqlServer.Management.Smo.Database($srv, $b.InitialCatalog)
$db.Refresh()
Write-Host "Exporting [$($b.InitialCatalog)] from $($b.DataSource) (SQL $($srv.VersionString))"

Get-ChildItem $DbProjectDir -Directory | Where-Object { $unmanaged -notcontains $_.Name } |
    Remove-Item -Recurse -Force

$opt = New-Object Microsoft.SqlServer.Management.Smo.ScriptingOptions
$opt.SchemaQualify = $true
$opt.NoCollation = $true          # columns inherit the database default collation
$opt.DriAll = $true               # PK, FK, unique, check, defaults
$opt.Indexes = $true
$opt.Triggers = $true
$opt.Permissions = $false
$opt.IncludeHeaders = $false

function Save-Object($obj, [string]$folder) {
    $batches = @($obj.Script($opt)) | Where-Object {
        # SET ... ON matches the project defaults; SSDT tracks these as object properties, not statements.
        $_ -notmatch '^\s*SET (ANSI_NULLS|QUOTED_IDENTIFIER|ANSI_PADDING) ON\s*$'
    }
    # SSDT's declarative model only accepts CREATE; the generated change script emits the ALTER.
    $batches = $batches | ForEach-Object { $_ -replace '(?i)\bCREATE\s+OR\s+ALTER\s+', 'CREATE ' }
    $path = Join-Path $DbProjectDir (Join-Path $obj.Schema (Join-Path $folder "$($obj.Name).sql"))
    Write-SqlFile $path (($batches | ForEach-Object { $_.Trim() }) -join "`r`nGO`r`n`r`n")
    $script:count++
}

$script:count = 0
$usedSchemas = @{}
$collections = [ordered]@{
    'Tables'             = $db.Tables
    'Views'              = $db.Views
    'Stored Procedures'  = $db.StoredProcedures
    'Functions'          = $db.UserDefinedFunctions
    'User Defined Types' = $db.UserDefinedTableTypes
    'Types'              = $db.UserDefinedDataTypes
    'Sequences'          = $db.Sequences
    'Synonyms'           = $db.Synonyms
}
foreach ($folder in $collections.Keys) {
    foreach ($o in $collections[$folder]) {
        if ($o.PSObject.Properties['IsSystemObject'] -and $o.IsSystemObject) { continue }
        Save-Object $o $folder
        $usedSchemas[$o.Schema] = $true
    }
}

foreach ($s in $db.Schemas) {
    if ($s.IsSystemObject -or $s.Name -eq 'dbo' -or -not $usedSchemas[$s.Name]) { continue }
    # Owner is forced to dbo: schema owners on the hosting servers are per-environment logins.
    Write-SqlFile (Join-Path $DbProjectDir "Security\$($s.Name).sql") "CREATE SCHEMA [$($s.Name)]`r`n    AUTHORIZATION [dbo];"
    $script:count++
}

Write-Host "Wrote $script:count files. Review with: git status -- pStudyWare20.DB"
