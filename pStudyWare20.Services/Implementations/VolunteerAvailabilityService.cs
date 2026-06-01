using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for managing volunteer availability business logic
    /// </summary>
    public class VolunteerAvailabilityService : IVolunteerAvailabilityService
    {
        private readonly IVolunteerAvailabilityRepository _volunteerAvailabilityRepository;

        public VolunteerAvailabilityService(IVolunteerAvailabilityRepository volunteerAvailabilityRepository)
        {
            _volunteerAvailabilityRepository = volunteerAvailabilityRepository;
        }

        /// <summary>
        /// Updates the volunteer availability using the repository
        /// </summary>
        public async Task<VolunteerAvailabilityResponse> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request)
        {
            try
            {
                var success = await _volunteerAvailabilityRepository.UpdateVolunteerAvailabilityAsync(request);
                
                if (success)
                {
                    return new VolunteerAvailabilityResponse
                    {
                        IsSuccess = true,
                        Message = "Volunteer availability updated successfully."
                    };
                }
                else
                {
                    return new VolunteerAvailabilityResponse
                    {
                        IsSuccess = false,
                        Message = "Failed to update volunteer availability."
                    };
                }
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilityResponse
                {
                    IsSuccess = false,
                    Message = $"An error occurred while updating volunteer availability: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets the volunteer availability using the repository
        /// </summary>
        public async Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request)
        {
            try
            {
                return await _volunteerAvailabilityRepository.GetVolunteerAvailabilityAsync(request);
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilitySelectResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"An error occurred while getting volunteer availability: {ex.Message}"
                };
            }
        }
    }
}
