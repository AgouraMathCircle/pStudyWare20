using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for registered student list request
    /// </summary>
    public class RegisteredStudentListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for registered student list response
    /// </summary>
    public class RegisteredStudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();
    }

    /// <summary>
    /// Model for updating student class request
    /// </summary>
    public class UpdateStudentClassRequest
    {
        [Display(Name = "Student ID")]
        public string StudentId { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        public string ChapterId { get; set; } = string.Empty;

        [Display(Name = "Location")]
        public string Location { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Class Label")]
        public string ClassLabel { get; set; } = string.Empty;

        [Display(Name = "Chapter Name")]
        public string ChapterName { get; set; } = string.Empty;

        [Display(Name = "Location Label")]
        public string LocationLabel { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for updating student class response
    /// </summary>
    public class UpdateStudentClassResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for deleting student request
    /// </summary>
    public class DeleteStudentRequest
    {
        [Display(Name = "Student ID")]
        public string StudentId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for deleting student response
    /// </summary>
    public class DeleteStudentResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting student details for update request
    /// </summary>
    public class GetStudentForUpdateRequest
    {
        [Display(Name = "Student ID")]
        public string StudentId { get; set; } = string.Empty;

        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        public string ChapterId { get; set; } = string.Empty;

        [Display(Name = "Location")]
        public string Location { get; set; } = string.Empty;

        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting student details for update response
    /// </summary>
    public class GetStudentForUpdateResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student Details")]
        public GetStudentForUpdateRequest StudentDetails { get; set; } = new GetStudentForUpdateRequest();
    }


    /// <summary>
    /// Model for export Excel request
    /// </summary>
    public class ExportStudentListExcelRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "E";
    }

    /// <summary>
    /// Model for export Excel response
    /// </summary>
    public class ExportStudentListExcelResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "File Name")]
        public string FileName { get; set; } = string.Empty;

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "Content Type")]
        public string ContentType { get; set; } = "application/octet-stream";

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for registered student list dashboard data request
    /// </summary>
    public class RegisteredStudentListDashboardRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Session option for update-class dialog (legacy drSession).
    /// </summary>
    public class RegisteredStudentSessionOption
    {
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for registered student list dashboard data response
    /// </summary>
    public class RegisteredStudentListDashboardResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();

        [Display(Name = "Chapter Locations")]
        public object ChapterLocations { get; set; } = new object();

        [Display(Name = "Session Options")]
        public List<RegisteredStudentSessionOption> SessionOptions { get; set; } = new List<RegisteredStudentSessionOption>();
    }

    /// <summary>
    /// Model for registered student list privileges check response
    /// </summary>
    public class RegisteredStudentListPrivilegesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Is Admin")]
        public bool IsAdmin { get; set; }

        [Display(Name = "Role")]
        public string Role { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "Can Update Students")]
        public bool CanUpdateStudents { get; set; }

        [Display(Name = "Can Delete Students")]
        public bool CanDeleteStudents { get; set; }

        [Display(Name = "Can Export Data")]
        public bool CanExportData { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student action request (handles different actions like Edit, Delete)
    /// </summary>
    public class StudentActionRequest
    {
        [Display(Name = "Action")]
        public string Action { get; set; } = string.Empty; // E = Edit, D = Delete

        [Display(Name = "Student ID")]
        public string StudentId { get; set; } = string.Empty;

        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        public string ChapterId { get; set; } = string.Empty;

        [Display(Name = "Location")]
        public string Location { get; set; } = string.Empty;

        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student action response
    /// </summary>
    public class StudentActionResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Action Data")]
        public object ActionData { get; set; } = new object();

        [Display(Name = "Student Details")]
        public GetStudentForUpdateRequest? StudentDetails { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }
}
