using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for registered student list business logic
    /// </summary>
    public class RegisteredStudentListService : IRegisteredStudentListService
    {
        private readonly IRegisteredStudentListRepository _registeredStudentListRepository;
        private readonly IConfiguration _configuration;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public RegisteredStudentListService(
            IRegisteredStudentListRepository registeredStudentListRepository,
            IConfiguration configuration,
            IServiceScopeFactory serviceScopeFactory)
        {
            _registeredStudentListRepository = registeredStudentListRepository;
            _configuration = configuration;
            _serviceScopeFactory = serviceScopeFactory;
        }

        /// <summary>
        /// Get registered student list
        /// </summary>
        public async Task<RegisteredStudentListResponse> GetRegisteredStudentListAsync(RegisteredStudentListRequest request)
        {
            try
            {
                var studentList = await _registeredStudentListRepository.GetRegisteredStudentListAsync(request.Username, request.Mode);

                return new RegisteredStudentListResponse
                {
                    IsSuccess = true,
                    StudentList = studentList is DataTable dt ? ConvertDataTableToRowList(dt) : studentList
                };
            }
            catch (Exception ex)
            {
                return new RegisteredStudentListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Update student class information
        /// </summary>
        public async Task<UpdateStudentClassResponse> UpdateStudentClassAsync(UpdateStudentClassRequest request)
        {
            try
            {
                if (!int.TryParse(request.StudentId, out var studentId) || studentId <= 0)
                {
                    return new UpdateStudentClassResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid student ID."
                    };
                }

                if (!int.TryParse(request.ChapterId, out var chapterId) || chapterId <= 0)
                {
                    return new UpdateStudentClassResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid chapter."
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Class)
                    || string.IsNullOrWhiteSpace(request.Section)
                    || string.IsNullOrWhiteSpace(request.Location)
                    || string.IsNullOrWhiteSpace(request.Session))
                {
                    return new UpdateStudentClassResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Class, section, location, and session are required."
                    };
                }

                var classCode = NormalizeClassCode(request.Class);
                var section = request.Section.Trim().ToUpperInvariant();
                var location = request.Location.Trim().ToUpperInvariant();
                var session = NormalizeSessionCode(request.Session);

                if (string.IsNullOrEmpty(classCode))
                {
                    return new UpdateStudentClassResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid class selected."
                    };
                }

                if (location is not ("O" or "I"))
                {
                    return new UpdateStudentClassResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Location must be OnSite or Internet."
                    };
                }

                if (section is not ("A" or "B"))
                {
                    return new UpdateStudentClassResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Section must be A or B."
                    };
                }

                await _registeredStudentListRepository.UpdateStudentClassAsync(
                    request.StudentId,
                    classCode,
                    section,
                    request.ChapterId.Trim(),
                    location,
                    session
                );

                var classLabel = !string.IsNullOrWhiteSpace(request.ClassLabel)
                    ? request.ClassLabel
                    : GetClassDisplayLabel(classCode);
                var chapterName = !string.IsNullOrWhiteSpace(request.ChapterName)
                    ? request.ChapterName
                    : request.ChapterId;
                var locationLabel = !string.IsNullOrWhiteSpace(request.LocationLabel)
                    ? request.LocationLabel
                    : GetLocationDisplayLabel(location);

                var adminEmail = _configuration.GetSection("AppSettings")["AdminEmailID"]
                    ?? _configuration["AdminEmailID"]
                    ?? "admin@agouramathcircle.org";
                var subject = "Agoura Math Circle: Your child records has been updated.";

                var emailBody = "We have updated your kid's class information based on your request."
                    + " Here is the information on your new class: " + "<br/>"
                    + " Student Name: " + request.FirstName + " " + request.LastName + "<br/>"
                    + " Class: " + classLabel + "<br/>"
                    + " Section: " + section + "<br/>"
                    + " Location: " + chapterName + "-" + locationLabel + "<br/><br/>"
                    + " If you have any questions with your kid's class/location change, please send a message to us via Message Center." + "<br/><br/>"
                    + " Regards <br> Agoura Math Circle team<b/> <br/>www.agouramathcircle.org";

                if (!string.IsNullOrWhiteSpace(request.Email))
                {
                    QueueClassUpdateEmailNotification(request.Email, adminEmail, subject, emailBody);
                }

                return new UpdateStudentClassResponse
                {
                    IsSuccess = true,
                    Message = "You have updated the class/location successfully"
                };
            }
            catch (Exception ex)
            {
                return new UpdateStudentClassResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private static string GetClassDisplayLabel(string classCode)
        {
            return (classCode ?? string.Empty).Trim().ToUpperInvariant() switch
            {
                "JB" => "Junior Beginner",
                "JI" => "Junior Intermediate",
                "JA" => "Junior Advanced",
                "SB" => "Senior Beginner",
                "SI" => "Senior Intermediate",
                "SA" => "Senior Advanced",
                "DS" => "Data Science",
                "AI" => "Artificial Intelligence",
                "GD" => "Game Development",
                "AD" => "App Development",
                "DM" => "Data Management",
                "ST" => "SAT/PSAT",
                "AT" => "ACT",
                _ => classCode ?? string.Empty
            };
        }

        private static string GetLocationDisplayLabel(string locationCode)
        {
            return (locationCode ?? string.Empty).Trim().ToUpperInvariant() switch
            {
                "I" => "Internet",
                _ => "OnSite"
            };
        }

        private static string NormalizeClassCode(string? classValue)
        {
            var value = (classValue ?? string.Empty).Trim().ToUpperInvariant();
            if (value.Length == 2)
            {
                return value;
            }

            return value switch
            {
                "JUNIOR BEGINNER" or "JB" => "JB",
                "JUNIOR INTERMEDIATE" or "JI" => "JI",
                "JUNIOR ADVANCED" or "JA" => "JA",
                "SENIOR BEGINNER" or "SB" => "SB",
                "SENIOR INTERMEDIATE" or "SI" => "SI",
                "SENIOR ADVANCED" or "SA" => "SA",
                "DATA SCIENCE" or "DS" => "DS",
                "ARTIFICIAL INTELLIGENCE" or "AI" => "AI",
                "GAME DEVELOPMENT" or "GD" => "GD",
                "APP DEVELOPMENT" or "AD" => "AD",
                "DATA MANAGEMENT" or "DM" => "DM",
                "SAT/PSAT" or "PSAT/SAT" or "ST" => "ST",
                "ACT" or "AT" => "AT",
                _ => value.Length > 2 ? value[..2] : value
            };
        }

        private static string NormalizeSessionCode(string? sessionValue)
        {
            var value = (sessionValue ?? string.Empty).Trim();
            return value.Length <= 5 ? value : value[..5];
        }

        /// <summary>
        /// Legacy btnSubmit_Click sends email after DB update; do not block the API on SMTP.
        /// </summary>
        private void QueueClassUpdateEmailNotification(
            string recipientEmail,
            string adminEmail,
            string subject,
            string emailBody)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var emailUtility = scope.ServiceProvider.GetRequiredService<IEmailUtility>();
                    await emailUtility.SendEmailAsync(recipientEmail, adminEmail, subject, emailBody);
                }
                catch
                {
                    // Email failure must not affect a successful class update.
                }
            });
        }

        /// <summary>
        /// Delete student registration
        /// </summary>
        public async Task<DeleteStudentResponse> DeleteStudentAsync(DeleteStudentRequest request)
        {
            try
            {
                await _registeredStudentListRepository.DeleteStudentAsync(request.StudentId);

                return new DeleteStudentResponse
                {
                    IsSuccess = true,
                    Message = "You have deleted the student successfully"
                };
            }
            catch (Exception ex)
            {
                return new DeleteStudentResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get student details for update
        /// </summary>
        public async Task<GetStudentForUpdateResponse> GetStudentForUpdateAsync(GetStudentForUpdateRequest request)
        {
            try
            {
                var studentDetails = new GetStudentForUpdateRequest
                {
                    StudentId = request.StudentId,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Class = request.Class,
                    Section = request.Section,
                    ChapterId = request.ChapterId,
                    Location = request.Location,
                    Semester = request.Semester,
                    Email = request.Email
                };

                return new GetStudentForUpdateResponse
                {
                    IsSuccess = true,
                    StudentDetails = studentDetails
                };
            }
            catch (Exception ex)
            {
                return new GetStudentForUpdateResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get chapter locations
        /// </summary>
        public async Task<ChapterLocationResponse> GetChapterLocationsAsync(GetChapterLocationRequest request)
        {
            try
            {
                var chapterLocations = await _registeredStudentListRepository.GetChapterLocationsAsync(request.Mode);

                return new ChapterLocationResponse
                {
                    IsSuccess = true,
                    ChapterLocations = MapDataTableToChapterLocations(chapterLocations as DataTable)
                };
            }
            catch (Exception ex)
            {
                return new ChapterLocationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Export student list to Excel
        /// </summary>
        public async Task<ExportStudentListExcelResponse> ExportStudentListToExcelAsync(ExportStudentListExcelRequest request)
        {
            try
            {
                var studentList = await _registeredStudentListRepository.GetStudentListForExportAsync(request.Username, request.Mode);

                if (studentList is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    return new ExportStudentListExcelResponse
                    {
                        IsSuccess = true,
                        FileName = "StudentList.xlsx",
                        FileContent = DataTableExcelExporter.ToXlsxBytes(dataTable, "StudentList"),
                        ContentType = DataTableExcelExporter.XlsxContentType
                    };
                }

                return new ExportStudentListExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "No data available for export"
                };
            }
            catch (Exception ex)
            {
                return new ExportStudentListExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get registered student list dashboard data
        /// </summary>
        public async Task<RegisteredStudentListDashboardResponse> GetDashboardDataAsync(RegisteredStudentListDashboardRequest request)
        {
            try
            {
                // Get student list and chapter locations in parallel
                var studentListTask = _registeredStudentListRepository.GetRegisteredStudentListAsync(request.Username, "");
                var chapterLocationsTask = _registeredStudentListRepository.GetChapterLocationsAsync("N");
                var sessionOptionsTask = _registeredStudentListRepository.GetActiveSessionOptionsAsync();

                await Task.WhenAll(studentListTask, chapterLocationsTask, sessionOptionsTask);

                var studentTable = await studentListTask as DataTable;
                var chapterTable = await chapterLocationsTask as DataTable;
                var sessionOptions = await sessionOptionsTask;

                return new RegisteredStudentListDashboardResponse
                {
                    IsSuccess = true,
                    StudentList = studentTable != null ? ConvertDataTableToRowList(studentTable) : new List<Dictionary<string, object?>>(),
                    ChapterLocations = MapDataTableToChapterLocations(chapterTable),
                    SessionOptions = sessionOptions
                };
            }
            catch (Exception ex)
            {
                return new RegisteredStudentListDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Handle student action (Edit, Delete)
        /// </summary>
        public async Task<StudentActionResponse> HandleStudentActionAsync(StudentActionRequest request)
        {
            try
            {
                var response = new StudentActionResponse { IsSuccess = true };

                switch (request.Action.ToUpper())
                {
                    case "E": // Edit
                        var studentDetails = new GetStudentForUpdateRequest
                        {
                            StudentId = request.StudentId,
                            FirstName = request.FirstName,
                            LastName = request.LastName,
                            Class = request.Class,
                            Section = request.Section,
                            ChapterId = request.ChapterId,
                            Location = request.Location,
                            Semester = request.Semester,
                            Email = request.Email
                        };
                        response.StudentDetails = studentDetails;
                        break;

                    case "D": // Delete
                        await _registeredStudentListRepository.DeleteStudentAsync(request.StudentId);
                        response.Message = "You have deleted the student successfully";
                        break;

                    default:
                        response.IsSuccess = false;
                        response.ErrorMessage = "Invalid action specified";
                        break;
                }

                return response;
            }
            catch (Exception ex)
            {
                return new StudentActionResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Serializes AMC_spSelectStudentList (and similar) results for JSON — System.Text.Json does not serialize DataTable usefully.
        /// </summary>
        private static List<Dictionary<string, object?>> ConvertDataTableToRowList(DataTable? table)
        {
            var list = new List<Dictionary<string, object?>>();
            if (table == null || table.Rows.Count == 0)
                return list;

            foreach (DataRow row in table.Rows)
            {
                var dict = new Dictionary<string, object?>();
                foreach (DataColumn col in table.Columns)
                {
                    var key = ToCamelCaseColumnName(col.ColumnName);
                    dict[key] = row[col] == DBNull.Value ? null : row[col];
                }
                list.Add(dict);
            }

            return list;
        }

        private static string ToCamelCaseColumnName(string name)
        {
            if (string.IsNullOrEmpty(name))
                return name;
            if (name.Length == 1)
                return name.ToLowerInvariant();
            return char.ToLowerInvariant(name[0]) + name.Substring(1);
        }

        /// <summary>
        /// Maps AMC_spSelectChapter result to ChapterLocation (same shape as legacy BindChapterLocation).
        /// </summary>
        private static List<ChapterLocation> MapDataTableToChapterLocations(DataTable? table)
        {
            var chapterLocations = new List<ChapterLocation>();
            if (table == null || table.Rows.Count == 0)
                return chapterLocations;

            foreach (DataRow row in table.Rows)
            {
                chapterLocations.Add(new ChapterLocation
                {
                    ChapterID = row.Table.Columns.Contains("ChapterID") ? row["ChapterID"]?.ToString() ?? "" : "",
                    ChapterName = row.Table.Columns.Contains("ChapterName") ? row["ChapterName"]?.ToString() ?? "" : "",
                    Location = row.Table.Columns.Contains("Location") ? row["Location"]?.ToString() ?? "" : ""
                });
            }

            return chapterLocations;
        }
    }
}
