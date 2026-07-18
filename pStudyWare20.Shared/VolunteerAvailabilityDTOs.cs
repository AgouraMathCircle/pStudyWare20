using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Request model for updating volunteer availability
    /// </summary>
    public class VolunteerAvailabilityRequest
    {
        [Required]
        [StringLength(50)]
        public string UserID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Session { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Semester { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string Response { get; set; } = string.Empty;

        public string? Comment { get; set; }
    }

    /// <summary>
    /// Response model for updating volunteer availability
    /// </summary>
    public class VolunteerAvailabilityResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Session { get; set; } = string.Empty;
        /// <summary>
        /// Grid rows for Volunteers Availability List (summary SP + saved row upsert).
        /// </summary>
        public object SummaryData { get; set; } = Array.Empty<object>();
    }

    /// <summary>
    /// Request model for selecting volunteer availability
    /// </summary>
    public class VolunteerAvailabilitySelectRequest
    {
        [StringLength(50)]
        public string UserID { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Session { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Semester { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for selecting volunteer availability
    /// </summary>
    public class VolunteerAvailabilitySelectResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public bool HasValue { get; set; }
        public string Response { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request model for volunteer availability summary
    /// </summary>
    public class VolunteerAvailabilitySummaryRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for volunteer availability summary
    /// </summary>
    public class VolunteerAvailabilitySummaryResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Summary Data")]
        public object SummaryData { get; set; } = new object();
    }

    /// <summary>
    /// Form context for volunteer availability entry (legacy dashboard message).
    /// </summary>
    public class VolunteerAvailabilityFormContextResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string CurrentSession { get; set; } = string.Empty;
        public string TargetSession { get; set; } = string.Empty;
        public string VolunteeringPrompt { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
    }
}
