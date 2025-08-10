using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.ComponentModel;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class TestController : ControllerBase
    {
        /// <summary>
        /// Public endpoint that doesn't require authentication
        /// </summary>
        /// <returns>Public message with timestamp</returns>
        [HttpGet("public")]
        [Description("Public endpoint - no authentication required")]
        public IActionResult PublicEndpoint()
        {
            return Ok(new { message = "This is a public endpoint - no authentication required", timestamp = DateTime.UtcNow });
        }

        /// <summary>
        /// Test CORS configuration
        /// </summary>
        /// <returns>CORS test result with request details</returns>
        [HttpGet("cors-test")]
        [Description("Test CORS configuration")]
        public IActionResult CorsTest()
        {
            return Ok(new
            {
                message = "CORS test successful!",
                timestamp = DateTime.UtcNow,
                origin = Request.Headers["Origin"].ToString(),
                method = Request.Method,
                headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString())
            });
        }

        /// <summary>
        /// Test CORS with OPTIONS request
        /// </summary>
        /// <returns>CORS preflight response</returns>
        [HttpOptions("cors-options")]
        [Description("Test CORS preflight request")]
        public IActionResult CorsOptions()
        {
            return Ok(new { message = "CORS preflight successful" });
        }

        /// <summary>
        /// Protected endpoint that requires authentication
        /// </summary>
        /// <returns>Protected message</returns>
        [HttpGet("protected")]
        [Authorize]
        [Description("Protected endpoint - authentication required")]
        public IActionResult ProtectedEndpoint()
        {
            return Ok(new { message = "This is a protected endpoint - authentication required" });
        }

        /// <summary>
        /// Admin endpoint that requires admin role
        /// </summary>
        /// <returns>Admin message</returns>
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        [Description("Admin endpoint - admin role required")]
        public IActionResult AdminEndpoint()
        {
            return Ok(new { message = "This is an admin endpoint - admin role required" });
        }

        [HttpGet("student-dashboard")]
        public IActionResult StudentDashboardData()
        {
            // Mock data for student dashboard
            var dashboardData = new
            {
                registrationData = new[]
                {
                    new
                    {
                        studentId = "001",
                        studentName = "John Doe",
                        eventLocation = "Agoura Hills",
                        grade = "8th Grade",
                        school = "Lindero Canyon Middle School",
                        parentName = "Jane Doe",
                        class_s = "Advanced Math",
                        regStatus = "Open",
                        openSpace = "5"

                    }
                },
                profileData = new[]
                {
                    new
                    {
                        studentId = "001",
                        studentName = "John Doe",
                        program = "Math Circle",
                        class_s = "Advanced Math",
                        grade = "8th Grade",
                        school = "Lindero Canyon Middle School",
                        parentName = "Jane Doe",
                        phoneNumber = "(555) 123-4567",
                        emailAddress = "jane.doe@email.com",
                        eventSession = "Fall 2024",
                        eventLocation = "Agoura Hills"
                    }
                },
                reportCardData = new[]
                {
                    new
                    {
                        studentName = "John Doe",
                        group = "Advanced Math",
                        semester = "Spring 2024",
                        examType = "Final Exam",
                        examDate = "2024-05-19",
                        totalCredit = 100,
                        highestScore = 95,
                        classAverage = 78.5,
                        receivedCredit = 88,
                        comments = "Excellent work!"
                    }
                },
                messages = new[]
                {
                    new
                    {
                        type = "important",
                        title = "YouTube Channel Subscription Required",
                        content = "Agoura Math Circle YouTube channel subscription is required for all students. If you are not subscribed, your application will be declined.",
                        link = "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
                    }
                },
                announcements = new[]
                {
                    new
                    {
                        type = "registration",
                        title = "Fall 2024 Registration",
                        content = "Fall Semester 2024 registration will close on 08/10/2024. Please register ASAP as we have limited slots.",
                        urgent = true
                    }
                }
            };

            return Ok(dashboardData);
        }
    }
}