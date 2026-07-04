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
                string amcRegistrationemail = _configuration.GetSection("AppSettings")["AMCRegistrationEmailID"] ?? "test.admin@agouramathcircle.org";

                // Email to Admin (matches old file logic)
                string adminSubject = "Agoura Math Circle : New Volunteer request from: " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                string adminBody = "Just Recieved New Volunteer request from " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + "<br/>"
                                + " Student Name: " + volunteerDetail.FirstName + "<br/>"
                                + " Education: " + volunteerDetail.Grade + "<br/>"
                                + " School/University: " + volunteerDetail.SchoolName + "<br/>"
                                + " Register For : " + volunteerDetail.SessionName + "<br/>"
                                + " Location: " + volunteerDetail.LocationId + "<br/>"
                                + " Interested For : " + volunteerDetail.InterestedFor + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                var adminEmailResult = SendEmail(amcRegistrationemail, volunteerDetail.Email, adminSubject, adminBody);
                if (!adminEmailResult == true)
                {
                    return adminEmailResult.ToString();
                }

                // Email to Volunteer (matches old file logic)
                string volunteerSubject = "Agoura Math Circle : New Volunteer Request confirmation for " + volunteerDetail.FirstName + " " + volunteerDetail.LastName + ".";
                string volunteerBody = volunteerDetail.FirstName + " " + volunteerDetail.LastName + ",<Br>"
                                    + " Thank you very much for registering as volunteer in Agoura Math Circle."
                                    + " We will contact you about your role and responsibilty ASAP." + " <br/><br/>"
                                    + " If you have any question, please email to support@agouramathcircle.org." + "<br/><br/>"
                                    + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                var volunteerEmailResult = SendEmail(volunteerDetail.Email, adminEmail, volunteerSubject, volunteerBody);
                if (!volunteerEmailResult == true)
                {
                    return volunteerEmailResult.ToString();
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
                string amcRegistrationemail = _configuration.GetSection("AppSettings")["AMCRegistrationEmailID"] ?? "info@agouramathcircle.net";

                string emailBCC = "";

                string emailSendTo = amcRegistrationemail; 
                string emailFrom = studentDetail.ParentEmail; // matches .aspx.cs line 200: EmailFrom = ConfigurationManager.AppSettings["Email"]            

                // Email to Admin (matches InformMe() logic in .aspx.cs lines 142-148)
                string adminSubject = "Agoura Math Circle : New Registration request from: " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ".";
                string adminBody = "Just Recieved New Registration request from " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + "Session: " + (string.IsNullOrEmpty(studentDetail.SessionName) ? studentDetail.SessionId : studentDetail.SessionName) + "<br/>"
                                + " Student Level: " + studentDetail.StudentGrade + "<br/>"
                                + " Course/Location: " + (string.IsNullOrEmpty(studentDetail.LocationName) ? studentDetail.LocationId.ToString() : studentDetail.LocationName) + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                // Special handling for LocationId == 3 (BCC to support.ic@agouramathcircle.org)
                if (studentDetail.LocationId.ToString() == "3")
                {
                    //emailBCC = "support.ic@agouramathcircle.org";
                    //string adminEmailResult = SendEmailGroupAsync(amcRegistrationemail, studentDetail.ParentEmail, adminSubject, adminBody, emailBCC).Result;
                    //if (adminEmailResult.Contains("Error"))
                    //{
                    //    return adminEmailResult;
                    //}
                }
                else
                {
                    // SendEmail(EmailSendTo, EmailFrom, Emailsubject, RegistrationInfo) - matches .aspx.cs line 152
                    SendEmail(emailSendTo, emailFrom, adminSubject, adminBody);                   
                }

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
                string amcRegistrationemail = _configuration.GetSection("AppSettings")["AMCRegistrationEmailID"] ?? "info@agouramathcircle.net";
                

                string emailSendTo = studentDetail.ParentEmail; // matches .aspx.cs line 199: EmailSendTo = txtParentEmail.Text
                string emailFrom = amcRegistrationemail; // matches .aspx.cs line 200: EmailFrom = ConfigurationManager.AppSettings["Email"]
                string emailSubject;
                string registrationInfo;

                // Different email content for LocationId = 4 (Engineering Circle) - matches InformParent() logic in .aspx.cs lines 174-184
                if (studentDetail.LocationId.ToString() == "4")
                {
                    emailSubject = "Agoura Engineering Circle: New Registration confirmation for " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ".";
                    registrationInfo = "Thank you very much for registering in Agoura Engineering Circle. We have recieved your application for " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".<br/>"
                                    + " Session: " + (string.IsNullOrEmpty(studentDetail.SessionName) ? studentDetail.SessionId : studentDetail.SessionName) + "<br/>"
                                    + " Student Grade: " + studentDetail.StudentGrade + "<br/><hr>" // matches .aspx.cs line 179
                                    + " Course/Location: " + (string.IsNullOrEmpty(studentDetail.LocationName) ? studentDetail.LocationId.ToString() : studentDetail.LocationName) + "<br/>"
                                    + " Note: We will review and decide on your application based on the availability of space, your assessment performance, and eligibility. We will send an email about the assessment test. If space is not available, we will add you into our waiting list for our next session. " + " <br/><br/>"
                                    + " If you have any questions or concerns, please email us via support@agouramathcircle.org." + "<br/><br/>"
                                    + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                }
                else
                {
                    // Matches InformParent() logic in .aspx.cs lines 189-196
                    emailSubject = "Agoura Math Circle : New Registration confirmation for " + studentDetail.ParentFirstName + " " + studentDetail.ParentLastName + ".";
                    registrationInfo = "Thank you very much for registering in Agoura Math Circle. We have recieved your application for " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".<br/>"
                                    + " Session: " + (string.IsNullOrEmpty(studentDetail.SessionName) ? studentDetail.SessionId : studentDetail.SessionName) + "<br/>"
                                    + " Student Grade: " + studentDetail.StudentGrade + "<br/><hr>" // matches .aspx.cs line 192
                                    + " Course/Location: " + (string.IsNullOrEmpty(studentDetail.LocationName) ? studentDetail.LocationId.ToString() : studentDetail.LocationName) + "<br/>"
                                    + " Note: We will review and decide on your application based on the availability of space. If space is not avaiable, we will add you into our waiting list. We will email those on the waiting list when there is space." + " <br/><br/>"
                                    + " If you have any questions or concerns, please email us via support@agouramathcircle.org." + "<br/><br/>"
                                    + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                }

                // Use SendEmail if UserNameType is "P" (Parent), SendEmailGroup if UserNameType is "S" (Student)
                // Matches InformParent() logic in .aspx.cs line 201: if (rblUserName.SelectedIndex == 0)
                // SelectedIndex == 0 means first option selected, which is "P" (Parent)
                string emailResult;
                if (studentDetail.UserNameType == "P" || studentDetail.UserName == studentDetail.ParentEmail)
                {
                    // Username is parent email (UserNameType="P" or rblUserName.SelectedIndex==0) - use SendEmail (matches .aspx.cs line 203)
                    SendEmail(emailSendTo, emailFrom, emailSubject, registrationInfo);
                }
                else
                {
                    // Username is student email (UserNameType="S") - use SendEmailGroup (BCC student email) (matches .aspx.cs line 207)
                    emailResult = SendEmailGroupAsync(emailSendTo, emailFrom, emailSubject, registrationInfo, studentDetail.StudentEmail).Result;
                }

                //if (emailResult.Contains("Error"))
                //{
                //    return emailResult;
                //}

                return "Parent email sent successfully";
            }
            catch (Exception ex)
            {
                return $"Error sending parent email: {ex.Message}";
            }
        }

        public string SendEmailForExistingStudentRegistration(StudentDetail studentDetail)
        {
            try
            {
                // Use AMCRegistrationEmailID from config (matches old file logic)
                string adminEmail = _configuration.GetSection("AppSettings")["AMCRegistrationEmailID"]
                    ?? _configuration.GetSection("AppSettings")["AdminEmailID"]
                    ?? "info@agouramathcircle.net";

                // Email to Admin (matches old file logic)
                string adminSubject = "Agoura Math Circle : Registration request from: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string adminBody = "Just Recieved registration from " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Level: " + studentDetail.GradeLevel + "<br/>"
                                + " Session: " + (GetPropertyValue(studentDetail, "RegistrationSession") ?? "") + "<br/>"
                                + " Chapter: " + (GetPropertyValue(studentDetail, "RegistrationChapter") ?? "") + "<br/>"
                                + " Location: " + (GetPropertyValue(studentDetail, "RegistrationLocation") ?? "") + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                // Use RegistrationUserName if available, otherwise use StudentEmailID (matches old file logic)
                string fromEmail = GetPropertyValue(studentDetail, "RegistrationUserName") ?? studentDetail.StudentEmailID;
                SendEmail(adminEmail, fromEmail, adminSubject, adminBody);
                //if (emailResult.Contains("Error"))
                //{
                //    return emailResult;
                //}

                // Email to Parent (matches old file logic)
                string parentSubject = "Agoura Math Circle : Registration Confirmation " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + ".";
                string parentBody = "You have successfuly resgistered " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Name: " + studentDetail.StudentFirstName + " " + studentDetail.StudentLastName + "<br/>"
                                + " Student Level: " + studentDetail.GradeLevel + "<br/>"
                                + " Session: " + (GetPropertyValue(studentDetail, "RegistrationSession") ?? "") + "<br/>"
                                + " Chapter: " + (GetPropertyValue(studentDetail, "RegistrationChapter") ?? "") + "<br/>"
                                + " Location: " + (GetPropertyValue(studentDetail, "RegistrationLocation") ?? "") + "<br/>"
                                + " Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                string toEmail = GetPropertyValue(studentDetail, "RegistrationUserName") ?? studentDetail.StudentEmailID;
                SendEmail(toEmail, adminEmail, parentSubject, parentBody);
                //if (parentEmailResult.Contains("Error"))
                //{
                //    return parentEmailResult;
                //}

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

        //private bool SendEmailGroup(string SendTo, string SentFrom, string subject, string body, string SendBcc)
        //{
        //    string AdminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"];

        //    try
        //    {
        //        MailMessage message = new MailMessage();
        //        message.From = new MailAddress(AdminEmailID);
        //        message.To.Add(new MailAddress(SendTo));
        //        message.Bcc.Add(new MailAddress(SendBcc));
        //        message.IsBodyHtml = true;
        //        message.Subject = subject;
        //        message.Body = body;

        //        // Read SMTP settings from configuration
        //        string smtpServer = _configuration.GetSection("SmtpSettings")["Server"] ?? "relay-hosting.secureserver.net";
        //        int smtpPort = int.TryParse(_configuration.GetSection("SmtpSettings")["Port"], out int port) ? port : 25;
        //        bool enableSsl = bool.TryParse(_configuration.GetSection("SmtpSettings")["EnableSsl"], out bool ssl) ? ssl : false;
        //        bool useDefaultCredentials = bool.TryParse(_configuration.GetSection("SmtpSettings")["UseDefaultCredentials"], out bool credentials) ? credentials : false;
        //        int timeout = int.TryParse(_configuration.GetSection("SmtpSettings")["Timeout"], out int time) ? time : 30000;

        //        SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort);
        //        smtpClient.EnableSsl = enableSsl;
        //        smtpClient.UseDefaultCredentials = useDefaultCredentials;
        //        smtpClient.Timeout = timeout;
        //        smtpClient.Send(message);
        //        return true;
        //    }
        //    catch (Exception)
        //    {
        //        return false;
        //    }
        //}
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

                SendEmail(user.EmailID ?? user.UserName, adminEmailID, emailSubject, emailBody);
                //if (emailResult.Contains("Error"))
                //{
                //    return emailResult;
                //}

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
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

                // Email subject and body matching the original SendChangePassword method from AMCWebServices/EmailUtility.cs
                string emailSubject = "Agoura Math Circle :  Your Password changed.";
                string emailBody = "You have successfuly changed your password<br/>"
                                + " Your New Password: " + newPassword + "<br/> "
                                + " Regards<br/>Agoura Math Circle<b/><br/>www.agouramathcircle.org";

                SendEmail(email, adminEmailID, emailSubject, emailBody);
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
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

                // Email subject and body matching the original SendForgetPassword method from AMCWebServices/EmailUtility.cs
                string emailSubject = "Agoura Math Circle : Your Login Information";
                string emailBody = "Thank you very much for contacting with Agoura Math Circle.Here is your Login Information.<br/>"
                                + "<hr><br/>"
                                + " User Name: " + emailAddress + "<br/>"
                                + " Password: " + password + " <br/><hr>"
                                + " If you have any issue with your login, please email to info@agouramathcircle.org." + "<br/><br/>"
                                + " Regards <br> Agoura Math Circle <b/> <br/>www.agouramathcircle.org";

                SendEmail(emailAddress, adminEmailID, emailSubject, emailBody);
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
                string emailSendTo = _configuration.GetSection("AppSettings")["Email"] ?? "support@agouramathcircle.org";
                string emailSubject = "Agoura Math Circle :Inquiry from " + name;
                string emailBody = string.IsNullOrWhiteSpace(subject)
                    ? message
                    : $"<strong>Subject:</strong> {subject}<br/><br/>{message}";

                return SendEmail(emailSendTo, email, emailSubject, emailBody);
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
                string adminEmailID = _configuration.GetSection("AppSettings")["AdminEmailID"] ?? "info@agouramathcircle.net";

                // Email subject and body matching the original SendChangePassword method from AMCWebServices/EmailUtility.cs
                string emailSubject = "Agoura Math Circle :  Your Password changed.";
                string emailBody = "You have successfuly changed your password<br/>"
                                + " Your New Password: " + password + "<br/> "
                                + " Regards<br/>Agoura Math Circle<b/><br/>www.agouramathcircle.org";

                SendEmail(emailAddress, adminEmailID, emailSubject, emailBody);
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
