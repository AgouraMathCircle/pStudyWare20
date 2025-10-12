using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for instructor dashboard student list request
    /// </summary>
    public class InstructorStudentListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for instructor dashboard student list response
    /// </summary>
    public class InstructorStudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();
    }

    /// <summary>
    /// Model for instructor dashboard data request
    /// </summary>
    public class InstructorDashboardDataRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for instructor dashboard data response
    /// </summary>
    public class InstructorDashboardDataResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Dashboard Data")]
        public object DashboardData { get; set; } = new object();

        [Display(Name = "Student List")]
        public object StudentList { get; set; } = new object();
    }

    /// <summary>
    /// Model for instructor privileges check response
    /// </summary>
    public class InstructorPrivilegesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Is Instructor")]
        public bool IsInstructor { get; set; }

        [Display(Name = "Role")]
        public string Role { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "Can View Students")]
        public bool CanViewStudents { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
