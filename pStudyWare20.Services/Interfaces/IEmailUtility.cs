using pStudyWare20.Shared;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Services.Interfaces
{
    public interface IEmailUtility
    {
        string SendEmailtoAdminForVolunteerRegistration(RegistrationVolunteerModel volunteerDetail);
        string SendEmailtoAdminForStudentRegistration(RegistrationStudentModel studentDetail);
        string SendEmailForExistingStudentRegistration(StudentDetail studentDetail);
        string SendForgotPasswordEmail(MemberMaster user);
        string SendPasswordChangedEmail(string email, string newPassword);
        Task<string> SendEmailAsync(string to, string from, string subject, string body);
        Task<string> SendEmailGroupAsync(string to, string from, string subject, string body, string group);
    }
}
