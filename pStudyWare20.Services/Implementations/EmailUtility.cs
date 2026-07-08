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

        public string SendEmailtoRegistrationForVolunteerRegistration(RegistrationVolunteerModel volunteerDetail)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";
                string toRegistrationEmail = _configuration.GetSection("AppSettings")["RegistrationEmailGroup"] ?? "Registration@agouramathcircle.org";

                string adminSubject = "Agoura Math Circle : New Volunteer request from: " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                var educationDisplay = string.IsNullOrWhiteSpace(volunteerDetail.GradeName)
                    ? volunteerDetail.Grade
                    : volunteerDetail.GradeName;
                var interestedForDisplay = string.IsNullOrWhiteSpace(volunteerDetail.InterestedForName)
                    ? volunteerDetail.InterestedFor
                    : volunteerDetail.InterestedForName;
                var courseLocationDisplay = string.IsNullOrWhiteSpace(volunteerDetail.LocationName)
                    ? volunteerDetail.LocationId.ToString()
                    : volunteerDetail.LocationName;
                var sessionDisplay = string.IsNullOrWhiteSpace(volunteerDetail.SessionName)
                    ? volunteerDetail.SessionId
                    : volunteerDetail.SessionName;

                string adminBody = "Just Recieved New Volunteer request from " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + "<br/>"
                                + " Student Name: " + volunteerDetail.FirstName + "<br/>"
                                + " Education: " + educationDisplay + "<br/>"
                                + " School/University: " + volunteerDetail.SchoolName + "<br/>"
                                + " Register For : " + sessionDisplay + "<br/>"
                                + " Course/Location: " + courseLocationDisplay + "<br/>"
                                + " Interested For : " + interestedForDisplay + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                var adminEmailResult = SendEmail(toRegistrationEmail, fromEmail, adminSubject, adminBody);
                if (adminEmailResult != true)
                {
                    return adminEmailResult.ToString();
                }

                return "Registration email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending registration email: {ex.Message}";
            }
        }

        public string SendEmailtoVolunteerForVolunteerRegistration (RegistrationVolunteerModel volunteerDetail)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";
                string toVolunteerEmail = volunteerDetail.Email;

                string volunteerSubject = "Agoura Math Circle : New Volunteer Request confirmation for " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                string volunteerBody = volunteerDetail.FirstName + " " + volunteerDetail.LastName + ",<Br>"
                                    + " Thank you very much for registering as volunteer in Agoura Math Circle."
                                    + " We will contact you about your role and responsibilty ASAP." + " <br/><br/>"
                                    + " If you have any question, please email to support@agouramathcircle.org." + "<br/><br/>"
                                    + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                var volunteerEmailResult = SendEmail(toVolunteerEmail, fromEmail, volunteerSubject, volunteerBody);
                if (volunteerEmailResult != true)
                {
                    return volunteerEmailResult.ToString();
                }

                return "Volunteer confirmation email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending volunteer confirmation email: {ex.Message}";
            }
        }

        public string SendEmailtoRegistrationForStudentRegistration(RegistrationStudentModel studentDetail)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";
                string toRegistrationemail = _configuration.GetSection("AppSettings")["RegistrationEmailGroup"] ?? "Registration@agouramathcircle.org";

                string emailSendTo = toRegistrationemail;
                string emailFrom = fromEmail;

                var sessionDisplay = ResolveStudentSessionDisplay(studentDetail);
                var locationDisplay = ResolveStudentLocationDisplay(studentDetail);
                var gradeDisplay = studentDetail.StudentGrade ?? string.Empty;

                string adminSubject = "Agoura Math Circle : New Registration request from: " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ".";
                string adminBody = "Just Recieved New Registration request from " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + "Semester: " + sessionDisplay + "<br/>"
                                + " Student Level: " + gradeDisplay + "<br/>"
                                + " Course/Location: " + locationDisplay + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                SendEmail(emailSendTo, emailFrom, adminSubject, adminBody);

                return "Admin email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending admin email: {ex.Message}";
            }
        }

        public string SendEmailtoParentForStudentRegistration(RegistrationStudentModel studentDetail)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                string emailSendTo = studentDetail.ParentEmail;
                string emailFrom = fromEmail;
                string emailSubject;
                string registrationInfo;

                var sessionDisplay = ResolveStudentSessionDisplay(studentDetail);
                var locationDisplay = ResolveStudentLocationDisplay(studentDetail);
                var gradeDisplay = studentDetail.StudentGrade ?? string.Empty;


                emailSubject = "Agoura Math Circle: New Registration confirmation for " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ".";
                registrationInfo = "Thank you very much for registering in Agoura Math Circle. We have recieved your application for " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".<br/>"
                                + " Semester: " + sessionDisplay + "<br/>"
                                + " Student Grade: " + gradeDisplay + "<br/><hr>"
                                + " Course/Location: " + locationDisplay + "<br/>"
                                + " Note: We will review and decide on your application based on the availability of space. If space is not avaiable, we will add you into our waiting list. We will email those on the waiting list when there is space." + " <br/><br/>"
                                + " If you have any questions or concerns, please email us via support@agouramathcircle.org." + "<br/><br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";


                if (studentDetail.UserNameType == "P" || studentDetail.UserName == studentDetail.ParentEmail)
                {
                    SendEmail(emailSendTo, emailFrom, emailSubject, registrationInfo);
                }
                else
                {
                    SendEmailGroupAsync(emailSendTo, emailFrom, emailSubject, registrationInfo, studentDetail.StudentEmail).GetAwaiter().GetResult();
                }

                return "Parent email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending parent email: {ex.Message}";
            }
        }

        private static string ResolveStudentSessionDisplay(RegistrationStudentModel studentDetail)
        {
            if (!string.IsNullOrWhiteSpace(studentDetail.SessionName))
            {
                return studentDetail.SessionName;
            }

            return studentDetail.SessionId ?? string.Empty;
        }

        private static string ResolveStudentLocationDisplay(RegistrationStudentModel studentDetail)
        {
            if (!string.IsNullOrWhiteSpace(studentDetail.LocationName))
            {
                return studentDetail.LocationName;
            }

            return studentDetail.LocationId > 0
                ? studentDetail.LocationId.ToString()
                : string.Empty;
        }

        public string SendEmailForExistingStudentRegistration(StudentDetail studentDetail)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";


                // Use RegistrationEmailGroup from config (matches old file logic)
                string toRegistrationEmail = _configuration.GetSection("AppSettings")["RegistrationEmailGroup"] ?? "Registration@agouramathcircle.org";

                // Email to Admin (matches old file logic)
                string adminSubject = "Agoura Math Circle : Registration request from: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string adminBody = "Just Recieved registration from " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Level: " + studentDetail.GradeLevel + "<br/>"
                                + " Session: " + studentDetail.RegistrationSession + "<br/>"
                                + " Chapter: " + studentDetail.RegistrationChapter + "<br/>"
                                + " Location: " + studentDetail.RegistrationLocation + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";         
                SendEmail(toRegistrationEmail, fromEmail, adminSubject, adminBody);


                // Email to Parent (matches old file logic)

                string parentSubject = "Agoura Math Circle : Registration Confirmation " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string parentBody = "You have successfuly resgistered " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Level: " + studentDetail.GradeLevel + "<br/>"
                                + " Session: " + studentDetail.RegistrationSession + "<br/>"
                                + " Chapter: " + studentDetail.RegistrationChapter + "<br/>"
                                + " Location: " + studentDetail.RegistrationLocation + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                
                string toParentEmail = !string.IsNullOrWhiteSpace(studentDetail.RegistrationUserName)
                    ? studentDetail.RegistrationUserName
                    : studentDetail.StudentEmailID;

                SendEmail(toParentEmail, toParentEmail, parentSubject, parentBody);               

                return "Emails sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending email: {ex.Message}";
            }
        }

        private bool SendEmail(string SendTo, string SentFrom, string subject, string body)
        {
            try
            {
                // Validate email addresses
                if (string.IsNullOrEmpty(SendTo) || string.IsNullOrEmpty(SentFrom))
                {
                    System.Diagnostics.Trace.TraceError($"[SendEmail] Email addresses cannot be null or empty. To: {SendTo}, From: {SentFrom}");
                    return false;
                }

                MailMessage message = new MailMessage();
                message.From = new MailAddress(SentFrom);
                message.To.Add(new MailAddress(SendTo));
                message.IsBodyHtml = true;
                message.Subject = subject;
                message.Body = body;

                // Read SMTP settings from configuration
                string smtpServer = _configuration.GetSection("SmtpSettings")["Server"] ?? "relay-hosting.secureserver.net";
                int smtpPort = int.TryParse(_configuration.GetSection("SmtpSettings")["Port"], out int port) ? port : 25;
                bool enableSsl = bool.TryParse(_configuration.GetSection("SmtpSettings")["EnableSsl"], out bool ssl) ? ssl : false;
                bool useDefaultCredentials = bool.TryParse(_configuration.GetSection("SmtpSettings")["UseDefaultCredentials"], out bool credentials) ? credentials : false;
                int timeout = int.TryParse(_configuration.GetSection("SmtpSettings")["Timeout"], out int time) ? time : 30000;

                System.Diagnostics.Trace.TraceInformation($"[SendEmail] Attempting to send email. Server: {smtpServer}, Port: {smtpPort}, To: {SendTo}, From: {SentFrom}");

                using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
                {
                    smtpClient.EnableSsl = enableSsl;
                    smtpClient.UseDefaultCredentials = useDefaultCredentials;
                    smtpClient.Timeout = timeout;
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                    
                    smtpClient.Send(message);
                }
                
                System.Diagnostics.Trace.TraceInformation($"[SendEmail] Email sent successfully to {SendTo}");
                return true;
            }
            catch (SmtpException smtpEx)
            {
                // Log SMTP-specific errors for troubleshooting
                System.Diagnostics.Trace.TraceError($"[SendEmail] SMTP Error sending email to {SendTo}: {smtpEx.Message}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] SMTP Status Code: {smtpEx.StatusCode}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Inner Exception: {smtpEx.InnerException?.Message}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Stack Trace: {smtpEx.StackTrace}");
                return false;
            }
            catch (System.Net.Sockets.SocketException socketEx)
            {
                // Network/DNS related errors
                System.Diagnostics.Trace.TraceError($"[SendEmail] Network Error sending email to {SendTo}: {socketEx.Message}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Socket Error Code: {socketEx.SocketErrorCode}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Stack Trace: {socketEx.StackTrace}");
                return false;
            }
            catch (Exception ex)
            {
                // Log general errors for troubleshooting
                System.Diagnostics.Trace.TraceError($"[SendEmail] Error sending email to {SendTo}: {ex.Message}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Exception Type: {ex.GetType().Name}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Inner Exception: {ex.InnerException?.Message}");
                System.Diagnostics.Trace.TraceError($"[SendEmail] Stack Trace: {ex.StackTrace}");
                return false;
            }
        }
        
        private string? GetPropertyValue(object obj, string propertyName)
        {
            try
            {
                var property = obj.GetType().GetProperty(propertyName);
                return property?.GetValue(obj)?.ToString();
            }
            catch
            {
                return null;
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
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                // Validate email addresses
                if (string.IsNullOrEmpty(to) || !IsValidEmail(to))
                {
                    return $"Error: Invalid recipient email address: {to}";
                }

                if (string.IsNullOrEmpty(fromEmail) || !IsValidEmail(fromEmail))
                {
                    return $"Error: Invalid sender email address: {fromEmail}";
                }

                MailMessage message = new MailMessage();
                message.From = new MailAddress(fromEmail);
                message.To.Add(new MailAddress(to));
                message.IsBodyHtml = true;
                message.Subject = subject;
                message.Body = body;

                // Read SMTP settings from configuration
                string configuredServer = _configuration.GetSection("SmtpSettings")["Server"] ?? "relay-hosting.secureserver.net";
                int configuredPort = int.TryParse(_configuration.GetSection("SmtpSettings")["Port"], out int port) ? port : 25;
                bool configuredEnableSsl = bool.TryParse(_configuration.GetSection("SmtpSettings")["EnableSsl"], out bool ssl) ? ssl : false;
                bool configuredUseDefaultCredentials = bool.TryParse(_configuration.GetSection("SmtpSettings")["UseDefaultCredentials"], out bool credentials) ? credentials : false;
                int configuredTimeout = int.TryParse(_configuration.GetSection("SmtpSettings")["Timeout"], out int time) ? time : 30000;

                // Try configured SMTP server first, then fallback to others
                string[] smtpServers = {
                    configuredServer,
                    "relay-hosting.secureserver.net",
                    "mail.agouramathcircle.org",
                    "smtp.gmail.com",
                    "smtp.office365.com"
                };

                int[] ports = { configuredPort, 25, 587, 465 };

                Exception lastException = null;

                foreach (var server in smtpServers)
                {
                    foreach (var portNumber in ports)
                    {
                        try
                        {
                            using (var smtpClient = new SmtpClient(server, portNumber))
                            {
                                // Use configured settings for the configured server, otherwise use defaults
                                if (server == configuredServer && portNumber == configuredPort)
                                {
                                    smtpClient.EnableSsl = configuredEnableSsl;
                                    smtpClient.UseDefaultCredentials = configuredUseDefaultCredentials;
                                    smtpClient.Timeout = configuredTimeout;
                                }
                                else
                                {
                                    smtpClient.EnableSsl = portNumber == 465 || portNumber == 587; // Enable SSL for secure ports
                                    smtpClient.UseDefaultCredentials = false;
                                    smtpClient.Timeout = 30000; // 30 second timeout
                                }

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
                string fromEnailInfo = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                // Validate email addresses
                if (string.IsNullOrEmpty(to) || !IsValidEmail(to))
                {
                    return $"Error: Invalid recipient email address: {to}";
                }

                if (string.IsNullOrEmpty(fromEnailInfo) || !IsValidEmail(fromEnailInfo))
                {
                    return $"Error: Invalid sender email address: {fromEnailInfo}";
                }

                if (string.IsNullOrEmpty(group) || !IsValidEmail(group))
                {
                    return $"Error: Invalid group email address: {group}";
                }

                MailMessage message = new MailMessage();
                message.From = new MailAddress(fromEnailInfo);
                message.To.Add(new MailAddress(to));
                message.Bcc.Add(new MailAddress(group));
                message.IsBodyHtml = true;
                message.Subject = subject;
                message.Body = body;

                // Read SMTP settings from configuration
                string smtpServer = _configuration.GetSection("SmtpSettings")["Server"] ?? "relay-hosting.secureserver.net";
                int smtpPort = int.TryParse(_configuration.GetSection("SmtpSettings")["Port"], out int port) ? port : 25;
                bool enableSsl = bool.TryParse(_configuration.GetSection("SmtpSettings")["EnableSsl"], out bool ssl) ? ssl : false;
                bool useDefaultCredentials = bool.TryParse(_configuration.GetSection("SmtpSettings")["UseDefaultCredentials"], out bool credentials) ? credentials : false;
                int timeout = int.TryParse(_configuration.GetSection("SmtpSettings")["Timeout"], out int time) ? time : 30000;

                SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);
                smtpClient.EnableSsl = enableSsl;
                smtpClient.UseDefaultCredentials = useDefaultCredentials;
                smtpClient.Timeout = timeout;

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
                string fromEmail = _configuration.GetSection("AppSettings")["EnailInfo"] ?? "info@agouramathcircle.net";
              
                // Email subject and body matching the original ForgotPassword.aspx.cs
                string emailSubject = "Agoura Math Circle : Your Login Information";
                string emailBody = "Thank you very much for contacting with Agoura Math Circle.Here is your Login Information.<br/>"
                                + "<hr><br/>"
                                + " User Name: " + user.EmailID + "<br/>"
                                + " Password: " + user.Password + " <br/><hr>"
                                + " If you have any issue with your login, please email to info@agouramathcircle.org." + "<br/><br/>"
                                + " Regards <br> Agoura Math Circle <b/> <br/>www.agouramathcircle.org";

                SendEmail(user.EmailID, fromEmail, emailSubject, emailBody);                

                return "Email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending forgot password email: {ex.Message}";
            }
        }

        public string SendPasswordChangedEmail(string email, string newPassword)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                // Email subject and body matching the original SendChangePassword method from AMCWebServices/EmailUtility.cs
                string emailSubject = "Agoura Math Circle :  Your Password changed.";
                string emailBody = "You have successfuly changed your password<br/>"
                                + " Your New Password: " + newPassword + "<br/> "
                                + " Regards<br/>Agoura Math Circle<b/><br/>www.agouramathcircle.org";

                SendEmail(email, fromEmail, emailSubject, emailBody);
                //if (emailResult.Contains("Error"))
                //{
                //    return emailResult;
                //}

                return "Email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending password changed email: {ex.Message}";
            }
        }

        /// <summary>
        /// Sends forgot password email - matches SendForgetPassword from AMCWebServices/EmailUtility.cs
        /// </summary>
        public bool SendForgetPassword(string emailAddress, string password)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                // Email subject and body matching the original SendForgetPassword method from AMCWebServices/EmailUtility.cs
                string emailSubject = "Agoura Math Circle : Your Login Information";
                string emailBody = "Thank you very much for contacting with Agoura Math Circle.Here is your Login Information.<br/>"
                                + "<hr><br/>"
                                + " User Name: " + emailAddress + "<br/>"
                                + " Password: " + password + " <br/><hr>"
                                + " If you have any issue with your login, please email to info@agouramathcircle.org." + "<br/><br/>"
                                + " Regards <br> Agoura Math Circle <b/> <br/>www.agouramathcircle.org";

                SendEmail(emailAddress, fromEmail, emailSubject, emailBody);
                //if (emailResult.Contains("Error"))
                //{
                //    return false;
                //}

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Sends contact enquiry notification to admin (matches ContactUs.aspx.cs InformMe).
        /// </summary>
        public bool SendContactEnquiryEmail(string name, string email, string subject, string message)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"]
                    ?? "info@agouramathcircle.net";
                string emailSendTo = _configuration.GetSection("AppSettings")["AMCEmailID"]
                    ?? "support@agouramathcircle.org";
                string emailSubject = "Agoura Math Circle :Inquiry from " + name;
                string emailBody = $"<strong>Name:</strong> {name}<br/>"
                    + $"<strong>Email:</strong> {email}<br/>";

                if (!string.IsNullOrWhiteSpace(subject))
                {
                    emailBody += $"<strong>Subject:</strong> {subject}<br/>";
                }

                emailBody += $"<br/>{message}";

                return SendEmail(emailSendTo, fromEmail, emailSubject, emailBody);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Sends change password email - matches SendChangePassword from AMCWebServices/EmailUtility.cs
        /// </summary>
        public bool SendChangePassword(string emailAddress, string password)
        {
            try
            {
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                // Email subject and body matching the original SendChangePassword method from AMCWebServices/EmailUtility.cs
                string emailSubject = "Agoura Math Circle :  Your Password changed.";
                string emailBody = "You have successfuly changed your password<br/>"
                                + " Your New Password: " + password + "<br/> "
                                + " Regards<br/>Agoura Math Circle<b/><br/>www.agouramathcircle.org";

                SendEmail(emailAddress, fromEmail, emailSubject, emailBody);
                //if (emailResult.Contains("Error"))
                //{
                //    return false;
                //}

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
