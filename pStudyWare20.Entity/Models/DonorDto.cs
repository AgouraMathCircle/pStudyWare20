using System.ComponentModel;

namespace pStudyWare20.Entity.Models
{
    /// <summary>
    /// DTO for individual donor information
    /// </summary>
    public class DonorDto
    {
        public int DonorId { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public string DonorLevel { get; set; } = string.Empty;
        public int Year { get; set; }
        public string PostedBy { get; set; } = string.Empty;
        public DateTime? PostedDate { get; set; }
        public string Semester { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for donor data grouped by year
    /// </summary>
    public class DonorsByYearDto
    {
        public int Year { get; set; }
        public List<DonorDto> Donors { get; set; } = new List<DonorDto>();
        public int TotalDonors { get; set; }
        public decimal TotalAmount { get; set; }
    }

    /// <summary>
    /// DTO for donor data grouped by category (donor level)
    /// </summary>
    public class DonorsByCategoryDto
    {
        public string Category { get; set; } = string.Empty;
        public List<DonorDto> Donors { get; set; } = new List<DonorDto>();
        public int TotalDonors { get; set; }
        public decimal TotalAmount { get; set; }
    }

    /// <summary>
    /// DTO for the complete donors response
    /// </summary>
    public class DonorsResponseDto
    {
        public List<DonorsByYearDto> DonorsByYear { get; set; } = new List<DonorsByYearDto>();
        public List<DonorsByCategoryDto> DonorsByCategory { get; set; } = new List<DonorsByCategoryDto>();
        public int TotalDonors { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    /// <summary>
    /// DTO for donor statistics
    /// </summary>
    public class DonorStatisticsDto
    {
        public int TotalDonors { get; set; }
        public decimal TotalAmount { get; set; }
        public int CurrentYearDonors { get; set; }
        public decimal CurrentYearAmount { get; set; }
        public Dictionary<string, int> DonorsByLevel { get; set; } = new Dictionary<string, int>();
        public Dictionary<int, int> DonorsByYear { get; set; } = new Dictionary<int, int>();
    }

    /// <summary>
    /// DTO for donors grouped by donation levels for a specific year (refactored from Donate.aspx.cs)
    /// </summary>
    public class DonorsByYearWithLevelsDto
    {
        public int Year { get; set; }
        public List<DonorDto> DiamondDonors { get; set; } = new List<DonorDto>();
        public List<DonorDto> PlatinumDonors { get; set; } = new List<DonorDto>();
        public List<DonorDto> GoldDonors { get; set; } = new List<DonorDto>();
        public List<DonorDto> SilverDonors { get; set; } = new List<DonorDto>();
        public List<DonorDto> BronzeDonors { get; set; } = new List<DonorDto>();
        public int TotalDonors { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
