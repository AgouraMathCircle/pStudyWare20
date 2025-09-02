using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface IVolunteerService
    {
        ResponseDetails VolunteerRegistration(RegistrationVolunteerModel volunteerDetails);
    }
}
