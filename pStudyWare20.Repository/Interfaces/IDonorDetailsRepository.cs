using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Admin donor details — legacy DonorDetails.aspx (AMC_spGetAllDonors / AMC_spDonors_Insert).
    /// </summary>
    public interface IDonorDetailsRepository
    {
        Task<DataTable> GetDonorsAsync(string rowId);
        Task UpsertDonorAsync(UpsertAdminDonorRequest request);
    }
}
