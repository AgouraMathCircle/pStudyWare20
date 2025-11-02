namespace pStudyWare20.Entity
{
    /// <summary>
    /// Response model for password update operation
    /// </summary>
    public class UpdatePasswordResponse
    {
        /// <summary>
        /// Indicates whether the password update was successful
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// Message describing the result of the operation
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Username (email) of the user whose password was updated
        /// </summary>
        public string Username { get; set; } = string.Empty;
    }
}

