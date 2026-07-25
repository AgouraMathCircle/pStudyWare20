using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// SystemAdmin dashboard student list request (independent of Admin DTOs).
    /// </summary>
    public class SystemAdminStudentListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "D";
    }

    /// <summary>
    /// SystemAdmin dashboard student list response (independent of Admin DTOs).
    /// </summary>
    public class SystemAdminStudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Students")]
        public List<StudentInfo> Students { get; set; } = new List<StudentInfo>();
    }
}
