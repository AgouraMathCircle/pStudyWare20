using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Entity
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
} 