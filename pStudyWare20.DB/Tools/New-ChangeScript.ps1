<#
.SYNOPSIS
    Generates the hand-run SQL script for the schema changes on the current branch.

.DESCRIPTION
    Builds the DB project on this branch and on the base branch (default origin/main, via a
    temporary git worktree), then has SqlPackage diff the two dacpacs. The result is written to
    ChangeScripts\<yyyy-MM-dd>_<Name>.sql, ready to commit in the PR and run in SSMS.

    No database connection is needed: the base branch is the record of what's deployed, which is
    why every change script must be run on the servers once its PR is merged.

    The script is plain T-SQL (SQLCMD directives stripped) so it runs in SSMS as-is; select the
    target database first. It is transactional and aborts on possible data loss.

.EXAMPLE
    .\pStudyWare20.DB\Tools\New-ChangeScript.ps1 -Name AddApprovalStatusToTimeTracking
    .\pStudyWare20.DB\Tools\New-ChangeScript.ps1 -Name Foo -BaseRef origin/release
    .\pStudyWare20.DB\Tools\New-ChangeScript.ps1 -Name Foo -BaseDacpac C:\old\pStudyWare20.DB.dacpac
#>
param(
    [Parameter(Mandatory)][ValidatePattern('^[A-Za-z0-9_-]+$')][string]$Name,
    [string]$BaseRef = 'origin/main',
    [string]$BaseDacpac,
    [switch]$NoFetch,
    [switch]$Force
)
. "$PSScriptRoot\Common.ps1"
$sqlpackage = Get-SqlPackage
$msbuild = Get-MSBuild
$projectRel = 'pStudyWare20.DB\pStudyWare20.DB.sqlproj'
$work = Join-Path ([IO.Path]::GetTempPath()) ("pStudyWare20-db-" + [Guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory $work | Out-Null

function Build-Dacpac([string]$repo, [string]$dest) {
    $proj = Join-Path $repo $projectRel
    if (-not (Test-Path $proj)) { throw "No DB project at $proj" }
    $out = Join-Path $work ([IO.Path]::GetFileNameWithoutExtension($dest))
    # /restore lets the same MSBuild also build older SDK-style commits of this project.
    & $msbuild $proj /restore /p:Configuration=Release "/p:OutDir=$out\" /nologo /v:q /clp:ErrorsOnly | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "Build failed for $proj" }
    Copy-Item (Join-Path $out 'pStudyWare20.DB.dacpac') $dest
}

# A .sql file on disk but missing from the .sqlproj would silently be left out of the script.
if (Sync-ProjectItems) {
    Write-Warning "pStudyWare20.DB.sqlproj didn't list every .sql file on disk and has been updated - commit it with your change."
}

$worktree = $null
try {
    Push-Location $RepoRoot
    $branch = git rev-parse --abbrev-ref HEAD
    $headSha = git rev-parse --short HEAD
    $dirty = git status --porcelain -- pStudyWare20.DB
    if ($dirty) { Write-Warning "Uncommitted changes in pStudyWare20.DB are included in this script." }

    Write-Host "Building this branch ($branch)..."
    $newDacpac = Join-Path $work 'new.dacpac'
    Build-Dacpac $RepoRoot $newDacpac

    if ($BaseDacpac) {
        $baseDesc = $BaseDacpac
        Copy-Item $BaseDacpac (Join-Path $work 'base.dacpac')
    } else {
        if (-not $NoFetch -and $BaseRef -like 'origin/*') { git fetch origin --quiet }
        $baseSha = git rev-parse --short $BaseRef
        if ($LASTEXITCODE -ne 0) { throw "Unknown base ref '$BaseRef'" }
        $baseDesc = "$BaseRef ($baseSha)"
        Write-Host "Building base $baseDesc..."
        $worktree = Join-Path $work 'base-src'
        git worktree add --detach --quiet $worktree $BaseRef
        Build-Dacpac $worktree (Join-Path $work 'base.dacpac')
    }

    Write-Host 'Comparing...'
    $raw = Join-Path $work 'raw.sql'
    & $sqlpackage /Action:Script /Quiet:True `
        "/SourceFile:$newDacpac" "/TargetFile:$(Join-Path $work 'base.dacpac')" `
        /TargetDatabaseName:pStudyWare20 "/OutputPath:$raw" `
        /p:BlockOnPossibleDataLoss=True `
        /p:IncludeTransactionalScripts=True `
        /p:DropObjectsNotInSource=True `
        "/p:DoNotDropObjectTypes=Users;Logins;RoleMembership;Permissions;Credentials;DatabaseScopedCredentials;ServerRoles;ServerRoleMembership" `
        /p:IgnoreColumnOrder=True `
        /p:IgnorePermissions=True `
        /p:IgnoreRoleMembership=True `
        /p:ScriptDatabaseOptions=False `
        /p:GenerateSmartDefaults=False | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "SqlPackage failed" }

    $lines = Get-Content $raw
    $actions = $lines | Where-Object { $_ -match "^PRINT N'(Creating|Altering|Dropping|Renaming|Starting rebuilding|Rebuilding)" } |
        ForEach-Object { ($_ -replace "^PRINT N'", '' -replace "';\s*$", '' -replace "''", "'").TrimEnd('.') }
    if (-not $actions) {
        Write-Host "No schema differences between this branch and $baseDesc. Nothing to write." -ForegroundColor Yellow
        return
    }

    # Strip SQLCMD-only syntax so the script runs in plain SSMS against the selected database.
    $body = New-Object System.Collections.Generic.List[string]
    $skipIf = $false
    foreach ($l in $lines) {
        if ($l -match '^\s*:') { continue }                                   # :setvar, :on error exit
        if ($l -match '^\s*USE \[\$\(DatabaseName\)\];') { continue }
        if ($l -match "__IsSqlCmdEnabled") { $skipIf = $true; continue }      # SQLCMD-mode guard block
        if ($skipIf) { if ($l -match '^\s*END\s*$') { $skipIf = $false }; continue }
        $body.Add($l)
    }
    $text = $body -join "`r`n"
    if ($text -match '\$\(') { Write-Warning 'Script still contains a SQLCMD variable $(...) - review before running.' }

    $header = @"
/*******************************************************************************
  Change script : $Name
  Generated     : $(Get-Date -Format 'yyyy-MM-dd HH:mm') by Tools\New-ChangeScript.ps1
  Branch        : $branch ($headSha)
  Compared to   : $baseDesc

  HOW TO RUN: open in SSMS, pick the target database (AMCQA first, then prod)
  in the database dropdown, execute. Runs in one transaction; stops without
  changing anything if a step would lose data. Run each script once, in
  filename order.

  Changes:
$(($actions | ForEach-Object { "    - $_" }) -join "`r`n")
*******************************************************************************/
IF DB_NAME() IN (N'master', N'model', N'msdb', N'tempdb')
BEGIN
    RAISERROR(N'Select the AMC database in SSMS before running this script.', 16, 1);
    SET NOEXEC ON;
END
GO

"@
    $destDir = Join-Path $DbProjectDir 'ChangeScripts'
    $dest = Join-Path $destDir ("{0}_{1}.sql" -f (Get-Date -Format 'yyyy-MM-dd'), $Name)
    if ((Test-Path $dest) -and -not $Force) { throw "$dest exists. Use -Force to overwrite." }
    Write-SqlFile $dest ($header + $text + "`r`nGO`r`nSET NOEXEC OFF;`r`n")
    Write-Host "`nWrote $dest" -ForegroundColor Green
    $actions | ForEach-Object { Write-Host "  $_" }
}
finally {
    if ($worktree) { git worktree remove --force $worktree 2>$null }
    Pop-Location
    Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
}
