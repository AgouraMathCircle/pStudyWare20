# Admin Dashboard Components

This directory contains React components for the Admin Dashboard, which has been migrated from the legacy ASP.NET Admin_Dashboard.aspx page.

## ⚠️ MANDATORY: Table Styling Standards

**ALL TABLES in the Admin section MUST follow the standard green color scheme.**

### Standard Colors (MANDATORY)

- **Primary Color:** `#4caf50` (GREEN) - NO EXCEPTIONS
- **Header Background:** `#e8f5e8` (light green)
- **Border Color:** `#4caf50` (green)
- **Search/Pagination Background:** `#4caf50` (green)
- **Font Size:** `0.75rem` (12px)
- **Padding:** `3px 5px` (compact)

### 🚫 DO NOT USE

- Blue (#1976d2) for tables
- Any other primary colors for Admin tables

### 📖 Required Reading for All Developers

- **Complete Styling Guide:** `ADMIN_TABLE_STYLING_GUIDE.md`
- **Master Reference:** `StudentList.jsx` (perfect implementation)
- **Recent Example:** `InstructorList.jsx` (correctly styled)

**Before creating any new Admin table, read the ADMIN_TABLE_STYLING_GUIDE.md**

## Overview

The Admin Dashboard provides administrators with a comprehensive view of:

- Enrolled students by class and location
- Waiting list counts
- User tracking summary
- System administration links
- Current session student list with search, sort, and export functionality
- Instructor management with full CRUD operations

## Components

### 1. AdminDashboard.jsx

**Main container component for the admin dashboard**

- Handles authentication and user validation
- Fetches all dashboard data from the API
- Manages global state for dashboard components
- Provides publish document and export functionality

**Props:** None (uses Auth context)

**Key Features:**

- Validates user is an admin
- Loads dashboard data on mount
- Displays snackbar messages for user feedback
- Coordinates child components

### 2. EnrolledStudents.jsx

**Displays enrolled student counts by class and location**

**Props:**

- `studentCounts` (object): Object containing student count data

**Data Structure:**

```javascript
{
  onstudentCntJB: 10,  // OnSite Junior Beginner
  instudentCntJB: 5,   // Online Junior Beginner
  onstudentCntJI: 8,   // OnSite Junior Intermediate
  // ... etc
}
```

**Features:**

- Displays counts for all class levels (JB, JI, JA, SB, SI, SA, AT, ST, AI, DS)
- Shows OnSite and Online counts separately
- Responsive table layout

### 3. WaitingList.jsx

**Displays waiting list counts by class and location**

**Props:**

- `waitingListCounts` (object): Object containing waiting list count data

**Data Structure:**

```javascript
{
  owaitingListCntJB: 3,  // OnSite Junior Beginner waiting list
  iwaitingListCntJB: 2,   // Online Junior Beginner waiting list
  // ... etc
}
```

**Features:**

- Displays waiting list for all class levels
- Shows OnSite and Online counts separately
- Matches EnrolledStudents layout for consistency

### 4. ToDoList.jsx

**Displays admin to-do items and user tracking summary**

**Props:**

- `trackingSummary` (array): Array of tracking data objects
- `onPublishDocument` (function): Callback for publishing documents
- `canPublishDocuments` (boolean): Permission flag for document publishing

**Tracking Data Structure:**

```javascript
[
  {
    visitedDate: "2024-01-15",
    webCount: 25,
    appCount: 10,
    updateScoreCnt: 5,
  },
  // ... more entries
];
```

**Features:**

- Publish class materials button with email option
- Quick links to curriculum and user tracking
- User tracking summary table with date, web visits, app visits, and score updates
- Conditional rendering based on admin privileges

### 5. SystemSupport.jsx

**Displays system administration links**

**Props:** None

**Features:**

- Links to various admin pages:
  - Student Waiting List
  - Volunteers Request
  - Time Sheet
  - Special Events Registration List
  - Upload Online Exam Answer Key
  - Update Lookup
  - Update Meeting Schedule
  - Update Donor Details
  - Post Message
- Clean list layout with navigation icons

### 6. StudentList.jsx ⭐ (MASTER REFERENCE)
**Displays current session student list with advanced features**
**⚠️ This component is the MASTER REFERENCE for table styling. All new tables must match this styling.**
**Props:**

- `students` (array): Array of student objects
- `onExportToExcel` (function): Callback for exporting to Excel
- `canExportData` (boolean): Permission flag for data export
- `onRefresh` (function): Callback for refreshing data

**Student Data Structure:**

```javascript
[
  {
    studentID: 123,
    studentName: "John Doe",
    class: "Junior Beginner",
    grade: "5th",
    school: "Example School",
    parentName: "Jane Doe",
    phoneNumber: "(555) 123-4567",
    emailAddress: "jane.doe@example.com",
    eventSession: "Fall 2024",
    eventLocation: "OnSite",
  },
  // ... more students
];
```

**Features:**

- Full-text search across all fields
- Sortable columns
- Pagination (10 rows per page)
- Edit student functionality
- Export to Excel button
- Refresh data button
- Responsive table layout
- Empty state handling
- **Standard green theme (#4caf50)**
- **Compact styling (0.75rem, 3px 5px padding)**

### 7. InstructorList.jsx

**Displays instructor list with full management capabilities**

**Props:**

- `instructors` (array): Array of instructor objects
- `onExportToExcel` (function): Callback for exporting to Excel
- `canExportData` (boolean): Permission flag for data export
- `onRefresh` (function): Callback for refreshing data
- `onEdit` (function): Callback for editing instructor
- `onDelete` (function): Callback for deleting instructor
- `onAdd` (function): Callback for adding instructor
- `canAddInstructor` (boolean): Permission flag for adding instructors

**Instructor Data Structure:**

```javascript
[
  {
    instructorID: 123,
    firstName: "John",
    lastName: "Doe",
    emailID: "john.doe@example.com",
    contactPhone: "(555) 123-4567",
    chapterName: "Agoura Hills",
    chapterID: "1",
    instructorType: "P",
    class: "JB",
    section: "A",
    userName: "john.doe@example.com",
    memberStatus: "1",
    lastLogin: "2024-01-15T10:30:00",
  },
  // ... more instructors
];
```

**Features:**

- Advanced search with 8 fields (ID, First Name, Last Name, Email, Chapter, Class, Type)
- Search criteria: Equals, Contains, Starts With
- Sortable columns (ascending/descending)
- Pagination (10 rows per page)
- Edit and Delete actions with confirmation dialog
- Add instructor button (System Admin only)
- Export to Excel button
- Refresh data button
- Status chips (Active/Inactive)
- Responsive table layout
- **Standard green theme (#4caf50)** ✅
- **Compact styling** ✅

### 8. InstructorForm.jsx

**Dialog form for adding and editing instructors**

**Props:**

- `open` (boolean): Dialog open state
- `onClose` (function): Close handler
- `onSubmit` (function): Submit handler
- `instructor` (object): Instructor data for editing
- `chapters` (array): Chapter options
- `isEdit` (boolean): Edit mode flag

**Features:**

- Add new instructor
- Edit existing instructor
- Form validation (required fields, email format)
- Chapter dropdown
- Class selection (13 options)
- Section selection (A, B, C)
- Instructor type (Primary, Secondary, Coordinator, Volunteer)
- Status selection (Active/Inactive)
- Real-time validation with error messages

### 9. InstructorManagement.jsx

**Main container for instructor management**

**Features:**

- Integrates InstructorList and InstructorForm
- Manages state for instructors and form dialog
- Handles all CRUD operations
- Admin privilege checking
- Global snackbar notifications
- Loading state management
- Error handling
- API integration

### 10. RegisteredStudentList.jsx ⭐ (NEW)

**Comprehensive registered student list management**

**Props:** None (self-contained component)

**Student Data Structure:**

```javascript
[
  {
    studentID: 123,
    studentName: "John Doe",
    chapter: "Agoura Hills",
    class: "JB",
    grade: "5th",
    school: "Example School",
    parentName: "Jane Doe",
    phoneNumber: "(555) 123-4567",
    emailAddress: "jane.doe@example.com",
    eventSession: "Fall 2024",
    eventLocation: "OnSite",
    registeredDate: "2024-01-15T00:00:00",
    sState: "CA",
    city: "Los Angeles",
    chapterID: "1",
    section: "A",
  },
  // ... more students
];
```

**Features:**

- Advanced search with 13 fields (Student ID, Name, Chapter, Class, Grade, School, Parent, Phone, Email, Session, Location, State, City)
- Search criteria: Equals, Contains, Starts With
- Client-side filtering and sorting
- Pagination (25 rows per page)
- Edit student class with dialog form
- Delete student with confirmation
- Export to Excel button
- Refresh data button
- Role-based access control
- Email notification after class update (backend)
- Responsive table layout
- **Standard green theme (#4caf50)** ✅
- **Compact styling** ✅
- 15 table columns with all student details
- Chapter location dropdown (populated from database)
- Class options (13 types: JB, JI, JA, SB, SI, SA, DS, AI, GD, AD, DM, ST, AT)
- Session options (Fall 2024, Spring 2024)
- Location options (OnSite, Internet)
- Section options (A, B)

**Related Documentation:**

- `REGISTERED_STUDENT_LIST_IMPLEMENTATION.md` - Full implementation guide
- `REGISTERED_STUDENT_LIST_QUICK_START.md` - Quick start guide
- `REGISTERED_STUDENT_LIST_SUMMARY.md` - Implementation summary

## API Services

### adminDashboardService.js

**Service for making API calls to the AdminDashboardController**

**Methods:**

#### `getDashboardData(username)`

Gets complete dashboard data in one call (efficient)

- **Returns:** Combined object with studentList, userTrackingSummary, and dashboardMessage

#### `getStudentList(request)`

Gets student list for admin dashboard

- **Params:** `{ username, mode }`
- **Returns:** Student list response

#### `getUserTrackingSummary(request)`

Gets user tracking summary

- **Params:** `{ }` (optional parameters)
- **Returns:** Tracking summary response

#### `getDashboardMessage(request)`

Gets dashboard message with student counts

- **Params:** `{ username, mode }`
- **Returns:** Dashboard message with counts

#### `publishDocument(request)`

Publishes documents and optionally sends email

- **Params:** `{ sendEmail }`
- **Returns:** Success/error response

#### `exportStudentListToExcel(request)`

Exports student list to Excel file

- **Params:** `{ username, mode }`
- **Returns:** Blob (Excel file)

#### `checkAdminPrivileges()`

Checks if current user has admin privileges

- **Returns:** Object with privilege flags

#### `downloadExcelFile(blob, filename)`

Helper to download Excel file from blob

- **Params:** Blob and filename
- **Returns:** Triggers browser download

### instructorService.js

**Service for making API calls to the InstructorController**

**Methods:**

#### `getInstructorList(username)`

Gets instructor list

- **Params:** Username
- **Returns:** Instructor list response

#### `addOrUpdateInstructor(instructorData)`

Adds or updates instructor

- **Params:** Instructor data object
- **Returns:** Success/error response

#### `deleteInstructor(instructorID)`

Deletes instructor

- **Params:** Instructor ID
- **Returns:** Success/error response

#### `exportInstructorListToExcel(username)`

Exports instructor list to Excel

- **Params:** Username
- **Returns:** Blob (Excel file)

#### `downloadExcelFile(blob, filename)`

Helper to download Excel file from blob

- **Params:** Blob and filename
- **Returns:** Triggers browser download

### registeredStudentListService.js (NEW)

**Service for making API calls to the RegisteredStudentListController**

**Methods:**

#### `getAllRegisteredStudents(username, mode)`

Gets all registered students

- **Params:** Username (optional), mode (optional)
- **Returns:** Student list response

#### `getDashboardData(username)`

Gets dashboard data with students and chapter locations

- **Params:** Username (optional)
- **Returns:** Dashboard data response

#### `getChapterLocations(activeOnly)`

Gets chapter locations

- **Params:** Active only flag (default: "N")
- **Returns:** Chapter locations response

#### `updateStudentClass(request)`

Updates student class information

- **Params:** Update student class request object
- **Returns:** Success/error response

#### `deleteStudent(studentId)`

Deletes student registration

- **Params:** Student ID
- **Returns:** Success/error response

#### `exportStudentListToExcel(request)`

Exports student list to Excel file

- **Params:** Export request object
- **Returns:** Blob (Excel file)

#### `checkRegisteredStudentListPrivileges()`

Checks if current user has registered student list privileges

- **Returns:** Object with privilege flags

## Usage

### Basic Usage

```javascript
import {
  AdminDashboard,
  InstructorManagement,
  RegisteredStudentList,
} from "./components/pstudyware/Admin";

function App() {
  return (
    <>
      <AdminDashboard />
      {/* Or */}
      <InstructorManagement />
      {/* Or */}
      <RegisteredStudentList />
    </>
  );
}
```

### Routing Setup

```javascript
import { Routes, Route } from "react-router-dom";
import {
  AdminDashboard,
  InstructorManagement,
  RegisteredStudentList,
} from "./components/pstudyware/Admin";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/pstudyware/admin/dashboard"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "SystemAdmin"]}
            allowedMemberTypes={["A"]}
          >
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/pstudyware/admin/instructors"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "SystemAdmin"]}
            allowedMemberTypes={["A"]}
          >
            <InstructorManagement />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/pstudyware/admin/registered-students"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "SystemAdmin"]}
            allowedMemberTypes={["A"]}
          >
            <RegisteredStudentList />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}
```

## Authentication & Authorization

The AdminDashboard component:

1. Checks if user is authenticated
2. Validates user has Admin or SystemAdmin role
3. Redirects non-admin users to appropriate dashboard
4. Checks admin privileges for specific actions (publish, export)

**Required User Properties:**

- `email` or `username`: User identifier
- `memberType`: Should be "A" for admin
- `role`: Should be "Admin" or "SystemAdmin"

## API Integration

The components integrate with the following API endpoints:

### Admin Dashboard Endpoints

- `GET /api/AdminDashboard/GetDashboardData`: Get all dashboard data
- `POST /api/AdminDashboard/GetStudentList`: Get student list
- `POST /api/AdminDashboard/GetUserTrackingSummary`: Get tracking summary
- `POST /api/AdminDashboard/GetDashboardMessage`: Get dashboard message
- `POST /api/AdminDashboard/PublishDocument`: Publish documents
- `POST /api/AdminDashboard/ExportStudentListToExcel`: Export to Excel
- `GET /api/AdminDashboard/CheckAdminPrivileges`: Check admin privileges

### Instructor Management Endpoints

- `POST /api/Instructor/GetInstructorList`: Get instructor list
- `POST /api/Instructor/AddOrUpdateInstructor`: Add or update instructor
- `POST /api/Instructor/DeleteInstructor`: Delete instructor
- `POST /api/Instructor/ExportInstructorListToExcel`: Export instructors to Excel

### Registered Student List Endpoints (NEW)

- `GET /api/RegisteredStudentList/GetAllRegisteredStudents`: Get all registered students
- `GET /api/RegisteredStudentList/GetDashboardData`: Get students and chapter locations
- `GET /api/RegisteredStudentList/GetChapterLocations`: Get chapter list
- `POST /api/RegisteredStudentList/UpdateStudentClass`: Update student class (Admin only)
- `DELETE /api/RegisteredStudentList/DeleteStudent/{studentId}`: Delete student (Admin only)
- `POST /api/RegisteredStudentList/ExportStudentListToExcel`: Export to Excel (Admin only)
- `GET /api/RegisteredStudentList/CheckRegisteredStudentListPrivileges`: Check user privileges

## Styling

### MANDATORY Table Styling Standards

**⚠️ ALL ADMIN TABLES MUST USE THE STANDARD GREEN COLOR SCHEME**

See `ADMIN_TABLE_STYLING_GUIDE.md` for complete specifications.

**Standard Colors:**

- Primary: `#4caf50` (GREEN)
- Header BG: `#e8f5e8`
- Borders: `#4caf50`
- Search/Pagination: `#4caf50`
- Font Size: `0.75rem`
- Padding: `3px 5px`

**Reference Implementation:**

- `StudentList.jsx` - MASTER REFERENCE (use as template)
- `InstructorList.jsx` - Correctly styled example

Custom styles are also defined in:

- `src/styles/AdminDashboard.css`

The components use Material-UI (MUI) for base styling with custom overrides for:

- Card animations
- **Table styling (GREEN THEME - MANDATORY)**
- Responsive design
- Print styles
- Status badges
- Custom colors

## Migration Notes

### From Admin_Dashboard.aspx

**Original Features → New Implementation:**

1. **To Do List Section** → `ToDoList.jsx`
   - Publish documents button → API call to PublishDocument endpoint
   - User tracking summary grid → React table with formatted data

2. **Enrolled Students Section** → `EnrolledStudents.jsx`
   - ASP.NET labels → React state and props
   - Static table → Dynamic Material-UI table

3. **Waiting List Section** → `WaitingList.jsx`
   - ASP.NET labels → React state and props
   - Static table → Dynamic Material-UI table

4. **System Support Section** → `SystemSupport.jsx`
   - Static links → Material-UI list with navigation

5. **Student List Grid** → `StudentList.jsx`
   - kGrid control → Material-UI DataGrid-like table
   - Server-side paging → Client-side paging
   - Export to Excel → API call with blob download

**Key Improvements:**

- ✅ Responsive design for mobile devices
- ✅ Real-time search and filtering
- ✅ Better user experience with loading states
- ✅ Modern Material-UI components
- ✅ Type-safe API integration
- ✅ Better error handling with snackbar messages
- ✅ Accessibility improvements

## Testing

### Manual Testing Checklist

- [ ] Login as admin user
- [ ] Verify dashboard loads with all sections
- [ ] Check student counts display correctly
- [ ] Check waiting list counts display correctly
- [ ] Verify user tracking summary loads
- [ ] Test publish documents button
- [ ] Test export to Excel functionality
- [ ] Test student search functionality
- [ ] Test column sorting
- [ ] Test pagination
- [ ] Test edit student button
- [ ] Test system support links navigation
- [ ] Test responsive layout on mobile
- [ ] Test error handling for failed API calls

## Dependencies

- React 18+
- Material-UI (@mui/material)
- React Router
- Axios (via api service)
- AuthContext (for authentication)

## Future Enhancements

Potential improvements:

1. Real-time data updates with SignalR/WebSockets
2. Advanced filtering options
3. Bulk operations on student list
4. Dashboard customization
5. Export to PDF functionality
6. Data visualization charts
7. Audit log viewer
8. Scheduled report generation

## Troubleshooting

### Common Issues

**Issue:** Dashboard doesn't load

- Check if user is authenticated
- Verify user has Admin role
- Check browser console for API errors
- Verify API base URL in config

**Issue:** Student list is empty

- Check API endpoint returns data
- Verify data structure matches expected format
- Check network tab for API response

**Issue:** Export to Excel fails

- Verify user has export permissions
- Check API endpoint supports blob response
- Ensure browser allows file downloads

**Issue:** Counts show 0 for all classes

- Check API endpoint returns dashboard message
- Verify data structure matches expected format
- Check if backend is calculating counts correctly

## Related Documentation

### Styling and Standards

- **`ADMIN_TABLE_STYLING_GUIDE.md`** - MANDATORY reading for all developers
- `StudentList.jsx` - Master reference implementation
- `InstructorList.jsx` - Correctly styled example

### Feature Documentation

- `INSTRUCTOR_MANAGEMENT_IMPLEMENTATION_SUMMARY.md` - Instructor management overview
- `INSTRUCTOR_MANAGEMENT_QUICK_START.md` - Quick start guide

## Support

For issues or questions, contact:

- Development Team
- Email: support@agouramathcircle.org

**For Styling Questions:**

- Read `ADMIN_TABLE_STYLING_GUIDE.md`
- Reference `StudentList.jsx` implementation
- Check `InstructorList.jsx` for recent example

## License

Copyright © Agoura Math Circle
