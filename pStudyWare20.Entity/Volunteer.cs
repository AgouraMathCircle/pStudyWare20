using System;
using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Entity
{
    /// <summary>
    /// Represents a volunteer entity for Agoura Math Circle
    /// </summary>
    public class Volunteer
    {
        /// <summary>
        /// Unique identifier for the volunteer
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// First name of the volunteer
        /// </summary>
        [Required(ErrorMessage = "First name is required")]
        [StringLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Last name of the volunteer
        /// </summary>
        [Required(ErrorMessage = "Last name is required")]
        [StringLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Email address of the volunteer
        /// </summary>
        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        [StringLength(255, ErrorMessage = "Email address cannot exceed 255 characters")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Phone number of the volunteer
        /// </summary>
        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Please enter a valid phone number")]
        [StringLength(20, ErrorMessage = "Phone number cannot exceed 20 characters")]
        public string Phone { get; set; } = string.Empty;

        /// <summary>
        /// City where the volunteer is located
        /// </summary>
        [Required(ErrorMessage = "City is required")]
        [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
        public string City { get; set; } = string.Empty;

        /// <summary>
        /// School or university the volunteer attends
        /// </summary>
        [Required(ErrorMessage = "School/University is required")]
        [StringLength(255, ErrorMessage = "School/University cannot exceed 255 characters")]
        public string School { get; set; } = string.Empty;

        /// <summary>
        /// Grade level or education level of the volunteer
        /// </summary>
        [Required(ErrorMessage = "Grade/Education level is required")]
        [StringLength(50, ErrorMessage = "Grade/Education level cannot exceed 50 characters")]
        public string Grade { get; set; } = string.Empty;

        /// <summary>
        /// Session the volunteer is interested in (e.g., Fall, Spring, Summer)
        /// </summary>
        [Required(ErrorMessage = "Session is required")]
        [StringLength(50, ErrorMessage = "Session cannot exceed 50 characters")]
        public string EnrolledSession { get; set; } = string.Empty;

        /// <summary>
        /// Location where the volunteer wants to serve
        /// </summary>
        [Required(ErrorMessage = "Location is required")]
        [StringLength(100, ErrorMessage = "Location cannot exceed 100 characters")]
        public string Location { get; set; } = string.Empty;

        /// <summary>
        /// Area of interest for volunteering
        /// </summary>
        [Required(ErrorMessage = "Area of interest is required")]
        [StringLength(100, ErrorMessage = "Area of interest cannot exceed 100 characters")]
        public string Interest { get; set; } = string.Empty;

        /// <summary>
        /// Additional comments or notes from the volunteer
        /// </summary>
        [StringLength(1000, ErrorMessage = "Comments cannot exceed 1000 characters")]
        public string? Comments { get; set; }

        /// <summary>
        /// Date when the volunteer registration was created
        /// </summary>
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Date when the volunteer record was last updated
        /// </summary>
        public DateTime? UpdatedDate { get; set; }

        /// <summary>
        /// Indicates whether the volunteer registration is active
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Gets the full name of the volunteer
        /// </summary>
        public string FullName => $"{FirstName} {LastName}".Trim();

        /// <summary>
        /// Gets the display name for the volunteer
        /// </summary>
        public string DisplayName => FullName;

        /// <summary>
        /// Gets the formatted phone number
        /// </summary>
        public string FormattedPhone => Phone;

        /// <summary>
        /// Gets the volunteer's availability status
        /// </summary>
        public string AvailabilityStatus => IsActive ? "Available" : "Not Available";

        /// <summary>
        /// Gets the volunteer's skills summary
        /// </summary>
        public string SkillsSummary => $"{Grade} - {Interest}";

        /// <summary>
        /// Gets the volunteer's location information
        /// </summary>
        public string LocationInfo => $"{City}, {Location}";
    }

    // TODO: Add mapping methods to DTOs when needed for complex transformations
    // For now, simple property mapping is handled in the service layer
}
