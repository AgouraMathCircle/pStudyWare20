using System.ComponentModel.DataAnnotations;
namespace pStudyWare20.Shared
{
    public class ContactEnquiryRequest
    {
        [Required(ErrorMessage = "Please enter your name.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter your Email ID.")]
        [EmailAddress(ErrorMessage = "Please enter a valid Email ID.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter subject.")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter your message.")]
        public string Message { get; set; } = string.Empty;

        /// <summary>Honeypot field — must stay empty (bots often fill hidden inputs).</summary>
        public string Website { get; set; } = string.Empty;

        /// <summary>Unix timestamp (ms) when the user opened the form.</summary>
        public long FormStartedAt { get; set; }

        public int CaptchaOperandA { get; set; }
        public int CaptchaOperandB { get; set; }
        public int CaptchaAnswer { get; set; }
    }

    public class ContactEnquiryResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
