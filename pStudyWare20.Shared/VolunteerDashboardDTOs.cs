using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Volunteer dashboard time tracking entry model
    /// </summary>
    public class VolunteerTimeTrackingEntry
    {
        public int LogID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string TaskName { get; set; } = string.Empty;
        public DateTime VolunteerDate { get; set; }
        public string StartHour { get; set; } = string.Empty;
        public string StartMin { get; set; } = string.Empty;
        public string StartType { get; set; } = string.Empty;
        public string EndHour { get; set; } = string.Empty;
        public string EndMin { get; set; } = string.Empty;
        public string EndType { get; set; } = string.Empty;
        public string TaskDescription { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public double? TotalHours { get; set; }
    }

    /// <summary>
    /// Request model for getting volunteer dashboard data
    /// </summary>
    public class VolunteerDashboardRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for volunteer dashboard data
    /// </summary>
    public class VolunteerDashboardResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public List<VolunteerTimeTrackingEntry> TimeTrackingEntries { get; set; } = new List<VolunteerTimeTrackingEntry>();
        public double TotalVolunteerHours { get; set; }
        public int TotalEntries { get; set; }
        public DateTime? LastEntryDate { get; set; }
        public string? MostFrequentTask { get; set; }
    }

    /// <summary>
    /// Request model for volunteer dashboard summary
    /// </summary>
    public class VolunteerDashboardSummaryRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    /// <summary>
    /// Response model for volunteer dashboard summary
    /// </summary>
    public class VolunteerDashboardSummaryResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public double TotalHours { get; set; }
        public int TotalEntries { get; set; }
        public double AverageHoursPerEntry { get; set; }
        public DateTime? FirstEntryDate { get; set; }
        public DateTime? LastEntryDate { get; set; }
        public List<VolunteerTimeTrackingEntry> RecentEntries { get; set; } = new List<VolunteerTimeTrackingEntry>();
        public Dictionary<string, double> TaskHoursBreakdown { get; set; } = new Dictionary<string, double>();
    }

    /// <summary>
    /// Request model for volunteer dashboard privileges check
    /// </summary>
    public class VolunteerDashboardPrivilegesRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for volunteer dashboard privileges
    /// </summary>
    public class VolunteerDashboardPrivilegesResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string Role { get; set; } = string.Empty;
        public string MemberType { get; set; } = string.Empty;
        public bool CanViewDashboard { get; set; }
        public bool CanViewTimeTracking { get; set; }
        public bool CanAddTimeEntries { get; set; }
        public bool CanEditTimeEntries { get; set; }
        public bool CanDeleteTimeEntries { get; set; }
    }

    /// <summary>
    /// Request model for volunteer dashboard statistics
    /// </summary>
    public class VolunteerDashboardStatsRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        public int? Year { get; set; }
        public int? Month { get; set; }
    }

    /// <summary>
    /// Response model for volunteer dashboard statistics
    /// </summary>
    public class VolunteerDashboardStatsResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public double TotalHours { get; set; }
        public int TotalEntries { get; set; }
        public double AverageHoursPerEntry { get; set; }
        public double AverageHoursPerDay { get; set; }
        public int DaysWithEntries { get; set; }
        public List<VolunteerTimeTrackingEntry> TopTasks { get; set; } = new List<VolunteerTimeTrackingEntry>();
        public Dictionary<string, double> MonthlyBreakdown { get; set; } = new Dictionary<string, double>();
    }
}
