using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for Donate repository operations
    /// </summary>
    public interface IDonateRepository
    {
        /// <summary>
        /// Gets all donors data from the database
        /// </summary>
        /// <returns>DataSet containing donor information</returns>
        Task<DataSet> GetDonorsAsync();

        /// <summary>
        /// Gets donors by specific year
        /// </summary>
        /// <param name="year">Year to filter by</param>
        /// <returns>List of donor entries for the specified year</returns>
        Task<List<DonorEntry>> GetDonorsByYearAsync(int year);

        /// <summary>
        /// Gets donors by specific level
        /// </summary>
        /// <param name="level">Donor level to filter by</param>
        /// <param name="year">Optional year filter</param>
        /// <returns>List of donor entries for the specified level</returns>
        Task<List<DonorEntry>> GetDonorsByLevelAsync(string level, int? year = null);

        /// <summary>
        /// Gets donor statistics
        /// </summary>
        /// <param name="year">Optional year filter for statistics</param>
        /// <returns>Donor statistics data</returns>
        Task<DonateStatsResponse> GetDonorStatisticsAsync(int? year = null);
    }
}
