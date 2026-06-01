using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for volunteer availability business logic operations
    /// </summary>
    public interface IVolunteerAvailabilityService
    {
        /// <summary>
        /// Updates the volunteer availability
        /// </summary>
        /// <param name="request">The volunteer availability request data</param>
        /// <returns>Volunteer availability response indicating success or failure status</returns>
        Task<VolunteerAvailabilityResponse> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request);

        /// <summary>
        /// Gets the volunteer availability
        /// </summary>
        /// <param name="request">The volunteer availability select request data</param>
        /// <returns>Volunteer availability select response indicating success or failure status</returns>
        Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request);
    }
}
