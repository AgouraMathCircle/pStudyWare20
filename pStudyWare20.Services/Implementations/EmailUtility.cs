using Microsoft.Extensions.Configuration;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Net.Mail;
using System.Net;

namespace pStudyWare20.Services.Implementations
{
    public class EmailUtility : IEmailUtility
    {
        private readonly IConfiguration _configuration;

        public EmailUtility(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string SendEmailtoAdminForVolunteerRegistration(RegistrationVolunteerModel volunteerDetail)
        {
            try
            {
                string adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "admin@agouramathcircle.org";
                string smtpServer = _configuration.GetSection("AppSettings")["SmtpServer"] ?? "smtp.gmail.com";
                string smtpPort = _configuration.GetSection("AppSettings")["SmtpPort"] ?? "587";
                string smtpUsername = _configuration.GetSection("AppSettings")["SmtpUsername"] ?? "";
                string smtpPassword = _configuration.GetSection("AppSettings")["SmtpPassword"] ?? "";

                // Email to Admin
                string adminSubject = "Agoura Math Circle : New Volunteer request from: " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                string adminBody = "Just Received New Volunteer request from " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + "<br/>"
                                + " Student Name: " + volunteerDetail.FirstName + "<br/>"
                                + " Education: " + volunteerDetail.Grade + "<br/>"
                                + " School/University: " + volunteerDetail.SchoolName + "<br/>"
                                + " Register For : " + volunteerDetail.SessionId + "<br/>"
                                + " Location: " + volunteerDetail.LocationId + "<br/>"
                                + " Interested For : " + volunteerDetail.InterestedFor + "<br/>"
                                + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                SendEmail(adminEmail, volunteerDetail.Email, adminSubject, adminBody);

                // Email to Volunteer
                string volunteerSubject = "Agoura Math Circle : New Volunteer Request confirmation for " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                string volunteerBody = volunteerDetail.FirstName + " " + volunteerDetail.LastName + ",<br>"
                                    + " Thank you very much for registering as volunteer in Agoura Math Circle."
                                    + " We will contact you about your role and responsibility ASAP." + " <br/><br/>"
                                    + " If you have any question, please email to support@agouramathcircle.org." + " <br/><br/>"
                                    + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                SendEmail(volunteerDetail.Email, adminEmail, volunteerSubject, volunteerBody);

                return "";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public string SendEmailtoAdminForStudentRegistration(RegistrationStudentModel studentDetail)
        {
            try
            {
                string adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "admin@agouramathcircle.org";

                // Email to Admin
                string adminSubject = "Agoura Math Circle : New Student Registration from: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string adminBody = "Just Received New Student Registration from " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Parent Name: " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " School: " + studentDetail.StudentSchoolName + "<br/>"
                                + " Grade: " + studentDetail.StudentGrade + "<br/>"
                                + " Session: " + studentDetail.SessionId + "<br/>"
                                + " Location: " + studentDetail.LocationId + "<br/>"
                                + " Parent Email: " + studentDetail.ParentEmail + "<br/>"
                                + " Parent Phone: " + studentDetail.ParentPhoneNo + "<br/>"
                                + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                SendEmail(adminEmail, studentDetail.ParentEmail, adminSubject, adminBody);

                // Email to Parent
                string parentSubject = "Agoura Math Circle : Student Registration confirmation for " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string parentBody = "Dear " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ",<br>"
                                 + " Thank you very much for registering your child " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + " in Agoura Math Circle."
                                 + " We will contact you about the class schedule and other details ASAP." + " <br/><br/>"
                                 + " If you have any question, please email to support@agouramathcircle.org." + " <br/><br/>"
                                 + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                SendEmail(studentDetail.ParentEmail, adminEmail, parentSubject, parentBody);

                return "";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public string SendEmailForExistingStudentRegistration(StudentDetail studentDetail)
        {
            try
            {
                string adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "admin@agouramathcircle.org";

                // Email to Admin for existing student registration
                string adminSubject = "Agoura Math Circle : Existing Student Registration Update for: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string adminBody = "Existing Student Registration Update for " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student ID: " + studentDetail.StudentId + "<br/>"
                                + " School: " + studentDetail.School + "<br/>"
                                + " Grade: " + studentDetail.GradeLevel + "<br/>"
                                + " City: " + studentDetail.City + "<br/>"
                                + " State: " + studentDetail.State + "<br/>"
                                + " Country: " + studentDetail.Country + "<br/>"
                                + " Phone: " + studentDetail.StudentPhone + "<br/>"
                                + " Member Type: " + studentDetail.MemberType + "<br/>"
                                + " Registration Update: " + studentDetail.RegistrationUpdate + "<br/>"
                                + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                SendEmail(adminEmail, studentDetail.StudentEmailID, adminSubject, adminBody);

                return "";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private void SendEmail(string toEmail, string fromEmail, string subject, string body)
        {
            try
            {
                var smtpClient = new SmtpClient(_configuration.GetSection("AppSettings")["SmtpServer"] ?? "smtp.gmail.com")
                {
                    Port = int.Parse(_configuration.GetSection("AppSettings")["SmtpPort"] ?? "587"),
                    Credentials = new NetworkCredential(
                        _configuration.GetSection("AppSettings")["SmtpUsername"] ?? "",
                        _configuration.GetSection("AppSettings")["SmtpPassword"] ?? ""
                    ),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                smtpClient.Send(mailMessage);
            }
            catch (Exception ex)
            {
                // Log the exception in production
                throw;
            }
        }
    }
}
