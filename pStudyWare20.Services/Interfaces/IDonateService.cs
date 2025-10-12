using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for Donate service operations
    /// </summary>
    public interface IDonateService
    {
        /// <summary>
        /// Gets all donors data
        /// </summary>
        /// <returns>GetDonorsResponse containing donor information</returns>
        Task<GetDonorsResponse> GetDonorsAsync();

        /// <summary>
        /// Gets donors by specific year
        /// </summary>
        /// <param name="request">Request containing year filter</param>
        /// <returns>GetDonorsByYearResponse containing donors for the year</returns>
        Task<GetDonorsByYearResponse> GetDonorsByYearAsync(GetDonorsByYearRequest request);

        /// <summary>
        /// Gets donors by specific level
        /// </summary>
        /// <param name="request">Request containing level and optional year filter</param>
        /// <returns>GetDonorsByLevelResponse containing donors for the level</returns>
        Task<GetDonorsByLevelResponse> GetDonorsByLevelAsync(GetDonorsByLevelRequest request);

        /// <summary>
        /// Gets donate dashboard data
        /// </summary>
        /// <param name="request">Request for dashboard data</param>
        /// <returns>DonateDashboardResponse containing dashboard information</returns>
        Task<DonateDashboardResponse> GetDashboardDataAsync(DonateDashboardRequest request);

        /// <summary>
        /// Gets donate statistics
        /// </summary>
        /// <param name="request">Request for statistics data</param>
        /// <returns>DonateStatsResponse containing statistics</returns>
        Task<DonateStatsResponse> GetDonateStatsAsync(DonateStatsRequest request);

        /// <summary>
        /// Checks donate privileges for the current user
        /// </summary>
        /// <returns>DonatePrivilegesResponse containing privilege information</returns>
        Task<DonatePrivilegesResponse> CheckDonatePrivilegesAsync();
    }
}
