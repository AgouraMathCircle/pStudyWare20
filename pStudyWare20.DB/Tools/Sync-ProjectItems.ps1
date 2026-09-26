<#
.SYNOPSIS
    Makes pStudyWare20.DB.sqlproj list exactly the files on disk. Run after adding, renaming or deleting
    .sql files outside Visual Studio (VS keeps the list up to date for files added through it).
#>
. "$PSScriptRoot\Common.ps1"
if (Sync-ProjectItems) { Write-Host 'pStudyWare20.DB.sqlproj updated.' } else { Write-Host 'pStudyWare20.DB.sqlproj already up to date.' }
