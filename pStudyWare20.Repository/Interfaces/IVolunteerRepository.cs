using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IVolunteerRepository
    {
        // Stored procedure operations (matches reference controller exactly)
        Task<int> AddVolunteerRequestAsync(RegistrationVolunteerModel request);
    }
}
