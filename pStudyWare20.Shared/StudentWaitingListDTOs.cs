using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for student waiting list (matches StudentWaitingList from legacy system)
    /// </summary>
    public class StudentWaitingList
    {
        [Display(Name = "Student ID")]
        public int StudentID { get; set; }

        [Display(Name = "Student Name")]
        public string StudentName { get; set; } = string.Empty;

        [Display(Name = "Event Location")]
        public string EventLocation { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Grade")]
        public string Grade { get; set; } = string.Empty;

        [Display(Name = "School")]
        public string School { get; set; } = string.Empty;

        [Display(Name = "Parent Name")]
        public string ParentName { get; set; } = string.Empty;

        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Display(Name = "Email Address")]
        public string EmailAddress { get; set; } = string.Empty;

        [Display(Name = "Event Session")]
        public string EventSession { get; set; } = string.Empty;

        [Display(Name = "Registered Date")]
        public DateTime RegisteredDate { get; set; }

        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;

        [Display(Name = "City")]
        public string City { get; set; } = string.Empty;

        [Display(Name = "State")]
        public string State { get; set; } = string.Empty;

        [Display(Name = "Country")]
        public string Country { get; set; } = string.Empty;

        [Display(Name = "Application Status")]
        public string ApplicationStatus { get; set; } = string.Empty;

        [Display(Name = "Student Class Info")]
        public string StudentClassInfo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for chapter location from AMC_ChapterMaster (Name, Location, City).
    /// </summary>
    public class ChapterLocation
    {
        [Display(Name = "Chapter ID")]
        public string ChapterID { get; set; } = string.Empty;

        [Display(Name = "Chapter Name")]
        public string ChapterName { get; set; } = string.Empty;

        [Display(Name = "Location")]
        public string Location { get; set; } = string.Empty;

        [Display(Name = "City")]
        public string City { get; set; } = string.Empty;

        [Display(Name = "Label")]
        public string Label { get; set; } = string.Empty;
    }

    /// <summary>
    /// Session option from AMC_tblLookupSemester (Semester / LastSemester / NextSemester).
    /// </summary>
    public class StudentWaitingListSessionOption
    {
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response for active session dropdown options.
    /// </summary>
    public class StudentWaitingListSessionOptionsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Session Options")]
        public List<StudentWaitingListSessionOption> SessionOptions { get; set; } = new List<StudentWaitingListSessionOption>();
    }

    /// <summary>
    /// Model for get student waiting list request
    /// </summary>
    public class GetStudentWaitingListRequest
    {
        [Display(Name = "Waiting For OnSite")]
        [Required(ErrorMessage = "Waiting For OnSite is required")]
        public string WaitingForOnSite { get; set; } = "N";

        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for update student waiting list status request
    /// </summary>
    public class UpdateStudentWaitingListStatusRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public string StudentID { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        [Required(ErrorMessage = "Chapter ID is required")]
        public string ChapterID { get; set; } = string.Empty;

        [Display(Name = "Location")]
        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Application Status")]
        [Required(ErrorMessage = "Application Status is required")]
        public string ApplicationStatus { get; set; } = string.Empty;

        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;

        [Display(Name = "Reason")]
        public string Reason { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for get chapter location request
    /// </summary>
    public class GetChapterLocationRequest
    {
        [Display(Name = "Mode")]
        [Required(ErrorMessage = "Mode is required")]
        public string Mode { get; set; } = "N";
    }

    /// <summary>
    /// Model for get password request
    /// </summary>
    public class GetPasswordRequest
    {
        [Display(Name = "Email ID")]
        [Required(ErrorMessage = "Email ID is required")]
        public string EmailId { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for student waiting list response
    /// </summary>
    public class StudentWaitingListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student Waiting List")]
        public List<StudentWaitingList> StudentWaitingList { get; set; } = new List<StudentWaitingList>();
    }

    /// <summary>
    /// Model for chapter location response
    /// </summary>
    public class ChapterLocationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Chapter Locations")]
        public List<ChapterLocation> ChapterLocations { get; set; } = new List<ChapterLocation>();
    }

    /// <summary>
    /// Model for password response
    /// </summary>
    public class PasswordResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for operation response
    /// </summary>
    public class OperationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }

}
