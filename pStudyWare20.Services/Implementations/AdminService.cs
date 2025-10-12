using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Text;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for admin dashboard business logic
    /// </summary>
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public AdminService(IAdminRepository adminRepository, IEmailUtility emailUtility, IConfiguration configuration)
        {
            _adminRepository = adminRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
        }

        /// <summary>
        /// Get student list for admin dashboard
        /// </summary>
        public async Task<AdminStudentListResponse> GetStudentListAsync(AdminStudentListRequest request)
        {
            try
            {
                var studentList = await _adminRepository.GetStudentListAsync(request.Username, request.Mode);
                
                return new AdminStudentListResponse
                {
                    IsSuccess = true,
                    StudentList = studentList
                };
            }
            catch (Exception ex)
            {
                return new AdminStudentListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get user tracking summary for admin dashboard
        /// </summary>
        public async Task<UserTrackingSummaryResponse> GetUserTrackingSummaryAsync(UserTrackingSummaryRequest request)
        {
            try
            {
                var trackingSummary = await _adminRepository.GetUserTrackingSummaryAsync();
                
                return new UserTrackingSummaryResponse
                {
                    IsSuccess = true,
                    TrackingSummary = trackingSummary
                };
            }
            catch (Exception ex)
            {
                return new UserTrackingSummaryResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get dashboard message with student counts
        /// </summary>
        public async Task<DashboardMessageResponse> GetDashboardMessageAsync(DashboardMessageRequest request)
        {
            try
            {
                var dashboardData = await _adminRepository.GetDashboardMessageAsync(request.Mode, request.Username);
                
                var studentCounts = new StudentCounts();
                
                if (dashboardData is DataSet dataSet && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                {
                    var table = dataSet.Tables[0];
                    
                    // Map the data from the stored procedure result to StudentCounts
                    // Based on the original code, the data is accessed by row index
                    if (table.Rows.Count > 13)
                    {
                        // Online Student Counts
                        studentCounts.OnlineStudentCountJA = GetIntValue(table.Rows[7], "StudentOTotal");
                        studentCounts.OnlineStudentCountJB = GetIntValue(table.Rows[8], "StudentOTotal");
                        studentCounts.OnlineStudentCountJI = GetIntValue(table.Rows[9], "StudentOTotal");
                        studentCounts.OnlineStudentCountSA = GetIntValue(table.Rows[10], "StudentOTotal");
                        studentCounts.OnlineStudentCountSB = GetIntValue(table.Rows[11], "StudentOTotal");
                        studentCounts.OnlineStudentCountSI = GetIntValue(table.Rows[12], "StudentOTotal");
                        studentCounts.OnlineStudentCountAI = GetIntValue(table.Rows[4], "StudentOTotal");
                        studentCounts.OnlineStudentCountAT = GetIntValue(table.Rows[5], "StudentOTotal");
                        studentCounts.OnlineStudentCountDS = GetIntValue(table.Rows[6], "StudentOTotal");
                        studentCounts.OnlineStudentCountST = GetIntValue(table.Rows[13], "StudentOTotal");

                        // In-Person Student Counts
                        studentCounts.InPersonStudentCountJA = GetIntValue(table.Rows[7], "StudentITotal");
                        studentCounts.InPersonStudentCountJB = GetIntValue(table.Rows[8], "StudentITotal");
                        studentCounts.InPersonStudentCountJI = GetIntValue(table.Rows[9], "StudentITotal");
                        studentCounts.InPersonStudentCountSA = GetIntValue(table.Rows[10], "StudentITotal");
                        studentCounts.InPersonStudentCountSB = GetIntValue(table.Rows[11], "StudentITotal");
                        studentCounts.InPersonStudentCountSI = GetIntValue(table.Rows[12], "StudentITotal");

                        // Online Waiting List Counts
                        studentCounts.OnlineWaitingListCountAI = GetIntValue(table.Rows[4], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountAT = GetIntValue(table.Rows[5], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountJA = GetIntValue(table.Rows[7], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountJB = GetIntValue(table.Rows[8], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountJI = GetIntValue(table.Rows[9], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountSA = GetIntValue(table.Rows[10], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountSB = GetIntValue(table.Rows[11], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountSI = GetIntValue(table.Rows[12], "WaitingOTotal");
                        studentCounts.OnlineWaitingListCountST = GetIntValue(table.Rows[13], "WaitingOTotal");

                        // In-Person Waiting List Counts
                        studentCounts.InPersonWaitingListCountAI = GetIntValue(table.Rows[4], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountAT = GetIntValue(table.Rows[5], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountJA = GetIntValue(table.Rows[7], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountJB = GetIntValue(table.Rows[8], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountJI = GetIntValue(table.Rows[9], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountSA = GetIntValue(table.Rows[10], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountSB = GetIntValue(table.Rows[11], "WaitingITotal");
                        studentCounts.InPersonWaitingListCountSI = GetIntValue(table.Rows[12], "WaitingITotal");
                    }
                }
                
                return new DashboardMessageResponse
                {
                    IsSuccess = true,
                    StudentCounts = studentCounts
                };
            }
            catch (Exception ex)
            {
                return new DashboardMessageResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Publish documents and send email notification
        /// </summary>
        public async Task<PublishDocumentResponse> PublishDocumentAsync(PublishDocumentRequest request)
        {
            try
            {
                var adminEmail = _configuration["AdminEmailID"] ?? "admin@agouramathcircle.org";
                var studentEmailGroup = _configuration["StudentEmailGroup"] ?? "students@agouramathcircle.org";

                if (request.SendEmail)
                {
                    var subject = "Agoura Math Circle : Class Material, Answer Key, Home Work and Class Work Videos published.";
                    var body = "We have published the class material, homework, Quiz, Answerkey and Lecture Notes's videos.<br/>" +
                              "Note:Quiz, Class work and Home work must update before next session." + "<br/><br/>" +
                              "If you have any questions pertaining to the classwork, homework, quiz, or solutions, please send a message from your Message Center, and you will get the response from the instructor within 48 hours. If you have not received a response before 48 hours, then please email support@agouramathcircle.org" + "<br/><br/>" +
                              "Regards <br>Sriya Kalyan <br>CEO, Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                    var emailSent = await _adminRepository.SendEmailNotificationAsync(adminEmail, studentEmailGroup, subject, body);
                    
                    if (!emailSent)
                    {
                        return new PublishDocumentResponse
                        {
                            IsSuccess = false,
                            ErrorMessage = "Failed to send email notification"
                        };
                    }
                }

                return new PublishDocumentResponse
                {
                    IsSuccess = true,
                    Message = "You have published the documents successfully"
                };
            }
            catch (Exception ex)
            {
                return new PublishDocumentResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Export student list to Excel
        /// </summary>
        public async Task<ExportExcelResponse> ExportStudentListToExcelAsync(ExportExcelRequest request)
        {
            try
            {
                var studentList = await _adminRepository.GetStudentListForExportAsync(request.Username, request.Mode);
                
                if (studentList is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    // Convert DataTable to Excel format (simplified version)
                    var excelContent = ConvertDataTableToExcel(dataTable);
                    
                    return new ExportExcelResponse
                    {
                        IsSuccess = true,
                        FileName = "StudentList.xls",
                        FileContent = excelContent,
                        ContentType = "application/octet-stream"
                    };
                }
                
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "No data available for export"
                };
            }
            catch (Exception ex)
            {
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Helper method to get integer value from DataRow
        /// </summary>
        private int GetIntValue(DataRow row, string columnName)
        {
            if (row[columnName] != DBNull.Value && int.TryParse(row[columnName].ToString(), out int value))
            {
                return value;
            }
            return 0;
        }

        /// <summary>
        /// Convert DataTable to Excel format (simplified version)
        /// </summary>
        private byte[] ConvertDataTableToExcel(DataTable dataTable)
        {
            var sb = new StringBuilder();
            
            // Add headers
            for (int i = 0; i < dataTable.Columns.Count; i++)
            {
                sb.Append(dataTable.Columns[i].ColumnName);
                if (i < dataTable.Columns.Count - 1)
                    sb.Append("\t");
            }
            sb.AppendLine();
            
            // Add data rows
            foreach (DataRow row in dataTable.Rows)
            {
                for (int i = 0; i < dataTable.Columns.Count; i++)
                {
                    sb.Append(row[i].ToString());
                    if (i < dataTable.Columns.Count - 1)
                        sb.Append("\t");
                }
                sb.AppendLine();
            }
            
            return Encoding.UTF8.GetBytes(sb.ToString());
        }
    }
}
