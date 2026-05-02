using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// TimeSheet tracking entry model
    /// </summary>
    public class TimeSheetTrackingEntry
    {
        /// <summary>Matches legacy grid mLogID.</summary>
        public int LogID { get; set; }
        /// <summary>Login / account name when present on row.</summary>
        public string Username { get; set; } = string.Empty;
        /// <summary>Display name from AMC_spSelectTimeTracking Name column (legacy kGrid).</summary>
        public string Name { get; set; } = string.Empty;
        public string TaskName { get; set; } = string.Empty;
        public DateTime VolunteerDate { get; set; }
        /// <summary>Pre-formatted start time from SP when present (legacy StartTime column).</summary>
        public string StartTime { get; set; } = string.Empty;
        /// <summary>Pre-formatted end time from SP when present (legacy EndTime column).</summary>
        public string EndTime { get; set; } = string.Empty;
        public string StartHour { get; set; } = string.Empty;
        public string StartMin { get; set; } = string.Empty;
        public string StartType { get; set; } = string.Empty;
        public string EndHour { get; set; } = string.Empty;
        public string EndMin { get; set; } = string.Empty;
        public string EndType { get; set; } = string.Empty;
        /// <summary>Legacy grid TotalHours column.</summary>
        public string TotalHours { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }

    /// <summary>
    /// Request model for getting timesheet tracking list
    /// </summary>
    public class TimeSheetTrackingListRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for timesheet tracking list
    /// </summary>
    public class TimeSheetTrackingListResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public List<TimeSheetTrackingEntry> TimeSheetTrackingList { get; set; } = new List<TimeSheetTrackingEntry>();
    }

    /// <summary>
    /// Request model for updating timesheet tracking entry
    /// </summary>
    public class UpdateTimeSheetTrackingRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public int LogID { get; set; }
    }

    /// <summary>
    /// Response model for updating timesheet tracking entry
    /// </summary>
    public class UpdateTimeSheetTrackingResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public TimeSheetTrackingEntry? TimeSheetEntry { get; set; }
    }

    /// <summary>
    /// Request model for deleting timesheet tracking entry
    /// </summary>
    public class DeleteTimeSheetTrackingRequest
    {
        [Required]
        public int LogID { get; set; }
    }

    /// <summary>
    /// Response model for deleting timesheet tracking entry
    /// </summary>
    public class DeleteTimeSheetTrackingResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Message { get; set; }
    }

    /// <summary>
    /// Request model for adding/updating timesheet tracking entry
    /// </summary>
    public class UpsertTimeSheetTrackingRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string TaskName { get; set; } = string.Empty;
        [Required]
        public DateTime VolunteerDate { get; set; }
        [Required]
        public string StartHour { get; set; } = string.Empty;
        [Required]
        public string StartMin { get; set; } = string.Empty;
        [Required]
        public string StartType { get; set; } = string.Empty;
        [Required]
        public string EndHour { get; set; } = string.Empty;
        [Required]
        public string EndMin { get; set; } = string.Empty;
        [Required]
        public string EndType { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public int? LogID { get; set; } // For updates, null for new entries
    }

    /// <summary>
    /// Response model for adding/updating timesheet tracking entry
    /// </summary>
    public class UpsertTimeSheetTrackingResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Message { get; set; }
        public TimeSheetTrackingEntry? TimeSheetEntry { get; set; }
    }

    /// <summary>
    /// Request model for timesheet tracking dashboard data
    /// </summary>
    public class TimeSheetTrackingDashboardRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for timesheet tracking dashboard data
    /// </summary>
    public class TimeSheetTrackingDashboardResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public List<TimeSheetTrackingEntry> TimeSheetTrackingList { get; set; } = new List<TimeSheetTrackingEntry>();
    }

    /// <summary>
    /// Request model for timesheet tracking action
    /// </summary>
    public class TimeSheetTrackingActionRequest
    {
        [Required]
        public string Action { get; set; } = string.Empty; // "E" for Edit, "D" for Delete
        [Required]
        public int LogID { get; set; }
        public string? Username { get; set; }
    }

    /// <summary>
    /// Response model for timesheet tracking action
    /// </summary>
    public class TimeSheetTrackingActionResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Message { get; set; }
        public TimeSheetTrackingEntry? TimeSheetEntry { get; set; }
    }

    /// <summary>
    /// Response model for timesheet tracking privileges
    /// </summary>
    public class TimeSheetTrackingPrivilegesResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string Role { get; set; } = string.Empty;
        public string MemberType { get; set; } = string.Empty;
        public bool CanAddTimeSheetEntry { get; set; }
        public bool CanEditTimeSheetEntry { get; set; }
        public bool CanDeleteTimeSheetEntry { get; set; }
    }
}