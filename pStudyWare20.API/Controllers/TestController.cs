using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IEmailUtility _emailUtility;

        public TestController(IEmailUtility emailUtility)
        {
            _emailUtility = emailUtility;
        }

        /// <summary>
        /// Test email sending functionality
        /// </summary>
        [HttpPost("send-test-email")]
        public async Task<IActionResult> SendTestEmail([FromBody] TestEmailRequest request)
        {
            try
            {
                var result = await _emailUtility.SendEmailAsync(
                    request.ToEmail,
                    "test@agouramathcircle.net",
                    "Test Email from pStudyWare20 API",
                    "<h1>Test Email</h1><p>This is a test email from the pStudyWare20 API.</p>"
                );

                return Ok(new { message = result, success = !result.Contains("Error") });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Exception occurred: {ex.Message}", success = false });
            }
        }

        /// <summary>
        /// Test forgot password email
        /// </summary>
        [HttpPost("send-forgot-password-test")]
        public IActionResult SendForgotPasswordTest([FromBody] TestEmailRequest request)
        {
            try
            {
                // Create a test user object
                var testUser = new pStudyWare20.Data.Models.MemberMaster
                {
                    EmailID = request.ToEmail,
                    UserName = request.ToEmail,
                    Password = "TestPassword123",
                    FirstName = "Test",
                    LastName = "User"
                };

                var result = _emailUtility.SendForgotPasswordEmail(testUser);

                return Ok(new { message = result, success = !result.Contains("Error") });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Exception occurred: {ex.Message}", success = false });
            }
        }

        /// <summary>
        /// Test SMTP connection with different servers
        /// </summary>
        //[HttpGet("test-smtp-connection")]
        //public async Task<IActionResult> TestSmtpConnection()
        //{
        //    try
        //    {
        //        var results = new List<object>();
        //        string[] smtpServers = {
        //            "relay-hosting.secureserver.net",
        //            "mail.agouramathcircle.org",
        //            "smtp.gmail.com",
        //            "smtp.office365.com"
        //        };

        //        int[] ports = { 25, 587, 465 };

        //        foreach (var server in smtpServers)
        //        {
        //            foreach (var port in ports)
        //            {
        //                try
        //                {
        //                    using (var smtpClient = new System.Net.Mail.SmtpClient(server, port))
        //                    {
        //                        smtpClient.EnableSsl = port == 465 || port == 587;
        //                        smtpClient.UseDefaultCredentials = false;
        //                        smtpClient.Timeout = 5000; // 5 second timeout for testing

        //                        // Try to connect (this will throw if connection fails)
        //                        await Task.Run(() => smtpClient.Send(new System.Net.Mail.MailMessage()));

        //                        results.Add(new { server, port, status = "Success" });
        //                    }
        //                }
        //                catch (Exception ex)
        //                {
        //                    results.Add(new { server, port, status = "Failed", error = ex.Message });
        //                }
        //            }
        //        }

        //        return Ok(new { message = "SMTP connection test completed", results });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = $"Exception occurred: {ex.Message}" });
        //    }
        //}
    }

    public class TestEmailRequest
    {
        public string ToEmail { get; set; } = string.Empty;
    }
}
