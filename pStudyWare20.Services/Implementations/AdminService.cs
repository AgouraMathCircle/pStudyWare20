using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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
        private readonly IVolunteerAvailabilityService _volunteerAvailabilityService;

        public AdminService(
            IAdminRepository adminRepository,
            IEmailUtility emailUtility,
            IConfiguration configuration,
            IVolunteerAvailabilityService volunteerAvailabilityService)
        {
            _adminRepository = adminRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
            _volunteerAvailabilityService = volunteerAvailabilityService;
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
        /// Get user tracking list (legacy UserTracking.aspx).
        /// </summary>
        public async Task<UserTrackingListResponse> GetUserTrackingListAsync(UserTrackingListRequest request)
        {
            try
            {
                var listData = await _adminRepository.GetUserTrackingListAsync(request.Username);
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

                    var emailSent = await _adminRepository.SendEmailNotificationAsync(fromEmail, studentEmailGroup, subject, body);

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
        /// Export student list to Excel — columns match Current Session Student List UI.
        /// </summary>
        public async Task<ExportExcelResponse> ExportStudentListToExcelAsync(ExportExcelRequest request)
        {
            try
            {
                var studentList = await _adminRepository.GetStudentListForExportAsync(request.Username, request.Mode);

                if (studentList is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    var exportTable = BuildCurrentSessionStudentListExportTable(dataTable);
                    return new ExportExcelResponse
                    {
                        IsSuccess = true,
                        FileName = "StudentList.xlsx",
                        FileContent = DataTableExcelExporter.ToXlsxBytes(exportTable, "StudentList"),
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
        /// Project SP result to the same columns/order/labels as Admin StudentList UI:
        /// Student #, Student Name, Class, Session, Location.
        /// </summary>
        private static DataTable BuildCurrentSessionStudentListExportTable(DataTable source)
        {
            var export = new DataTable();
            export.Columns.Add("Student #", typeof(string));
            export.Columns.Add("Student Name", typeof(string));
            export.Columns.Add("Class", typeof(string));
            export.Columns.Add("Session", typeof(string));
            export.Columns.Add("Location", typeof(string));

            foreach (DataRow row in source.Rows)
            {
                export.Rows.Add(
                    GetStringValue(row, "StudentID"),
                    GetStringValue(row, "StudentName"),
                    GetStringValue(row, "Class"),
                    GetStringValue(row, "EventSession"),
                    GetStringValue(row, "EventLocation")
                );
            }

            return export;
        }

        /// <summary>
        /// Chapter Admin: update volunteer availability for the signed-in admin.
        /// </summary>
        public Task<VolunteerAvailabilityResponse> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request)
            => _volunteerAvailabilityService.UpdateVolunteerAvailabilityAsync(request);

        /// <summary>
        /// Chapter Admin: get volunteer availability for the signed-in admin.
        /// </summary>
        public Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request)
            => _volunteerAvailabilityService.GetVolunteerAvailabilityAsync(request);

        /// <summary>
        /// Chapter Admin: form context (target session + prompt) for volunteer availability entry.
        /// </summary>
        public Task<VolunteerAvailabilityFormContextResponse> GetVolunteerAvailabilityFormContextAsync(string chapterId)
            => _volunteerAvailabilityService.GetVolunteerAvailabilityFormContextAsync(chapterId);

        /// <summary>
        /// Chapter Admin: volunteers availability list for upcoming class (authorized chapters).
        /// </summary>
        public Task<VolunteerAvailabilitySummaryResponse> GetVolunteerAvailabilitySummaryAsync(VolunteerAvailabilitySummaryRequest request)
            => _volunteerAvailabilityService.GetVolunteerAvailabilitySummaryAsync(request);

        /// <summary>
        /// Helper method to get integer value from DataRow
        /// </summary>
        private int GetIntValue(DataRow row, string columnName)
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
