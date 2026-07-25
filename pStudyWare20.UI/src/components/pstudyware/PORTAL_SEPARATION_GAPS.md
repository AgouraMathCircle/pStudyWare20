# Admin / SystemAdmin separation — open gaps

Track and clear these while implementing Admin/SystemAdmin changes.
SuperUser remains a DB chapter-scope flag only (not a login role).

## Fixed
- [x] Portal header titles: Chapter Admin vs System Admin
- [x] SystemAdmin dashboard BE: own `ISystemAdminService` + `SystemAdminStudentListRequest` (controller no longer uses `IAdminService` / `AdminStudentListRequest`)
- [x] SystemAdmin data access: own `ISystemAdminRepository` / `SystemAdminRepository` (no `IAdminRepository` under SystemAdmin service)
- [x] Chapter Admin dashboard: removed To Do / Enrolled / Waiting UI+FE+BE (`AdminDashboard` only; SystemAdmin unchanged, own `/SystemAdminDashboard` APIs)
- [x] Chapter Admin menu: removed Student List + Docs Repository; admin routes redirect to dashboard; SystemAdmin menu/routes unchanged
- [x] Docs Repository split: `SystemAdmin/DocumentsRepository.jsx` only; Chapter Admin docs repo page/route/components removed

## Open (fix on the way)

### High
1. Lock `AdminDashboardController` to `[Authorize(Roles = "Admin")]` (currently class-level `[Authorize]` only).
2. `EmailManager.jsx`: treat `/pstudyware/systemadmin/message-center` as staff message center (today only checks `/admin`).
3. Tighten shared staff controllers that are `[Authorize]` only so staff pages require `Admin,SystemAdmin`.

### Medium
4. Common Meeting pages still import `AdminMeetingDetails.css`; wire `SystemAdminMeetingDetails.css` (or shared neutral CSS) under systemadmin.
5. Admin routes in `Routes.jsx` still list `SystemAdmin` in `allowedRoles` — use `Admin` only (redirect already handles mistakes).

### Low
6. Leftover `sysadmin` / `superadmin` strings in path helpers and logs.
7. Stale `SystemAdmin/README.md` still shows Admin import examples.
8. Many SystemAdmin page filenames still unprefixed (`DonorDetails.jsx`, etc.) — folder isolation is enough for now.
