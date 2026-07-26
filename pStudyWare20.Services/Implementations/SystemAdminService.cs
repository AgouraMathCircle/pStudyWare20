using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for SystemAdmin dashboard business logic
    /// </summary>
    public class SystemAdminService : ISystemAdminService
    {
        private readonly ISystemAdminRepository _systemAdminRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;
        private readonly IVolunteerAvailabilityService _volunteerAvailabilityService;

        public SystemAdminService(
            ISystemAdminRepository systemAdminRepository,
            IEmailUtility emailUtility,
            IConfiguration configuration,
            IVolunteerAvailabilityService volunteerAvailabilityService)
        {
            _systemAdminRepository = systemAdminRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
            _volunteerAvailabilityService = volunteerAvailabilityService;
        }

        /// <summary>
        /// Get student list for SystemAdmin dashboard
        /// </summary>
        public async Task<SystemAdminStudentListResponse> GetStudentListAsync(SystemAdminStudentListRequest request)
        {
            try
            {
                var studentListData = await _systemAdminRepository.GetStudentListAsync(request.Username, request.Mode);
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

                return new SystemAdminStudentListResponse
                {
                    IsSuccess = true,
                    Students = students
                };
            }
            catch (Exception ex)
            {
                return new SystemAdminStudentListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get user tracking summary for SystemAdmin dashboard
        /// </summary>
        public async Task<UserTrackingSummaryResponse> GetUserTrackingSummaryAsync(UserTrackingSummaryRequest request)
        {
            try
            {
                var trackingSummaryData = await _systemAdminRepository.GetUserTrackingSummaryAsync();
                var trackingData = new List<UserTrackingData>();

                // Convert DataTable to List<UserTrackingData>
                if (trackingSummaryData is DataTable dataTable)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        trackingData.Add(new UserTrackingData
                        {
                            VisitedDate = ParseTrackingDate(row["VisitedDate"]),
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
        /// Get user tracking list (legacy UserTracking.aspx).
        /// </summary>
        public async Task<UserTrackingListResponse> GetUserTrackingListAsync(UserTrackingListRequest request)
        {
            try
            {
                var listData = await _systemAdminRepository.GetUserTrackingListAsync(request.Username);
                var trackingList = new List<UserTrackingListItem>();

                if (listData is DataTable dataTable)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        trackingList.Add(new UserTrackingListItem
                        {
                            RowID = GetIntValue(row, "RowID"),
                            FirstName = GetStringValue(row, "FirstName"),
                            LastName = GetStringValue(row, "LastName"),
                            UserName = GetStringValue(row, "UserName"),
                            UserType = GetStringValue(row, "UserType"),
                            Logindate = GetDateTimeValue(row, "Logindate"),
                            LoginBy = GetStringValue(row, "LoginBy"),
                        });
                    }
                }

                return new UserTrackingListResponse
                {
                    IsSuccess = true,
                    TrackingList = trackingList
                };
            }
            catch (Exception ex)
            {
                return new UserTrackingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get dashboard message with student counts (SystemAdmin)
        /// </summary>
        public async Task<DashboardMessageResponse> GetDashboardMessageAsync(DashboardMessageRequest request)
        {
            try
            {
                var dashboardData = await _systemAdminRepository.GetDashboardMessageAsync(request.Mode, request.Username);

                var studentCounts = new Dictionary<string, int>();
                var waitingListCounts = new Dictionary<string, int>();

                if (dashboardData is DataSet dataSet && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                {
                    MapClassCountsFromTable(dataSet.Tables[0], studentCounts, waitingListCounts);
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
                string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";
                var studentEmailGroup = _configuration["StudentEmailGroup"] ?? "students@agouramathcircle.org";

                if (request.SendEmail)
                {
                    var subject = "Agoura Math Circle : Class Material, Answer Key, Home Work and Class Work Videos published.";
                    var body = "We have published the class material, homework, Quiz, Answerkey and Lecture Notes's videos.<br/>" +
                              "Note:Quiz, Class work and Home work must update before next session." + "<br/><br/>" +
                              "If you have any questions pertaining to the classwork, homework, quiz, or solutions, please send a message from your Message Center, and you will get the response from the instructor within 48 hours. If you have not received a response before 48 hours, then please email support@agouramathcircle.org" + "<br/><br/>" +
                              "Regards <br>Sriya Kalyan <br>CEO, Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                    var emailSent = await _systemAdminRepository.SendEmailNotificationAsync(fromEmail, studentEmailGroup, subject, body);

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
                var studentList = await _systemAdminRepository.GetStudentListForExportAsync(request.Username, request.Mode);

                if (studentList is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = true,
                        FileName = "StudentList.xlsx",
                        FileContent = DataTableExcelExporter.ToXlsxBytes(dataTable, "StudentList"),
                        ContentType = DataTableExcelExporter.XlsxContentType
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
        /// SystemAdmin: volunteers availability list for upcoming class.
        /// </summary>
        public Task<VolunteerAvailabilitySummaryResponse> GetVolunteerAvailabilitySummaryAsync(VolunteerAvailabilitySummaryRequest request)
            => _volunteerAvailabilityService.GetVolunteerAvailabilitySummaryAsync(request);

        /// <summary>
        /// Map enrolled and waiting-list counts by Class code from AMC_spSelectPostMessage.
        /// Post-message rows have no Class; class summary rows do — avoids fragile row-index mapping.
        /// </summary>
        private static void MapClassCountsFromTable(
            DataTable table,
            Dictionary<string, int> studentCounts,
            Dictionary<string, int> waitingListCounts)
        {
            if (!table.Columns.Contains("Class"))
                return;

            foreach (DataRow row in table.Rows)
            {
                var classCode = row["Class"]?.ToString()?.Trim();
                if (string.IsNullOrEmpty(classCode))
                    continue;

                studentCounts[$"onstudentCnt{classCode}"] = GetIntValue(row, "StudentOTotal");
                studentCounts[$"instudentCnt{classCode}"] = GetIntValue(row, "StudentITotal");
                waitingListCounts[$"onwaitingCnt{classCode}"] = GetIntValue(row, "WaitingOTotal");
                waitingListCounts[$"inwaitingCnt{classCode}"] = GetIntValue(row, "WaitingITotal");
            }
        }

        /// <summary>
        /// Helper method to get integer value from DataRow
        /// </summary>
        private static int GetIntValue(DataRow row, string columnName)
        {
            if (row == null || string.IsNullOrEmpty(columnName) || !row.Table.Columns.Contains(columnName))
                return 0;

            if (row[columnName] != DBNull.Value && int.TryParse(row[columnName]?.ToString(), out int value))
                return value;

            return 0;
        }

        private static string GetStringValue(DataRow row, string columnName)
        {
            if (row == null || string.IsNullOrEmpty(columnName) || !row.Table.Columns.Contains(columnName))
                return string.Empty;

            return row[columnName] == DBNull.Value ? string.Empty : row[columnName]?.ToString() ?? string.Empty;
        }

        private static DateTime ParseTrackingDate(object? value)
        {
            if (value == null || value == DBNull.Value)
                return DateTime.MinValue;

            var text = value.ToString()?.Trim() ?? string.Empty;
            if (string.IsNullOrEmpty(text))
                return DateTime.MinValue;

            if (DateTime.TryParse(text, out var parsed))
                return parsed.Date;

            return DateTime.MinValue;
        }

        private static DateTime? GetDateTimeValue(DataRow row, string columnName)
        {
            if (row == null || string.IsNullOrEmpty(columnName) || !row.Table.Columns.Contains(columnName))
                return null;

            if (row[columnName] == DBNull.Value)
                return null;

            return DateTime.TryParse(row[columnName]?.ToString(), out var value) ? value : null;
        }

    }
}
