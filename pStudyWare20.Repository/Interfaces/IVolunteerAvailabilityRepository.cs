using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for volunteer availability operations
    /// </summary>
    public interface IVolunteerAvailabilityRepository
    {
        /// <summary>
        /// Update volunteer availability in the database
        /// </summary>
        /// <param name="request">The volunteer availability request data</param>
        /// <returns>True if the operation succeeded, false otherwise</returns>
        Task<bool> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request);

        /// <summary>
        /// Get volunteer availability from the database
        /// </summary>
        /// <param name="request">The volunteer availability select request data</param>
        /// <returns>Volunteer availability select response</returns>
        Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request);
    }
}
