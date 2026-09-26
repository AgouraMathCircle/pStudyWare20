# pStudyWare20.DB

Source of truth for the AMC database schema (tables, procs, functions, types). Every schema change goes
through a PR that contains **both** the changed object file(s) **and** a generated change script in
`ChangeScripts/`. Scripts are run by hand in SSMS — nothing deploys automatically.

```
pStudyWare20.DB/
  dbo/Tables/*.sql              one file per object, as CREATE statements (declarative)
  dbo/Stored Procedures/*.sql
  dbo/Functions/*.sql
  dbo/User Defined Types/*.sql
  AMCAdminDB/...                objects in the AMCAdminDB schema
  Security/*.sql                non-dbo schemas
  ChangeScripts/                generated, hand-run upgrade scripts (one per PR)  <- run these
  OnetimeScript/                hand-written data fixes (UPDATE/INSERT), not schema
  Tools/                        Export-Schema.ps1, New-ChangeScript.ps1
  PublishProfiles/              local only, gitignored (contains passwords)
```

The project is an SDK-style SQL project (`Microsoft.Build.Sql`): any `.sql` file under the folder is
compiled automatically, and it builds with `dotnet build` — no Visual Studio needed. Building validates
that every proc references columns/tables that exist, so a missed column shows up as a build error.

## One-time setup (per machine)

1. .NET SDK 8+ (`dotnet --version`).
2. SqlPackage: `dotnet tool install -g microsoft.sqlpackage`
3. For `Export-Schema.ps1` only: SSMS 21/22 installed, **or** `Install-Module SqlServer -Scope CurrentUser`.
4. Publish profile (only needed for `Export-Schema.ps1`): create `PublishProfiles/AMCQA.publish.xml`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <Project ToolsVersion="Current" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
     <PropertyGroup>
       <TargetDatabaseName>AMCQA</TargetDatabaseName>
       <TargetConnectionString>Server=...;Database=AMCQA;User Id=...;Password=...;TrustServerCertificate=True;</TargetConnectionString>
     </PropertyGroup>
   </Project>
   ```
   Never commit this folder (it is in `.gitignore`).

## Making a schema change (every PR)

1. Branch from `main`.
2. Edit the object file, e.g. add a column to `dbo/Tables/AMC_tblTimeTracking.sql`.
   Write the **final desired state** as `CREATE TABLE`/`CREATE PROCEDURE` — never `ALTER` and never
   `CREATE OR ALTER`; the generated script works out the `ALTER`. New object = new file.
   Add new columns at the **end** of the table, and make them `NULL` or give them a `DEFAULT`.
3. Build: `dotnet build pStudyWare20.DB` — fix any errors (e.g. a proc using a column you didn't add).
4. Commit the object change, then generate the script from the repo root:
   ```powershell
   .\pStudyWare20.DB\Tools\New-ChangeScript.ps1 -Name AddApprovalStatusToTimeTracking
   ```
   This builds your branch and `origin/main`, diffs them, and writes
   `ChangeScripts/<yyyy-MM-dd>_<Name>.sql` with a summary of every change at the top. Read it.
5. If data also needs fixing (backfill, lookup rows), add it at the end of that change script or as a
   separate file in `OnetimeScript/`.
6. Commit the change script and open the PR. Reviewers review both the object file and the script.
7. After merge: run the script in SSMS on **AMCQA**, verify the app, then run it on **production**.
   Pick the database in the SSMS dropdown first. The script is transactional and refuses to run
   anything that would drop data (e.g. dropping a non-empty column) — if you really intend that,
   write that step by hand.

Keep one PR per change so scripts stay small and run in order. If two PRs touch the database at the
same time, whichever merges second should regenerate its script against the new `main`.

## Changes made directly on the server (drift)

If someone altered AMCQA directly in SSMS, pull it back into source control:

```powershell
.\pStudyWare20.DB\Tools\Export-Schema.ps1        # rewrites dbo/, AMCAdminDB/, Security/ from AMCQA
git status -- pStudyWare20.DB                    # anything listed = server differs from main
```

Commit the differences in their own PR (no change script — the server already has them), or discard
them with `git checkout` if the server change was a mistake. Running this now and then is a cheap way
to confirm QA and source control agree. `-Profile <name>` exports from another publish profile.

`sqlpackage /Action:Extract` and VS "Schema Compare" do **not** work against the hosted servers: the
logins are `db_ddladmin` without database-level `VIEW DEFINITION`. `Export-Schema.ps1` uses SMO
(the engine behind SSMS "Generate Scripts"), which works with those rights.

## Doing it by hand (no scripts)

**Re-create the project from the database**
1. SSMS → right-click AMCQA → Tasks → Generate Scripts → *Select specific objects*: Tables, Stored
   Procedures, User-Defined Functions, User-Defined Table Types, Schemas.
2. Set Scripting Options → *Save as script file* → **One script file per object**, into an empty folder.
   Advanced: Script Indexes = True, Script Primary/Foreign Keys, Defaults, Check Constraints = True,
   Script Collation = False, Include Descriptive Headers = False, Script USE DATABASE = False.
3. Move files into `dbo/Tables`, `dbo/Stored Procedures`, etc. Remove `SET ANSI_NULLS ON`,
   `SET QUOTED_IDENTIFIER ON`, `SET ANSI_PADDING ON` lines, and change `CREATE OR ALTER` to `CREATE`.
4. `dotnet build pStudyWare20.DB` until it succeeds.

**Generate a change script by hand**
```powershell
git stash; git checkout main
dotnet build pStudyWare20.DB -c Release; copy pStudyWare20.DB\bin\Release\pStudyWare20.DB.dacpac $env:TEMP\base.dacpac
git checkout my-branch; git stash pop
dotnet build pStudyWare20.DB -c Release
sqlpackage /Action:Script /SourceFile:pStudyWare20.DB\bin\Release\pStudyWare20.DB.dacpac /TargetFile:$env:TEMP\base.dacpac /TargetDatabaseName:AMCQA /OutputPath:change.sql /p:BlockOnPossibleDataLoss=True /p:IncludeTransactionalScripts=True /p:IgnoreColumnOrder=True
```
The raw output uses SQLCMD syntax (`:setvar`, `$(DatabaseName)`): either enable *Query → SQLCMD Mode*
in SSMS before running it, or delete those lines as `New-ChangeScript.ps1` does.

## Known issues found during the 2026-09 re-baseline

- `AMC_spAddVolunteerAvailability`, `AMC_spGetVolunteerAvailabilityHistory` reference table
  `AMC_VolunteerAvailabilityForm`, and `AMC_spUpdateVolunteerAvailability` references
  `VolunteerAvailabilityForm` — neither table exists on AMCQA, so these procs fail if called (build warning SQL71502).
- `AMCAdminDB.AMC_ScheduledEmails` lives in the `AMCAdminDB` schema, not `dbo` — probably created under
  a login whose default schema is `AMCAdminDB`. Confirm whether the app expects it in `dbo`.
- `AMC_spGoogleEmailGroup_Add` uses OLE Automation (`sp_OACreate`), which must be enabled on the server.
- `pStudyWare20.Repository/Scripts/*.sql` are older ad-hoc scripts from before this project; their
  effects are already in the AMCQA baseline. New changes belong here instead.
