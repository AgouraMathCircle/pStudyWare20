using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for send email request
    /// </summary>
    public class SendEmailRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "To")]
        public string To { get; set; } = string.Empty;

        [Display(Name = "From")]
        public string From { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Body")]
        public string Body { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for send email response
    /// </summary>
    public class SendEmailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for report card list request
    /// </summary>
    public class ReportCardListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for report card list response
    /// </summary>
    public class ReportCardListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Report Card List")]
        public object ReportCardList { get; set; } = new object();
    }

    /// <summary>
    /// Model for getting score details for editing
    /// </summary>
    public class GetScoreDetailsRequest
    {
        [Display(Name = "Report Card ID")]
        [Required(ErrorMessage = "Report Card ID is required")]
        public string ReportCardId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting score details response
    /// </summary>
    public class GetScoreDetailsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Score Details")]
        public ScoreDetails? ScoreDetails { get; set; }
    }

    /// <summary>
    /// Model for score details
    /// </summary>
    public class ScoreDetails
    {
        [Display(Name = "Report Card ID")]
        public string ReportCardId { get; set; } = string.Empty;

        [Display(Name = "Student ID")]
        public string StudentId { get; set; } = string.Empty;

        [Display(Name = "Student Name")]
        public string StudentName { get; set; } = string.Empty;

        [Display(Name = "Group")]
        public string Group { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Exam Date")]
        public string ExamDate { get; set; } = string.Empty;

        [Display(Name = "Total Credit")]
        public string TotalCredit { get; set; } = string.Empty;

        [Display(Name = "Received Credit")]
        public string ReceivedCredit { get; set; } = string.Empty;

        [Display(Name = "Comments")]
        public string Comments { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for deleting score request
    /// </summary>
    public class DeleteScoreRequest
    {
        [Display(Name = "Report Card ID")]
        [Required(ErrorMessage = "Report Card ID is required")]
        public string ReportCardId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for deleting score response
    /// </summary>
    public class DeleteScoreResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for student score response
    /// </summary>
    public class StudentScoreResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for view report request
    /// </summary>
    public class ViewReportRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Report Date")]
        public string ReportDate { get; set; } = string.Empty;

        [Display(Name = "Is Semester Report")]
        public bool IsSemesterReport { get; set; }
    }

    /// <summary>
    /// Model for view report response
    /// </summary>
    public class ViewReportResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Report Data")]
        public object ReportData { get; set; } = new object();
    }


    /// <summary>
    /// Model for Excel import request
    /// </summary>
    public class ExcelImportRequest
    {
        [Display(Name = "Exam Date")]
        public string ExamDate { get; set; } = string.Empty;

        [Display(Name = "Group")]
        public string Group { get; set; } = string.Empty;

        [Display(Name = "Total Quiz Score")]
        public string TotalQuizScore { get; set; } = string.Empty;

        [Display(Name = "Total Class Test Score")]
        public string TotalClassTestScore { get; set; } = string.Empty;

        [Display(Name = "Total Home Work Score")]
        public string TotalHomeWorkScore { get; set; } = string.Empty;

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "File Name")]
        public string FileName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for Excel import response
    /// </summary>
    public class ExcelImportResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for Excel export request
    /// </summary>
    public class ExcelExportRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Is Summary Report")]
        public bool IsSummaryReport { get; set; }
    }

    /// <summary>
    /// Model for Excel export response
    /// </summary>
    public class ExcelExportResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "File Name")]
        public string FileName { get; set; } = string.Empty;

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "Content Type")]
        public string ContentType { get; set; } = "application/vnd.xlsx";

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for report card dashboard data request
    /// </summary>
    public class ReportCardDashboardRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for report card dashboard data response
    /// </summary>
    public class ReportCardDashboardResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Report Card List")]
        public object ReportCardList { get; set; } = new object();

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();

        [Display(Name = "Class List")]
        public object ClassList { get; set; } = new object();

        [Display(Name = "Report Date List")]
        public object ReportDateList { get; set; } = new object();

        [Display(Name = "Exam Date List")]
        public object ExamDateList { get; set; } = new object();
    }

    /// <summary>
    /// Model for report card privileges check response
    /// </summary>
    public class ReportCardPrivilegesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Is Student")]
        public bool IsStudent { get; set; }

        [Display(Name = "Role")]
        public string Role { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "Can Update Scores")]
        public bool CanUpdateScores { get; set; }

        [Display(Name = "Can Delete Scores")]
        public bool CanDeleteScores { get; set; }

        [Display(Name = "Can Import Excel")]
        public bool CanImportExcel { get; set; }

        [Display(Name = "Can Export Data")]
        public bool CanExportData { get; set; }

        [Display(Name = "Can Send Emails")]
        public bool CanSendEmails { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for score action request (handles different actions like Edit, Delete)
    /// </summary>
    public class ScoreActionRequest
    {
        [Display(Name = "Action")]
        public string Action { get; set; } = string.Empty; // E = Edit, D = Delete

        [Display(Name = "Score ID")]
        public string ScoreId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for score action response
    /// </summary>
    public class ScoreActionResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Action Data")]
        public object ActionData { get; set; } = new object();

        [Display(Name = "Score Details")]
        public ScoreDetails? ScoreDetails { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student report card email request
    /// </summary>
    public class SendStudentReportEmailRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Report Date")]
        public string ReportDate { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student report card email response
    /// </summary>
    public class SendStudentReportEmailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
