using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Admin donor record — legacy DonorDetails.aspx grid / edit form.
    /// </summary>
    public class AdminDonorRecord
    {
        public int DonorID { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public string DonorLevel { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Semester { get; set; } = string.Empty;
    }

    public class GetAdminDonorsResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public List<AdminDonorRecord> Donors { get; set; } = new();
    }

    public class GetAdminDonorResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public AdminDonorRecord? Donor { get; set; }
    }

    public class UpsertAdminDonorRequest
    {
        [Required]
        public string RowID { get; set; } = "0";

        [Required(ErrorMessage = "Donor name is required")]
        public string DonorName { get; set; } = string.Empty;

        [Required]
        public string DonorLevel { get; set; } = string.Empty;

        [Required]
        public int Year { get; set; }

        [Required]
        public string Semester { get; set; } = string.Empty;
    }

    public class UpsertAdminDonorResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class DonorDetailsPrivilegesResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public bool IsAdmin { get; set; }
        public bool IsSystemAdmin { get; set; }
        /// <summary>Legacy: all admins (MemberType A) can open the edit form.</summary>
        public bool CanEditDonors { get; set; }
        public bool CanAddDonors { get; set; }
        public bool CanSubmitDonors { get; set; }
    }
}
