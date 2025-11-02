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
                var studentListData = await _adminRepository.GetStudentListAsync(request.Username, request.Mode);
                var students = new List<StudentInfo>();

                // Convert DataTable to List<StudentInfo>
                if (studentListData is DataTable dataTable)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        students.Add(new StudentInfo
                        {
                            StudentID = GetIntValue(row, "StudentID"),
                            StudentName = row["StudentName"]?.ToString() ?? "",
                            Class = row["Class"]?.ToString() ?? "",
                            Grade = row["Grade"]?.ToString() ?? "",
                            School = row["School"]?.ToString() ?? "",
                            ParentName = row["ParentName"]?.ToString() ?? "",
                            PhoneNumber = row["PhoneNumber"]?.ToString() ?? "",
                            EmailAddress = row["EmailAddress"]?.ToString() ?? "",
                            EventSession = row["EventSession"]?.ToString() ?? "",
                            EventLocation = row["EventLocation"]?.ToString() ?? ""
                        });
                    }
                }

                return new AdminStudentListResponse
                {
                    IsSuccess = true,
                    Students = students
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
                var trackingSummaryData = await _adminRepository.GetUserTrackingSummaryAsync();
                var trackingData = new List<UserTrackingData>();

                // Convert DataTable to List<UserTrackingData>
                if (trackingSummaryData is DataTable dataTable)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        trackingData.Add(new UserTrackingData
                        {
                            VisitedDate = row["VisitedDate"] != DBNull.Value ? Convert.ToDateTime(row["VisitedDate"]) : DateTime.MinValue,
                            WebCount = GetIntValue(row, "WebCount"),
                            AppCount = GetIntValue(row, "AppCount"),
                            UpdateScoreCnt = GetIntValue(row, "UpdateScoreCnt")
                        });
                    }
                }

                return new UserTrackingSummaryResponse
                {
                    IsSuccess = true,
                    TrackingData = trackingData
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

                var studentCounts = new Dictionary<string, int>();
                var waitingListCounts = new Dictionary<string, int>();

                if (dashboardData is DataSet dataSet && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                {
                    var table = dataSet.Tables[0];

                    // Map the data from the stored procedure result
                    // Based on the original code, the data is accessed by row index
                    if (table.Rows.Count > 13)
                    {
                        // OnSite Student Counts (matching frontend keys)
                        studentCounts["onstudentCntJA"] = GetIntValue(table.Rows[7], "StudentOTotal");
                        studentCounts["onstudentCntJB"] = GetIntValue(table.Rows[8], "StudentOTotal");
                        studentCounts["onstudentCntJI"] = GetIntValue(table.Rows[9], "StudentOTotal");
                        studentCounts["onstudentCntSA"] = GetIntValue(table.Rows[10], "StudentOTotal");
                        studentCounts["onstudentCntSB"] = GetIntValue(table.Rows[11], "StudentOTotal");
                        studentCounts["onstudentCntSI"] = GetIntValue(table.Rows[12], "StudentOTotal");
                        studentCounts["onstudentCntAI"] = GetIntValue(table.Rows[4], "StudentOTotal");
                        studentCounts["onstudentCntAT"] = GetIntValue(table.Rows[5], "StudentOTotal");
                        studentCounts["onstudentCntDS"] = GetIntValue(table.Rows[6], "StudentOTotal");
                        studentCounts["onstudentCntST"] = GetIntValue(table.Rows[13], "StudentOTotal");

                        // Online Student Counts (matching frontend keys)
                        studentCounts["instudentCntJA"] = GetIntValue(table.Rows[7], "StudentITotal");
                        studentCounts["instudentCntJB"] = GetIntValue(table.Rows[8], "StudentITotal");
                        studentCounts["instudentCntJI"] = GetIntValue(table.Rows[9], "StudentITotal");
                        studentCounts["instudentCntSA"] = GetIntValue(table.Rows[10], "StudentITotal");
                        studentCounts["instudentCntSB"] = GetIntValue(table.Rows[11], "StudentITotal");
                        studentCounts["instudentCntSI"] = GetIntValue(table.Rows[12], "StudentITotal");
                        studentCounts["instudentCntAI"] = GetIntValue(table.Rows[4], "StudentITotal");
                        studentCounts["instudentCntAT"] = GetIntValue(table.Rows[5], "StudentITotal");
                        studentCounts["instudentCntDS"] = GetIntValue(table.Rows[6], "StudentITotal");
                        studentCounts["instudentCntST"] = GetIntValue(table.Rows[13], "StudentITotal");

                        // OnSite Waiting List Counts (matching frontend keys)
                        waitingListCounts["owaitingListCntAI"] = GetIntValue(table.Rows[4], "WaitingOTotal");
                        waitingListCounts["owaitingListCntAT"] = GetIntValue(table.Rows[5], "WaitingOTotal");
                        waitingListCounts["owaitingListCntJA"] = GetIntValue(table.Rows[7], "WaitingOTotal");
                        waitingListCounts["owaitingListCntJB"] = GetIntValue(table.Rows[8], "WaitingOTotal");
                        waitingListCounts["owaitingListCntJI"] = GetIntValue(table.Rows[9], "WaitingOTotal");
                        waitingListCounts["owaitingListCntSA"] = GetIntValue(table.Rows[10], "WaitingOTotal");
                        waitingListCounts["owaitingListCntSB"] = GetIntValue(table.Rows[11], "WaitingOTotal");
                        waitingListCounts["owaitingListCntSI"] = GetIntValue(table.Rows[12], "WaitingOTotal");
                        waitingListCounts["owaitingListCntST"] = GetIntValue(table.Rows[13], "WaitingOTotal");
                        waitingListCounts["owaitingListCntDS"] = GetIntValue(table.Rows[6], "WaitingOTotal");

                        // Online Waiting List Counts (matching frontend keys)
                        waitingListCounts["iwaitingListCntAI"] = GetIntValue(table.Rows[4], "WaitingITotal");
                        waitingListCounts["iwaitingListCntAC"] = GetIntValue(table.Rows[5], "WaitingITotal"); // Note: AC instead of AT
                        waitingListCounts["iwaitingListCntJA"] = GetIntValue(table.Rows[7], "WaitingITotal");
                        waitingListCounts["iwaitingListCntJB"] = GetIntValue(table.Rows[8], "WaitingITotal");
                        waitingListCounts["iwaitingListCntJI"] = GetIntValue(table.Rows[9], "WaitingITotal");
                        waitingListCounts["iwaitingListCntSA"] = GetIntValue(table.Rows[10], "WaitingITotal");
                        waitingListCounts["iwaitingListCntSB"] = GetIntValue(table.Rows[11], "WaitingITotal");
                        waitingListCounts["iwaitingListCntSI"] = GetIntValue(table.Rows[12], "WaitingITotal");
                        waitingListCounts["iwaitingListCntST"] = GetIntValue(table.Rows[13], "WaitingITotal");
                        waitingListCounts["iwaitingListCntDS"] = GetIntValue(table.Rows[6], "WaitingITotal");
                    }
                }

                return new DashboardMessageResponse
                {
                    IsSuccess = true,
                    Message = "",
                    StudentCounts = studentCounts,
                    WaitingListCounts = waitingListCounts
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
