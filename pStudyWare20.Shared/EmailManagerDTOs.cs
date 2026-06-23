using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for get messages request
    /// </summary>
    public class GetMessagesRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get messages response
    /// </summary>
    public class GetMessagesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Messages")]
        public List<MessageInfo> Messages { get; set; } = new List<MessageInfo>();
    }

    /// <summary>
    /// Model for unread message count response (AMC_spGetMessageCenter @Mode = C)
    /// </summary>
    public class GetMessageTotalResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Total")]
        public int Total { get; set; }
    }

    /// <summary>
    /// Model for message information
    /// </summary>
    public class MessageInfo
    {
        public int MessageID { get; set; }
        public int TrackingID { get; set; }
        public string SendFrom { get; set; } = string.Empty;
        public string SendTo { get; set; } = string.Empty;
        public string SendBy { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SendDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        /// <summary>Raw ET.SendFrom username parsed from legacy Emailinfo (used for replies).</summary>
        public string SenderUsername { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get specific message request
    /// </summary>
    public class GetMessageRequest
    {
        [Required]
        [Display(Name = "Email ID")]
        public int EmailID { get; set; }
    }

    /// <summary>
    /// Model for get specific message response
    /// </summary>
    public class GetMessageResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public MessageInfo? Message { get; set; }
    }

    /// <summary>
    /// Model for send message request
    /// </summary>
    public class SendMessageRequest
    {
        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Send From")]
        public string SendFrom { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;

        [Display(Name = "Reply To Email ID")]
        public int? ReplyToEmailID { get; set; }

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "N"; // N = New, R = Reply

        [Display(Name = "Chapter ID")]
        public string ChapterID { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "From Name")]
        public string FromName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for send message response
    /// </summary>
    public class SendMessageResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for update message status request
    /// </summary>
    public class UpdateMessageStatusRequest
    {
        [Required]
        [Display(Name = "Tracking ID")]
        public int TrackingID { get; set; }

        [Required]
        [Display(Name = "Mode")]
        public string Mode { get; set; } = "T"; // T = Trash/Delete, V = Viewed

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for update message status response
    /// </summary>
    public class UpdateMessageStatusResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get instructor email groups request
    /// </summary>
    public class GetInstructorEmailGroupsRequest
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get instructor email groups response
    /// </summary>
    public class GetInstructorEmailGroupsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Email Groups")]
        public List<EmailGroup> EmailGroups { get; set; } = new List<EmailGroup>();
    }

    /// <summary>
    /// Model for email group
    /// </summary>
    public class EmailGroup
    {
        public string Value { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get student list request
    /// </summary>
    public class GetStudentListForEmailRequest
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = "I"; // I = Instructor
    }

    /// <summary>
    /// Model for get student list response
    /// </summary>
    public class GetStudentListForEmailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Students")]
        public List<StudentEmailInfo> Students { get; set; } = new List<StudentEmailInfo>();
    }

    /// <summary>
    /// Model for student email information
    /// </summary>
    public class StudentEmailInfo
    {
        public string Value { get; set; } = string.Empty; // Email~InstructorEmail format
        public string Text { get; set; } = string.Empty; // Student name
    }

    /// <summary>
    /// Model for export messages to Excel request
    /// </summary>
    public class ExportMessagesRequest
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for export messages to Excel response
    /// </summary>
    public class ExportMessagesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "File Name")]
        public string FileName { get; set; } = "MessageCenter.xls";

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "Content Type")]
        public string ContentType { get; set; } = "application/vnd.ms-excel";

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
