using pStudyWare20.Shared;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Services.Interfaces
{
    public interface IEmailUtility
    {
        string SendEmailtoRegistrationForVolunteerRegistration(RegistrationVolunteerModel volunteerDetail);
        string SendEmailtoVolunteerForVolunteerRegistration (RegistrationVolunteerModel volunteerDetail);
        string SendEmailtoRegistrationForStudentRegistration(RegistrationStudentModel studentDetail);
        string SendEmailtoParentForStudentRegistration(RegistrationStudentModel studentDetail);
        string SendEmailForExistingStudentRegistration(StudentDetail studentDetail);
        string SendForgotPasswordEmail(MemberMaster user);
        string SendPasswordChangedEmail(string email, string newPassword);
        bool SendForgetPassword(string emailAddress, string password);
        bool SendChangePassword(string emailAddress, string password);
        Task<string> SendEmailAsync(string to, string from, string subject, string body);
        Task<string> SendEmailGroupAsync(string to, string from, string subject, string body, string group);
        bool SendContactEnquiryEmail(string name, string email, string subject, string message);
    }
}
