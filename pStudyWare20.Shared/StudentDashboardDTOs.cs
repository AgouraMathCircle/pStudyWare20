using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Student profile information
    /// </summary>
    public class StudentProfile
    {
        public int StudentID { get; set; }
        public string StudentFName { get; set; } = string.Empty;
        public string StudentLName { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string StudentEmail { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string ParentName { get; set; } = string.Empty;
        public string ParentEmail { get; set; } = string.Empty;
        public string ParentPhone { get; set; } = string.Empty;
        public DateTime? DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
        public bool IsActive { get; set; }
    }

    /// <summary>
    /// Report card/grade information
    /// </summary>
    public class ReportCardEntry
    {
        public int ReportCardID { get; set; }
        public int StudentID { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public decimal? Score { get; set; }
        public string Semester { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Comments { get; set; } = string.Empty;
        public DateTime? ExamDate { get; set; }
        public string ExamType { get; set; } = string.Empty;
        public DateTime? DateCreated { get; set; }
    }

    /// <summary>
    /// Registration status information
    /// </summary>
    public class RegistrationStatus
    {
        public int RegistrationID { get; set; }
        public int StudentID { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
        public string SemesterName { get; set; } = string.Empty;
        public string EventLocation { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // "Open", "Full - Closed", "Waiting List"
        public DateTime? RegistrationDate { get; set; }
        public bool IsRegistered { get; set; }
        public bool CanRegister { get; set; }
        public bool IsWaitingList { get; set; }
    }

    /// <summary>
    /// Registration information for email notifications
    /// </summary>
    public class RegistrationInfo
    {
        public int StudentID { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
        public string SemesterName { get; set; } = string.Empty;
        public string EventLocation { get; set; } = string.Empty;
        public string ParentEmail { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request to get student profile
    /// </summary>
    public class GetStudentProfileRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public int ChapterID { get; set; }
    }

    /// <summary>
    /// Response for student profile
    /// </summary>
    public class GetStudentProfileResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public StudentProfile? StudentProfile { get; set; }
    }

    /// <summary>
    /// Request to get report card
    /// </summary>
    public class GetReportCardRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response for report card
    /// </summary>
    public class GetReportCardResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<ReportCardEntry> ReportCardEntries { get; set; } = new List<ReportCardEntry>();
    }

    /// <summary>
    /// Request to get registration status
    /// </summary>
    public class GetRegistrationStatusRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response for registration status
    /// </summary>
    public class GetRegistrationStatusResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<RegistrationStatus> RegistrationStatuses { get; set; } = new List<RegistrationStatus>();
        public bool ShowRegistrationWindow { get; set; }
    }

    /// <summary>
    /// Request to submit registration
    /// </summary>
    public class SubmitRegistrationRequest
    {
        [Required]
        public int StudentID { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response for registration submission
    /// </summary>
    public class SubmitRegistrationResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool EmailSentToAdmin { get; set; }
        public bool EmailSentToParent { get; set; }
    }

    /// <summary>
    /// Request to get registration info for email
    /// </summary>
    public class GetRegistrationInfoRequest
    {
        [Required]
        public int StudentID { get; set; }
    }

    /// <summary>
    /// Response for registration info
    /// </summary>
    public class GetRegistrationInfoResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public RegistrationInfo? RegistrationInfo { get; set; }
    }


    public class Messages
    {
        public string ImportantNotice { get; set; } = string.Empty;
        public string Announcement { get; set; } = string.Empty;
        public string Competitions { get; set; } = string.Empty;
        public string TodoList { get; set; } = string.Empty;

    }

    /// <summary>
    /// Request to get dashboard Messages
    /// </summary>
    public class GetDashboardMessageRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public int ChapterID { get; set; }
    }

    /// <summary>
    /// Response for dashboard Message
    /// </summary>
    public class GetDashboardMessageResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string ImportantNotice { get; set; } = string.Empty;
        public string Announcement { get; set; } = string.Empty;
        public string Competitions { get; set; } = string.Empty;
        public string TodoList { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request to check registration eligibility
    /// </summary>
    public class CheckRegistrationEligibilityRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response for registration eligibility
    /// </summary>
    public class CheckRegistrationEligibilityResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsEligible { get; set; }
        public bool ShowRegistrationWindow { get; set; }
        public List<RegistrationStatus> AvailableRegistrations { get; set; } = new List<RegistrationStatus>();
    }
}
