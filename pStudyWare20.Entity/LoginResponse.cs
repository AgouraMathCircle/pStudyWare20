namespace pStudyWare20.Entity
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string MemberType { get; set; } = string.Empty;
        public string ChapterID { get; set; } = string.Empty;
        public string SystemAdmin { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
} 