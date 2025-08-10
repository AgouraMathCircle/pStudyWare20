using pStudyWare20.Entity;
using pStudyWare20.Entity.Models;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for donor business operations
    /// </summary>
    public interface IDonorService
    {
        /// <summary>
        /// Get donors for a specific year with business logic
        /// </summary>
        /// <param name="year">The year to filter donors</param>
        /// <returns>Collection of donors for the specified year</returns>
        Task<IEnumerable<Donor>> GetDonorsByYearAsync(int year);

        /// <summary>
        /// Get donors for past years (before the specified year) with business logic
        /// </summary>
        /// <param name="year">The year to get donors before</param>
        /// <returns>Collection of donors from past years</returns>
        Task<IEnumerable<Donor>> GetPastYearDonorsAsync(int year);

        /// <summary>
        /// Get donors for a specific year grouped by donation levels (refactored from Donate.aspx.cs)
        /// </summary>
        /// <param name="year">The year to filter donors</param>
        /// <returns>Donors grouped by donation levels for the specified year</returns>
        Task<DonorsByYearWithLevelsDto> GetDonorsByYearWithLevelsAsync(int year);

        /// <summary>
        /// Add a new donor with validation and business logic
        /// </summary>
        /// <param name="donor">The donor to add</param>
        /// <returns>The added donor with generated ID</returns>
        Task<Donor> AddDonorAsync(Donor donor);

        /// <summary>
        /// Update an existing donor with validation and business logic
        /// </summary>
        /// <param name="donor">The donor to update</param>
        /// <returns>The updated donor</returns>
        Task<Donor> UpdateDonorAsync(Donor donor);

        /// <summary>
        /// Delete a donor by ID with business logic validation
        /// </summary>
        /// <param name="id">The ID of the donor to delete</param>
        /// <returns>True if deleted successfully, false otherwise</returns>
        Task<bool> DeleteDonorAsync(int id);

        /// <summary>
        /// Get all donors with business logic
        /// </summary>
        /// <returns>Collection of all donors</returns>
        Task<IEnumerable<Donor>> GetAllDonorsAsync();

        /// <summary>
        /// Get a donor by ID with business logic
        /// </summary>
        /// <param name="id">The ID of the donor</param>
        /// <returns>The donor if found, null otherwise</returns>
        Task<Donor> GetDonorByIdAsync(int id);

        /// <summary>
        /// Get donors by donation level with business logic
        /// </summary>
        /// <param name="level">The donation level to filter by</param>
        /// <returns>Collection of donors for the specified level</returns>
        Task<IEnumerable<Donor>> GetDonorsByLevelAsync(string level);

        /// <summary>
        /// Validate donor data
        /// </summary>
        /// <param name="donor">The donor to validate</param>
        /// <returns>Validation result with errors if any</returns>
        Task<(bool IsValid, List<string> Errors)> ValidateDonorAsync(Donor donor);

        /// <summary>
        /// Get donor statistics
        /// </summary>
        /// <returns>Donor statistics data</returns>
        Task<object> GetDonorStatisticsAsync();

        /// <summary>
        /// Get all donors grouped by year and category
        /// </summary>
        /// <returns>Donor data grouped by year and category</returns>
        Task<DonorsResponseDto> GetDonorsGroupedAsync();

        /// <summary>
        /// Get donors by specific year with grouping
        /// </summary>
        /// <param name="year">The year to filter donors</param>
        /// <returns>Donors grouped by year</returns>
        Task<DonorsByYearDto> GetDonorsByYearGroupedAsync(int year);

        /// <summary>
        /// Get donors by specific category with grouping
        /// </summary>
        /// <param name="category">The category to filter donors</param>
        /// <returns>Donors grouped by category</returns>
        Task<DonorsByCategoryDto> GetDonorsByCategoryGroupedAsync(string category);

        /// <summary>
        /// Get available years for donors
        /// </summary>
        /// <returns>List of available years</returns>
        Task<List<int>> GetAvailableYearsAsync();

        /// <summary>
        /// Get available donor categories (levels)
        /// </summary>
        /// <returns>List of available categories</returns>
        Task<List<string>> GetAvailableCategoriesAsync();

        /// <summary>
        /// Get all donors grouped by year and donation levels using stored procedure (refactored from Donate.aspx.cs)
        /// </summary>
        /// <returns>Donors grouped by year and donation levels for the current year</returns>
        Task<DonorsByYearWithLevelsDto> GetAllDonorsGroupedByYearAndLevelsAsync();
    }
}
