using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Admin donor details — legacy DonorDetails.aspx.
    /// </summary>
    public interface IDonorDetailsService
    {
        Task<GetAdminDonorsResponse> GetAllDonorsAsync(string rowId = "0");
        Task<GetAdminDonorResponse> GetDonorByIdAsync(string rowId);
        Task<UpsertAdminDonorResponse> UpsertDonorAsync(UpsertAdminDonorRequest request);
    }
}
