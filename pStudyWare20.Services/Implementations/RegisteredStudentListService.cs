using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Text;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for registered student list business logic
    /// </summary>
    public class RegisteredStudentListService : IRegisteredStudentListService
    {
        private readonly IRegisteredStudentListRepository _registeredStudentListRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public RegisteredStudentListService(IRegisteredStudentListRepository registeredStudentListRepository, IEmailUtility emailUtility, IConfiguration configuration)
        {
            _registeredStudentListRepository = registeredStudentListRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
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
                // Update student class in database
                await _registeredStudentListRepository.UpdateStudentClassAsync(
                    request.StudentId,
                    request.Class,
                    request.Section,
                    request.ChapterId,
                    request.Location,
                    request.Session
                );

                // Send email notification
                var adminEmail = _configuration["AdminEmailID"] ?? "admin@agouramathcircle.org";
                var subject = "Agoura Math Circle: Your child records has been updated.";

                var emailBody = "We have updated your kid's class information based on your request."
                    + " Here is the information on your new class: " + "<br/>"
                    + " Student Name: " + request.FirstName + " " + request.LastName + "<br/>"
                    + " Class: " + request.Class + "<br/>"
                    + " Section: " + request.Section + "<br/>"
                    + " Location: " + request.ChapterId + "-" + request.Location + "<br/><br/>"
                    + " If you have any questions with your kid's class/location change, please send a message to us via Message Center." + "<br/><br/>"
                    + " Regards <br> Agoura Math Circle team<br/> <br/>www.agouramathcircle.org";

                // Determine BCC email based on section
                var emailBcc = "";
                if (request.Section == "3")
                {
                    emailBcc = "support.ic@agouramathcircle.org";
                }

                // Send email
                await _emailUtility.SendEmailAsync(request.Email, adminEmail, subject, emailBody);

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
                    var excelContent = ConvertDataTableToExcel(dataTable);

                    return new ExportStudentListExcelResponse
                    {
                        IsSuccess = true,
                        FileName = "StudentList.xls",
                        FileContent = excelContent,
                        ContentType = "application/octet-stream"
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

                await Task.WhenAll(studentListTask, chapterLocationsTask);

                var studentTable = await studentListTask as DataTable;
                var chapterTable = await chapterLocationsTask as DataTable;

                return new RegisteredStudentListDashboardResponse
                {
                    IsSuccess = true,
                    StudentList = studentTable != null ? ConvertDataTableToRowList(studentTable) : new List<Dictionary<string, object?>>(),
                    ChapterLocations = MapDataTableToChapterLocations(chapterTable)
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
