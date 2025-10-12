using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for post message (matches PostMessage from legacy system)
    /// </summary>
    public class PostMessage
    {
        [Display(Name = "Message ID")]
        public int MessageID { get; set; }

        [Display(Name = "Posted By")]
        public string PostedBy { get; set; } = string.Empty;

        [Display(Name = "Posted Date")]
        public string PostedDate { get; set; } = string.Empty;

        [Display(Name = "Active")]
        public bool Active { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Alert Date")]
        public string AlertDate { get; set; } = string.Empty;

        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Row ID")]
        public int RowID { get; set; }
    }

    /// <summary>
    /// Model for post message request
    /// </summary>
    public class PostMessageRequest
    {
        [Display(Name = "Message ID")]
        public string MessageID { get; set; } = "0";

        [Display(Name = "Posted By")]
        [Required(ErrorMessage = "Posted By is required")]
        public string PostedBy { get; set; } = string.Empty;

        [Display(Name = "Posted Date")]
        [Required(ErrorMessage = "Posted Date is required")]
        [RegularExpression(@"^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$", ErrorMessage = "Please enter date in MM/DD/YYYY format")]
        public string PostedDate { get; set; } = string.Empty;

        [Display(Name = "Active")]
        [Required(ErrorMessage = "Active status is required")]
        public string Active { get; set; } = "0";

        [Display(Name = "Message")]
        [Required(ErrorMessage = "Message is required")]
        [StringLength(1000, ErrorMessage = "Message cannot exceed 1000 characters")]
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get alert list request
    /// </summary>
    public class GetAlertListRequest
    {
        [Display(Name = "Row ID")]
        public string? RowID { get; set; }
    }

    /// <summary>
    /// Model for delete post message request
    /// </summary>
    public class DeletePostMessageRequest
    {
        [Display(Name = "Message ID")]
        [Required(ErrorMessage = "Message ID is required")]
        public string MessageID { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for post message list response
    /// </summary>
    public class PostMessageListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Post Messages")]
        public List<PostMessage> PostMessages { get; set; } = new List<PostMessage>();
    }

    /// <summary>
    /// Model for post message detail response
    /// </summary>
    public class PostMessageDetailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Post Message")]
        public PostMessage? PostMessage { get; set; }
    }

    /// <summary>
    /// Model for post message operation response
    /// </summary>
    public class PostMessageOperationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }
}
