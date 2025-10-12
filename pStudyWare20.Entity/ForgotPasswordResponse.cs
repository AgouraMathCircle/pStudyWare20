namespace pStudyWare20.Entity
{
    public class ForgotPasswordResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
