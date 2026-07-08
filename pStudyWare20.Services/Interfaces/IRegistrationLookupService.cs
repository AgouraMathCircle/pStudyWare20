using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface IRegistrationLookupService
    {
        Task<RegistrationSemesterOptionsResponse> GetRegistrationSemesterOptionsAsync();
    Task<RegistrationLocationOptionsResponse> GetRegistrationLocationOptionsAsync();
    }
}
