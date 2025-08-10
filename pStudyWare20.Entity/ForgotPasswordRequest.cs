using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Entity
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
} 