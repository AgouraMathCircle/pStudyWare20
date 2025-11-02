using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Entity
{
    /// <summary>
    /// Request model for updating user password
    /// </summary>
    public class UpdatePasswordRequest
    {
        /// <summary>
        /// Username (email) of the user whose password needs to be updated
        /// </summary>
        [Required(ErrorMessage = "Username is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// New password for the user
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [StringLength(10, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 10 characters")]
        public string Password { get; set; } = string.Empty;
    }
}

