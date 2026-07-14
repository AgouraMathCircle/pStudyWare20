using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Entity
{
    /// <summary>
    /// Request to change password for the currently authenticated user (identity from JWT).
    /// Matches legacy flow: verify current password via <c>pWebMemberFrm</c> GetPassword, then <c>AMC_spPasswordUpdate</c> with account username.
    /// </summary>
    public class ChangePasswordRequest
    {
        /// <summary>
        /// Existing password (plain text, same as legacy Web API / database).
        /// </summary>
        [Required(ErrorMessage = "Current password is required")]
        [StringLength(50, ErrorMessage = "Current password cannot exceed 50 characters")]
        public string CurrentPassword { get; set; } = string.Empty;

        /// <summary>
        /// New password for the user.
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [StringLength(16, MinimumLength = 10, ErrorMessage = "New password must be between 10 and 16 characters")]
        public string Password { get; set; } = string.Empty;
    }
}
