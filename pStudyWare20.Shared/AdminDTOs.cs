using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for admin dashboard student list request
    /// </summary>
    public class AdminStudentListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "D";
    }

    /// <summary>
    /// Model for user tracking summary request
    /// </summary>
    public class UserTrackingSummaryRequest
    {
        // No specific parameters needed for this request
    }

    /// <summary>
    /// Model for dashboard message request
    /// </summary>
    public class DashboardMessageRequest
    {
        [Display(Name = "Mode")]
        public string Mode { get; set; } = "A";

        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for publish document request
    /// </summary>
    public class PublishDocumentRequest
    {
        [Display(Name = "Send Email")]
        public bool SendEmail { get; set; } = false;
    }

    /// <summary>
    /// Model for export Excel request
    /// </summary>
    public class ExportExcelRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "D";
    }

    /// <summary>
    /// Model for student list response
    /// </summary>
    public class AdminStudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();
    }

    /// <summary>
    /// Model for user tracking summary response
    /// </summary>
    public class UserTrackingSummaryResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Tracking Summary")]
        public object TrackingSummary { get; set; } = new object();
    }

    /// <summary>
    /// Model for dashboard message response
    /// </summary>
    public class DashboardMessageResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student Counts")]
        public StudentCounts StudentCounts { get; set; } = new StudentCounts();
    }

    /// <summary>
    /// Model for student counts in dashboard
    /// </summary>
    public class StudentCounts
    {
        // Online Student Counts
        [Display(Name = "Online Student Count JA")]
        public int OnlineStudentCountJA { get; set; }

        [Display(Name = "Online Student Count JB")]
        public int OnlineStudentCountJB { get; set; }

        [Display(Name = "Online Student Count JI")]
        public int OnlineStudentCountJI { get; set; }

        [Display(Name = "Online Student Count SA")]
        public int OnlineStudentCountSA { get; set; }

        [Display(Name = "Online Student Count SB")]
        public int OnlineStudentCountSB { get; set; }

        [Display(Name = "Online Student Count SI")]
        public int OnlineStudentCountSI { get; set; }

        [Display(Name = "Online Student Count AI")]
        public int OnlineStudentCountAI { get; set; }

        [Display(Name = "Online Student Count AT")]
        public int OnlineStudentCountAT { get; set; }

        [Display(Name = "Online Student Count DS")]
        public int OnlineStudentCountDS { get; set; }

        [Display(Name = "Online Student Count ST")]
        public int OnlineStudentCountST { get; set; }

        // In-Person Student Counts
        [Display(Name = "In-Person Student Count JA")]
        public int InPersonStudentCountJA { get; set; }

        [Display(Name = "In-Person Student Count JB")]
        public int InPersonStudentCountJB { get; set; }

        [Display(Name = "In-Person Student Count JI")]
        public int InPersonStudentCountJI { get; set; }

        [Display(Name = "In-Person Student Count SA")]
        public int InPersonStudentCountSA { get; set; }

        [Display(Name = "In-Person Student Count SB")]
        public int InPersonStudentCountSB { get; set; }

        [Display(Name = "In-Person Student Count SI")]
        public int InPersonStudentCountSI { get; set; }

        // Online Waiting List Counts
        [Display(Name = "Online Waiting List Count AI")]
        public int OnlineWaitingListCountAI { get; set; }

        [Display(Name = "Online Waiting List Count AT")]
        public int OnlineWaitingListCountAT { get; set; }

        [Display(Name = "Online Waiting List Count JA")]
        public int OnlineWaitingListCountJA { get; set; }

        [Display(Name = "Online Waiting List Count JB")]
        public int OnlineWaitingListCountJB { get; set; }

        [Display(Name = "Online Waiting List Count JI")]
        public int OnlineWaitingListCountJI { get; set; }

        [Display(Name = "Online Waiting List Count SA")]
        public int OnlineWaitingListCountSA { get; set; }

        [Display(Name = "Online Waiting List Count SB")]
        public int OnlineWaitingListCountSB { get; set; }

        [Display(Name = "Online Waiting List Count SI")]
        public int OnlineWaitingListCountSI { get; set; }

        [Display(Name = "Online Waiting List Count ST")]
        public int OnlineWaitingListCountST { get; set; }

        // In-Person Waiting List Counts
        [Display(Name = "In-Person Waiting List Count AI")]
        public int InPersonWaitingListCountAI { get; set; }

        [Display(Name = "In-Person Waiting List Count AT")]
        public int InPersonWaitingListCountAT { get; set; }

        [Display(Name = "In-Person Waiting List Count JA")]
        public int InPersonWaitingListCountJA { get; set; }

        [Display(Name = "In-Person Waiting List Count JB")]
        public int InPersonWaitingListCountJB { get; set; }

        [Display(Name = "In-Person Waiting List Count JI")]
        public int InPersonWaitingListCountJI { get; set; }

        [Display(Name = "In-Person Waiting List Count SA")]
        public int InPersonWaitingListCountSA { get; set; }

        [Display(Name = "In-Person Waiting List Count SB")]
        public int InPersonWaitingListCountSB { get; set; }

        [Display(Name = "In-Person Waiting List Count SI")]
        public int InPersonWaitingListCountSI { get; set; }
    }

    /// <summary>
    /// Model for publish document response
    /// </summary>
    public class PublishDocumentResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for export Excel response
    /// </summary>
    public class ExportExcelResponse
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
}
