using Microsoft.Extensions.Configuration;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Net.Mail;
using System.Net;
using pStudyWare20.Data.Models;

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
                string adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

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

                string adminEmailResult = SendEmail(adminEmail, volunteerDetail.Email, adminSubject, adminBody);
                if (adminEmailResult.Contains("Error"))
                {
                    return adminEmailResult;
                }

                // Email to Volunteer
                string volunteerSubject = "Agoura Math Circle : New Volunteer Request confirmation for " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                string volunteerBody = volunteerDetail.FirstName + " " + volunteerDetail.LastName + ",<br>"
                                    + " Thank you very much for registering as volunteer in Agoura Math Circle."
                                    + " We will contact you about your role and responsibility ASAP." + " <br/><br/>"
                                    + " If you have any question, please email to support@agouramathcircle.org." + " <br/><br/>"
                                    + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                string volunteerEmailResult = SendEmail(volunteerDetail.Email, adminEmail, volunteerSubject, volunteerBody);
                if (volunteerEmailResult.Contains("Error"))
                {
                    return volunteerEmailResult;
                }

                return "Emails sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending emails: {ex.Message}";
            }
        }

        public string SendEmailtoAdminForStudentRegistration(RegistrationStudentModel studentDetail)
        {
            try
            {
                string adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

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

                string adminEmailResult = SendEmail(adminEmail, studentDetail.ParentEmail, adminSubject, adminBody);
                if (adminEmailResult.Contains("Error"))
                {
                    return adminEmailResult;
                }

                // Email to Parent
                string parentSubject = "Agoura Math Circle : Student Registration confirmation for " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string parentBody = "Dear " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ",<br>"
                                 + " Thank you very much for registering your child " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + " in Agoura Math Circle."
                                 + " We will contact you about the class schedule and other details ASAP." + " <br/><br/>"
                                 + " If you have any question, please email to support@agouramathcircle.org." + " <br/><br/>"
                                 + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                string parentEmailResult = SendEmail(studentDetail.ParentEmail, adminEmail, parentSubject, parentBody);
                if (parentEmailResult.Contains("Error"))
                {
                    return parentEmailResult;
                }

                return "Emails sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending emails: {ex.Message}";
            }
        }

        public string SendEmailForExistingStudentRegistration(StudentDetail studentDetail)
        {
            try
            {
                string adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

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

                string emailResult = SendEmail(adminEmail, studentDetail.StudentEmailID, adminSubject, adminBody);
                if (emailResult.Contains("Error"))
                {
                    return emailResult;
                }

                return "Email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending email: {ex.Message}";
            }
        }

        private string SendEmail(string toEmail, string fromEmail, string subject, string body)
        {
            try
            {
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

                // Validate email addresses
                if (string.IsNullOrEmpty(toEmail) || !IsValidEmail(toEmail))
                {
                    return $"Error: Invalid recipient email address: {toEmail}";
                }

                if (string.IsNullOrEmpty(adminEmailID) || !IsValidEmail(adminEmailID))
                {
                    return $"Error: Invalid sender email address: {adminEmailID}";
                }

                MailMessage message = new MailMessage();
                message.From = new MailAddress(adminEmailID);
                message.To.Add(new MailAddress(toEmail));
                message.IsBodyHtml = true;
                message.Subject = subject;
                message.Body = body;

                // Try multiple SMTP servers with fallback
                string[] smtpServers = {
                    "relay-hosting.secureserver.net",
                    "mail.agouramathcircle.org",
                    "smtp.gmail.com",
                    "smtp.office365.com"
                };

                int[] ports = { 25, 587, 465 };

                Exception lastException = null;

                foreach (var server in smtpServers)
                {
                    foreach (var port in ports)
                    {
                        try
                        {
                            using (var smtpClient = new SmtpClient(server, port))
                            {
                                smtpClient.EnableSsl = port == 465 || port == 587; // Enable SSL for secure ports
                                smtpClient.UseDefaultCredentials = false;
                                smtpClient.Timeout = 30000; // 30 second timeout

                                smtpClient.Send(message);
                                return "Email sent successfully";
                            }
                        }
                        catch (Exception ex)
                        {
                            lastException = ex;
                            // Continue to next server/port combination
                            continue;
                        }
                    }
                }

                // If all servers failed, return the last exception
                return $"Error sending email to {toEmail}: All SMTP servers failed. Last error: {lastException?.Message}";
            }
            catch (Exception ex)
            {
                // Return detailed error message for debugging
                return $"Error sending email to {toEmail}: {ex.Message}. Inner Exception: {ex.InnerException?.Message}";
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> SendEmailAsync(string to, string from, string subject, string body)
        {
            try
            {
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

                // Validate email addresses
                if (string.IsNullOrEmpty(to) || !IsValidEmail(to))
                {
                    return $"Error: Invalid recipient email address: {to}";
                }

                if (string.IsNullOrEmpty(adminEmailID) || !IsValidEmail(adminEmailID))
                {
                    return $"Error: Invalid sender email address: {adminEmailID}";
                }

                MailMessage message = new MailMessage();
                message.From = new MailAddress(adminEmailID);
                message.To.Add(new MailAddress(to));
                message.IsBodyHtml = true;
                message.Subject = subject;
                message.Body = body;

                // Try multiple SMTP servers with fallback
                string[] smtpServers = {
                    "relay-hosting.secureserver.net",
                    "mail.agouramathcircle.org",
                    "smtp.gmail.com",
                    "smtp.office365.com"
                };

                int[] ports = { 25, 587, 465 };

                Exception lastException = null;

                foreach (var server in smtpServers)
                {
                    foreach (var port in ports)
                    {
                        try
                        {
                            using (var smtpClient = new SmtpClient(server, port))
                            {
                                smtpClient.EnableSsl = port == 465 || port == 587; // Enable SSL for secure ports
                                smtpClient.UseDefaultCredentials = false;
                                smtpClient.Timeout = 30000; // 30 second timeout

                                await smtpClient.SendMailAsync(message);
                                return "Email sent successfully";
                            }
                        }
                        catch (Exception ex)
                        {
                            lastException = ex;
                            // Continue to next server/port combination
                            continue;
                        }
                    }
                }

                // If all servers failed, return the last exception
                return $"Error sending email to {to}: All SMTP servers failed. Last error: {lastException?.Message}";
            }
            catch (Exception ex)
            {
                return $"Error sending email to {to}: {ex.Message}. Inner Exception: {ex.InnerException?.Message}";
            }
        }

        public async Task<string> SendEmailGroupAsync(string to, string from, string subject, string body, string group)
        {
            try
            {
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

                // Validate email addresses
                if (string.IsNullOrEmpty(to) || !IsValidEmail(to))
                {
                    return $"Error: Invalid recipient email address: {to}";
                }

                if (string.IsNullOrEmpty(adminEmailID) || !IsValidEmail(adminEmailID))
                {
                    return $"Error: Invalid sender email address: {adminEmailID}";
                }

                if (string.IsNullOrEmpty(group) || !IsValidEmail(group))
                {
                    return $"Error: Invalid group email address: {group}";
                }

                MailMessage message = new MailMessage();
                message.From = new MailAddress(adminEmailID);
                message.To.Add(new MailAddress(to));
                message.Bcc.Add(new MailAddress(group));
                message.IsBodyHtml = true;
                message.Subject = subject;
                message.Body = body;

                SmtpClient smtpClient = new SmtpClient("relay-hosting.secureserver.net", Convert.ToInt32(25));
                smtpClient.EnableSsl = false; // Explicitly disable SSL
                smtpClient.UseDefaultCredentials = false; // Explicitly disable default credentials

                await smtpClient.SendMailAsync(message);
                return $"Email sent successfully to group: {group}";
            }
            catch (Exception ex)
            {
                return $"Error sending email to group {group}: {ex.Message}. Inner Exception: {ex.InnerException?.Message}";
            }
        }

        public string SendForgotPasswordEmail(MemberMaster user)
        {
            try
            {
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";
                string supportEmail = _configuration.GetSection("AppSettings")["Email"] ?? "support@agouramathcircle.org";

                // Email subject and body matching the original ForgotPassword.aspx.cs
                string emailSubject = "Agoura Math Circle : Your Login Information";
                string emailBody = "Thank you very much for contacting with Agoura Math Circle.Here is your Login Information.<br/>"
                                + "<hr><br/>"
                                + " User Name: " + user.EmailID + "<br/>"
                                + " Password: " + user.Password + " <br/><hr>"
                                + " If you have any issue with your login, please email to info@agouramathcircle.org." + "<br/><br/>"
                                + " Regards <br> Agoura Math Circle <b/> <br/>www.agouramathcircle.org";

                string emailResult = SendEmail(user.EmailID ?? user.UserName, adminEmailID, emailSubject, emailBody);
                if (emailResult.Contains("Error"))
                {
                    return emailResult;
                }

                return "Email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending forgot password email: {ex.Message}";
            }
        }
    }
}
