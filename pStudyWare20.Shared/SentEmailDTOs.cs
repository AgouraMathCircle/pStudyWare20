using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Request to get sent messages
    /// </summary>
    public class GetSentMessagesRequest
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response containing sent messages
    /// </summary>
    public class GetSentMessagesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Messages")]
        public List<SentMessageInfo> Messages { get; set; } = new List<SentMessageInfo>();
    }

    /// <summary>
    /// Sent message information
    /// </summary>
    public class SentMessageInfo
    {
        [Display(Name = "Message ID")]
        public int MessageID { get; set; }

        [Display(Name = "Send From")]
        public string SendFrom { get; set; } = string.Empty;

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Send Date")]
        public DateTime SendDate { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Email ID")]
        public int EmailID { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Student Name")]
        public string StudentName { get; set; } = string.Empty;

        [Display(Name = "Message To")]
        public string MessageTo { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request to get specific message details
    /// </summary>
    public class GetMessageDetailsRequest
    {
        [Required]
        [Display(Name = "Email ID")]
        public int EmailID { get; set; }
    }

    /// <summary>
    /// Response containing message details
    /// </summary>
    public class GetMessageDetailsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Email ID")]
        public int EmailID { get; set; }

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;
    }
}
