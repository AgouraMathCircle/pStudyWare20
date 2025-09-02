using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface IEmailUtility
    {
        string SendEmailtoAdminForVolunteerRegistration(RegistrationVolunteerModel volunteerDetail);
        string SendEmailtoAdminForStudentRegistration(RegistrationStudentModel studentDetail);
        string SendEmailForExistingStudentRegistration(StudentDetail studentDetail);
    }
}
