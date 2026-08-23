using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for instructor entry (matches InstructorList from legacy system)
    /// </summary>
    public class Instructor
    {
        [Display(Name = "Instructor ID")]
        public int InstructorID { get; set; }

        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = "Email ID")]
        public string EmailID { get; set; } = string.Empty;

        [Display(Name = "Contact Phone")]
        public string ContactPhone { get; set; } = string.Empty;

        [Display(Name = "Chapter Name")]
        public string ChapterName { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        public string ChapterID { get; set; } = string.Empty;

        [Display(Name = "Instructor Type")]
        public string InstructorType { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "User Name")]
        public string UserName { get; set; } = string.Empty;

        [Display(Name = "Member Status")]
        public string MemberStatus { get; set; } = string.Empty;

        [Display(Name = "Last Login")]
        public DateTime? LastLogin { get; set; }

        [Display(Name = "Instructor Info")]
        public string InstructorInfo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for instructor ID request
    /// </summary>
    public class InstructorID
    {
        [Display(Name = "Instructor ID")]
        public int Id { get; set; }
    }

    /// <summary>
    /// Model for instructor add/update request
    /// </summary>
    public class InstructorRequest
    {
        [Display(Name = "Instructor ID")]
        public int InstructorID { get; set; }

        [Display(Name = "First Name")]
        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = "Last Name")]
        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = "Email ID")]
        [Required(ErrorMessage = "Email ID is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string EmailID { get; set; } = string.Empty;

        [Display(Name = "Contact Phone")]
        [Required(ErrorMessage = "Contact Phone is required")]
        public string ContactPhone { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        [Required(ErrorMessage = "Chapter ID is required")]
        public string ChapterID { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        [Required(ErrorMessage = "Section is required")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Instructor Type")]
        [Required(ErrorMessage = "Instructor Type is required")]
        public string InstructorType { get; set; } = string.Empty;

        [Display(Name = "Member Status")]
        [Required(ErrorMessage = "Member Status is required")]
        public string MemberStatus { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for instructor list request
    /// </summary>
    public class InstructorListRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for instructor delete request
    /// </summary>
    public class InstructorDeleteRequest
    {
        [Display(Name = "Instructor ID")]
        [Required(ErrorMessage = "Instructor ID is required")]
        public int InstructorID { get; set; }
    }

    /// <summary>
    /// Model for instructor list response
    /// </summary>
    public class InstructorListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Instructor List")]
        public List<Instructor> InstructorList { get; set; } = new List<Instructor>();
    }

    /// <summary>
    /// Model for instructor detail response
    /// </summary>
    public class InstructorDetailResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Instructor")]
        public Instructor? Instructor { get; set; }
    }
    public class InstructorGoogleSyncState
    {
        public string EmailID { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? VolunteerEmailGroup { get; set; }
    }

    /// <summary>
    /// Model for instructor operation response
    /// </summary>
    public class InstructorOperationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }

}
