using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Enum for donor levels
    /// </summary>
    public enum DonorLevel
    {
        Diamond = 1,
        Platinum = 2,
        Gold = 3,
        Silver = 4,
        Bronze = 5
    }

    /// <summary>
    /// Model for donor entry
    /// </summary>
    public class DonorEntry
    {
        [Display(Name = "Row ID")]
        public int RowID { get; set; }

        [Display(Name = "Donor Name")]
        public string DonorName { get; set; } = string.Empty;

        [Display(Name = "Donor Level")]
        public string DonorLevel { get; set; } = string.Empty;

        [Display(Name = "Year")]
        public int Year { get; set; }

        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Display(Name = "Amount")]
        public decimal? Amount { get; set; }

        [Display(Name = "Date Added")]
        public DateTime? DateAdded { get; set; }
    }

    /// <summary>
    /// Model for donor level group
    /// </summary>
    public class DonorLevelGroup
    {
        [Display(Name = "Level")]
        public string Level { get; set; } = string.Empty;

        [Display(Name = "Donors")]
        public List<DonorEntry> Donors { get; set; } = new List<DonorEntry>();

        [Display(Name = "Count")]
        public int Count => Donors.Count;
    }

    /// <summary>
    /// Model for donor year group
    /// </summary>
    public class DonorYearGroup
    {
        [Display(Name = "Year")]
        public int Year { get; set; }

        [Display(Name = "Level Groups")]
        public List<DonorLevelGroup> LevelGroups { get; set; } = new List<DonorLevelGroup>();

        [Display(Name = "Total Donors")]
        public int TotalDonors => LevelGroups.Sum(g => g.Count);
    }

    /// <summary>
    /// Model for get donors request
    /// </summary>
    public class GetDonorsRequest
    {
        [Display(Name = "Year")]
        public int? Year { get; set; }

        [Display(Name = "Level")]
        public string? Level { get; set; }
    }

    /// <summary>
    /// Model for get donors response
    /// </summary>
    public class GetDonorsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Current Year Donors")]
        public List<DonorEntry> CurrentYearDonors { get; set; } = new List<DonorEntry>();

        [Display(Name = "Past Year Donors")]
        public Dictionary<int, List<DonorEntry>> PastYearDonors { get; set; } = new Dictionary<int, List<DonorEntry>>();

        [Display(Name = "Current Year")]
        public int CurrentYear { get; set; }
    }

    /// <summary>
    /// Model for get donors by year request
    /// </summary>
    public class GetDonorsByYearRequest
    {
        [Display(Name = "Year")]
        [Required(ErrorMessage = "Year is required")]
        public int Year { get; set; }
    }

    /// <summary>
    /// Model for get donors by year response
    /// </summary>
    public class GetDonorsByYearResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Donors")]
        public List<DonorEntry> Donors { get; set; } = new List<DonorEntry>();

        [Display(Name = "Year")]
        public int Year { get; set; }
    }

    /// <summary>
    /// Model for get donors by level request
    /// </summary>
    public class GetDonorsByLevelRequest
    {
        [Display(Name = "Level")]
        [Required(ErrorMessage = "Level is required")]
        public string Level { get; set; } = string.Empty;

        [Display(Name = "Year")]
        public int? Year { get; set; }
    }

    /// <summary>
    /// Model for get donors by level response
    /// </summary>
    public class GetDonorsByLevelResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Donors")]
        public List<DonorEntry> Donors { get; set; } = new List<DonorEntry>();

        [Display(Name = "Level")]
        public string Level { get; set; } = string.Empty;

        [Display(Name = "Year")]
        public int? Year { get; set; }
    }

    /// <summary>
    /// Model for donate dashboard request
    /// </summary>
    public class DonateDashboardRequest
    {
        [Display(Name = "Include Statistics")]
        public bool IncludeStatistics { get; set; } = true;
    }

    /// <summary>
    /// Model for donate dashboard response
    /// </summary>
    public class DonateDashboardResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Current Year Donors")]
        public List<DonorEntry> CurrentYearDonors { get; set; } = new List<DonorEntry>();

        [Display(Name = "Past Year Donors")]
        public Dictionary<int, List<DonorEntry>> PastYearDonors { get; set; } = new Dictionary<int, List<DonorEntry>>();

        [Display(Name = "Current Year")]
        public int CurrentYear { get; set; }

        [Display(Name = "Statistics")]
        public DonateStatsResponse? Statistics { get; set; }
    }

    /// <summary>
    /// Model for donate statistics request
    /// </summary>
    public class DonateStatsRequest
    {
        [Display(Name = "Year")]
        public int? Year { get; set; }
    }

    /// <summary>
    /// Model for donate statistics response
    /// </summary>
    public class DonateStatsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Total Donors")]
        public int TotalDonors { get; set; }

        [Display(Name = "Current Year Donors")]
        public int CurrentYearDonors { get; set; }

        [Display(Name = "Donor Levels")]
        public int DonorLevels { get; set; }

        [Display(Name = "Years Active")]
        public int YearsActive { get; set; }

        [Display(Name = "Level Breakdown")]
        public Dictionary<string, int> LevelBreakdown { get; set; } = new Dictionary<string, int>();

        [Display(Name = "Year Breakdown")]
        public Dictionary<int, int> YearBreakdown { get; set; } = new Dictionary<int, int>();
    }

    /// <summary>
    /// Model for donate privileges response
    /// </summary>
    public class DonatePrivilegesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Can View Donors")]
        public bool CanViewDonors { get; set; }

        [Display(Name = "Can View Statistics")]
        public bool CanViewStatistics { get; set; }

        [Display(Name = "Can Add Donors")]
        public bool CanAddDonors { get; set; }
    }
}
