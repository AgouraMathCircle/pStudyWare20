using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for getting message center data request
    /// </summary>
    public class MessageCenterRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for sending email request
    /// </summary>
    public class SendEmailRequest
    {
        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Send From")]
        public string SendFrom { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;

        [Display(Name = "Email ID")]
        public int EmailId { get; set; } = 0;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "N"; // N = New, R = Reply

        [Display(Name = "Chapter ID")]
        public string ChapterId { get; set; } = string.Empty;

        [Display(Name = "From Name")]
        public string FromName { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty; // A = Admin, I = Instructor, S = Student, V = Volunteer
    }

    /// <summary>
    /// Model for updating email view request
    /// </summary>
    public class UpdateEmailViewRequest
    {
        [Display(Name = "Mode")]
        public string Mode { get; set; } = string.Empty; // V = View, T = Track

        [Display(Name = "Tracking ID")]
        public string TrackingId { get; set; } = string.Empty;

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting specific message request
    /// </summary>
    public class GetMessageRequest
    {
        [Display(Name = "Email ID")]
        public string EmailId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting instructor email groups request
    /// </summary>
    public class InstructorEmailGroupRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting student list request
    /// </summary>
    public class StudentListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = "I"; // I = Instructor
    }

    /// <summary>
    /// Model for export Excel request
    /// </summary>
    public class ExportMessageCenterExcelRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for message center response
    /// </summary>
    public class MessageCenterResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message Center Data")]
        public object MessageCenterData { get; set; } = new object();
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
    /// Model for update email view response
    /// </summary>
    public class UpdateEmailViewResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get message response
    /// </summary>
    public class GetMessageResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message Content")]
        public string MessageContent { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for instructor email groups response
    /// </summary>
    public class InstructorEmailGroupResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Email Groups")]
        public object EmailGroups { get; set; } = new object();
    }

    /// <summary>
    /// Model for student list response
    /// </summary>
    public class StudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();
    }

    /// <summary>
    /// Model for export Excel response
    /// </summary>
    public class ExportMessageCenterExcelResponse
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
    /// Model for email action request (handles different actions like View, Reply, Track, etc.)
    /// </summary>
    public class EmailActionRequest
    {
        [Display(Name = "Action")]
        public string Action { get; set; } = string.Empty; // V = View, R = Reply, T = Track, U = Update

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Email ID")]
        public string EmailId { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;

        [Display(Name = "Tracking ID")]
        public string TrackingId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for email action response
    /// </summary>
    public class EmailActionResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Action Data")]
        public object ActionData { get; set; } = new object();

        [Display(Name = "Message Content")]
        public string MessageContent { get; set; } = string.Empty;

        [Display(Name = "From Name")]
        public string FromName { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;
    }
}
