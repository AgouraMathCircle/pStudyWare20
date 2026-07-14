namespace pStudyWare20.Entity
{
    /// <summary>
    /// Response model for change-password operation
    /// </summary>
    public class ChangePasswordResponse
    {
        /// <summary>
        /// Indicates whether the password change was successful
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// Message describing the result of the operation
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Username (email) of the user whose password was changed
        /// </summary>
        public string Username { get; set; } = string.Empty;
    }
}
