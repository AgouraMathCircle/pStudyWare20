using pStudyWare20.Entity;
using pStudyWare20.Entity.Models;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for donor data operations
    /// </summary>
    public interface IDonorRepository
    {
        /// <summary>
        /// Get donors for a specific year
        /// </summary>
        /// <param name="year">The year to filter donors</param>
        /// <returns>Collection of donors for the specified year</returns>
        Task<IEnumerable<Donor>> GetDonorsByYearAsync(int year);

        /// <summary>
        /// Get donors for past years (before the specified year)
        /// </summary>
        /// <param name="year">The year to get donors before</param>
        /// <returns>Collection of donors from past years</returns>
        Task<IEnumerable<Donor>> GetPastYearDonorsAsync(int year);

        /// <summary>
        /// Add a new donor
        /// </summary>
        /// <param name="donor">The donor to add</param>
        /// <returns>The added donor with generated ID</returns>
        Task<Donor> AddDonorAsync(Donor donor);

        /// <summary>
        /// Update an existing donor
        /// </summary>
        /// <param name="donor">The donor to update</param>
        /// <returns>The updated donor</returns>
        Task<Donor> UpdateDonorAsync(Donor donor);

        /// <summary>
        /// Delete a donor by ID
        /// </summary>
        /// <param name="id">The ID of the donor to delete</param>
        /// <returns>True if deleted successfully, false otherwise</returns>
        Task<bool> DeleteDonorAsync(int id);

        /// <summary>
        /// Get all donors
        /// </summary>
        /// <returns>Collection of all donors</returns>
        Task<IEnumerable<Donor>> GetAllDonorsAsync();

        /// <summary>
        /// Get a donor by ID
        /// </summary>
        /// <param name="id">The ID of the donor</param>
        /// <returns>The donor if found, null otherwise</returns>
        Task<Donor> GetDonorByIdAsync(int id);

        /// <summary>
        /// Get donors by donation level
        /// </summary>
        /// <param name="level">The donation level to filter by</param>
        /// <returns>Collection of donors for the specified level</returns>
        Task<IEnumerable<Donor>> GetDonorsByLevelAsync(string level);

        /// <summary>
        /// Get all donors grouped by year and donation levels using stored procedure (refactored from Donate.aspx.cs)
        /// </summary>
        /// <returns>Collection of donors grouped by year and donation levels</returns>
        Task<DonorsByYearWithLevelsDto> GetAllDonorsGroupedByYearAndLevelsAsync();
    }
}
