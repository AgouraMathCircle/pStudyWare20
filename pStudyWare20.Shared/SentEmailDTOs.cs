using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for sent email message (matches SentEmail from legacy system)
    /// </summary>
    public class SentEmailMessage
    {
        [Display(Name = "Message ID")]
        public int MessageID { get; set; }

        [Display(Name = "Email ID")]
        public string EmailID { get; set; } = string.Empty;

        [Display(Name = "Send From")]
        public string SendFrom { get; set; } = string.Empty;

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Send Date")]
        public DateTime SendDate { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;

        [Display(Name = "Email Info")]
        public string EmailInfo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get sent messages request
    /// </summary>
    public class GetSentMessagesRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for view email request
    /// </summary>
    public class ViewEmailRequest
    {
        [Display(Name = "Email ID")]
        [Required(ErrorMessage = "Email ID is required")]
        public string EmailID { get; set; } = string.Empty;

        [Display(Name = "Send To")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        public string SendBy { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for sent messages list response
    /// </summary>
    public class SentMessagesListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Sent Messages")]
        public List<SentEmailMessage> SentMessages { get; set; } = new List<SentEmailMessage>();
    }

    /// <summary>
    /// Model for message detail response
    /// </summary>
    public class MessageDetailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for view email response
    /// </summary>
    public class ViewEmailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Email Message")]
        public SentEmailMessage? EmailMessage { get; set; }
    }
}
