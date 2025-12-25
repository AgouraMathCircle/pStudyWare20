using pStudyWare20.Shared;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Services.Interfaces
{
    public interface IEmailUtility
    {
        string SendEmailtoAdminForVolunteerRegistration(RegistrationVolunteerModel volunteerDetail);
        string SendEmailtoAdminForStudentRegistration(RegistrationStudentModel studentDetail);
        string SendEmailtoParentForStudentRegistration(RegistrationStudentModel studentDetail);
        string SendEmailForExistingStudentRegistration(StudentDetail studentDetail);
        string SendForgotPasswordEmail(MemberMaster user);
        string SendPasswordChangedEmail(string email, string newPassword);
        bool SendForgetPassword(string emailAddress, string password);
        bool SendChangePassword(string emailAddress, string password);
        Task<string> SendEmailAsync(string to, string from, string subject, string body);
        Task<string> SendEmailGroupAsync(string to, string from, string subject, string body, string group);
    }
}
