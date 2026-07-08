using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class RegistrationLookupService : IRegistrationLookupService
    {
        private readonly IRegistrationLookupRepository _registrationLookupRepository;

        public RegistrationLookupService(IRegistrationLookupRepository registrationLookupRepository)
        {
            _registrationLookupRepository = registrationLookupRepository;
        }

        public async Task<RegistrationSemesterOptionsResponse> GetRegistrationSemesterOptionsAsync()
        {
            try
            {
                var semesters = await _registrationLookupRepository.GetRegistrationSemesterOptionsAsync();
                return new RegistrationSemesterOptionsResponse
                {
                    IsSuccess = true,
                    Semesters = semesters,
                };
            }
            catch (Exception ex)
            {
                return new RegistrationSemesterOptionsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                };
            }
        }

        public async Task<RegistrationLocationOptionsResponse> GetRegistrationLocationOptionsAsync()
        {
            try
            {
                var locations = await _registrationLookupRepository.GetRegistrationLocationOptionsAsync();
                return new RegistrationLocationOptionsResponse
                {
                    IsSuccess = true,
                    Locations = locations,
                };
            }
            catch (Exception ex)
            {
                return new RegistrationLocationOptionsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                };
            }
        }
    }
}
