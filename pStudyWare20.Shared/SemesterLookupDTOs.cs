using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Semester lookup row — matches AMC_spSelectSemesterLookup / UpdateLookupSemester.aspx fields.
    /// </summary>
    public class SemesterLookupDto
    {
        public int Id { get; set; }
        public string Semester { get; set; } = "";
        public string LastSemester { get; set; } = "";
        public string StartingDate { get; set; } = "";
        public string RegStartDate { get; set; } = "";
        public string RegCloseDate { get; set; } = "";
        public string DisplayDocumentsFrom { get; set; } = "";
        /// <summary>O = Open, C = Close (legacy ddl)</summary>
        public string RegistrationStatus { get; set; } = "O";
        public string JbTotalSpace { get; set; } = "";
        public string JiTotalSpace { get; set; } = "";
        public string JaTotalSpace { get; set; } = "";
        public string SbTotalSpace { get; set; } = "";
        public string SiTotalSpace { get; set; } = "";
        public string SaTotalSpace { get; set; } = "";
        public string CurrentExamDate { get; set; } = "";
        public string CurrentExamDueTime { get; set; } = "";
        /// <summary>Y = open volunteer availability UI, N = closed.</summary>
        public string VolunteerAvailability { get; set; } = "N";
    }

    public class GetSemesterLookupResponse
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public SemesterLookupDto? Lookup { get; set; }
        /// <summary>True when the signed-in user may submit updates (legacy: ChapterID == "1").</summary>
        public bool CanUpdate { get; set; }
    }

    public class UpdateSemesterLookupRequest
    {
        [Required]
        public string Semester { get; set; } = "";
        public string LastSemester { get; set; } = "";
        public string StartingDate { get; set; } = "";
        public string RegStartDate { get; set; } = "";
        public string RegCloseDate { get; set; } = "";
        public string DisplayDocumentsFrom { get; set; } = "";
        [RegularExpression("^[OC]$", ErrorMessage = "Registration status must be O (Open) or C (Close).")]
        public string RegistrationStatus { get; set; } = "O";
        public string JbTotalSpace { get; set; } = "";
        public string JiTotalSpace { get; set; } = "";
        public string JaTotalSpace { get; set; } = "";
        public string SbTotalSpace { get; set; } = "";
        public string SiTotalSpace { get; set; } = "";
        public string SaTotalSpace { get; set; } = "";
        public string CurrentExamDate { get; set; } = "";
        public string CurrentExamDueTime { get; set; } = "";
        [RegularExpression("^[YN]$", ErrorMessage = "Volunteer availability must be Y (Open) or N (Close).")]
        public string VolunteerAvailability { get; set; } = "N";

        /// <summary>Caller chapter ID; must be "1" to update (matches legacy Session ChapterID).</summary>
        [Required]
        public string ChapterID { get; set; } = "";
    }

    public class UpdateSemesterLookupResponse
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
