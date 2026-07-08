using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for report card business logic
    /// </summary>
    public class ReportCardService : IReportCardService
    {
        private readonly IReportCardRepository _reportCardRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public ReportCardService(IReportCardRepository reportCardRepository, IEmailUtility emailUtility, IConfiguration configuration)
        {
            _reportCardRepository = reportCardRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
        }

        /// <summary>
        /// Get report card list
        /// </summary>
        public async Task<ReportCardListResponse> GetReportCardListAsync(ReportCardListRequest request)
        {
            try
            {
                var username = await ResolvePortalUsernameAsync(request.Username);
                var reportCardList = await _reportCardRepository.GetReportCardListAsync(username);
                var rows = ConvertToJsonSafeObject(reportCardList);
                if (rows is List<Dictionary<string, object?>> rowList)
                {
                    rows = SortReportCardListLegacy(rowList);
                }

                return new ReportCardListResponse
                {
                    IsSuccess = true,
                    ReportCardList = rows
                };
            }
            catch (Exception ex)
            {
                return new ReportCardListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get score details for editing
        /// </summary>
        public async Task<GetScoreDetailsResponse> GetScoreDetailsAsync(GetScoreDetailsRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.ReportCardId))
                {
                    return new GetScoreDetailsResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Report Card ID is required"
                    };
                }

                var scoreData = await _reportCardRepository.GetScoreDetailsAsync(request.ReportCardId);

                DataRow row = null;
                if (scoreData is DataSet dataSet && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                {
                    row = dataSet.Tables[0].Rows[0];
                }
                else if (scoreData is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    row = dataTable.Rows[0];
                }

                if (row != null)
                {
                    var scoreDetails = new ScoreDetails
                    {
                        ReportCardId = request.ReportCardId,
                        StudentId = GetString(row, "StudentID"),
                        StudentName = GetString(row, "StudentName"),
                        Group = GetString(row, "Group"),
                        ExamType = GetString(row, "ExamType"),
                        ExamDate = GetString(row, "ExamDate"),
                        TotalCredit = GetString(row, "TotalCredit"),
                        ReceivedCredit = GetString(row, "ReceivedCredit"),
                        Comments = GetString(row, "Comments")
                    };

                    return new GetScoreDetailsResponse
                    {
                        IsSuccess = true,
                        ScoreDetails = scoreDetails
                    };
                }

                return new GetScoreDetailsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "No score details found"
                };
            }
            catch (Exception ex)
            {
                return new GetScoreDetailsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private static string GetString(DataRow row, string columnName)
        {
            if (row?.Table?.Columns == null) return "";
            foreach (DataColumn col in row.Table.Columns)
            {
                if (string.Equals(col.ColumnName, columnName, StringComparison.OrdinalIgnoreCase))
                {
                    var val = row[col.ColumnName];
                    return val == null || val == DBNull.Value ? "" : (val.ToString() ?? "");
                }
            }
            return "";
        }

        /// <summary>
        /// System.Text.Json cannot serialize DataTable (columns expose System.Type). Convert to row dictionaries with camelCase keys.
        /// </summary>
        private static object ConvertToJsonSafeObject(object? value)
        {
            if (value == null)
                return new List<Dictionary<string, object?>>();

            if (value is DataTable dt)
                return ConvertDataTableToRowList(dt);

            if (value is DataSet ds && ds.Tables.Count > 0)
                return ConvertDataTableToRowList(ds.Tables[0]);

            return value;
        }

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
                    dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                }
                list.Add(dict);
            }

            return list;
        }

        /// <summary>
        /// Legacy AMC_spReportCard and kGrid default order: ReportCardID descending (newest first).
        /// </summary>
        private static List<Dictionary<string, object?>> SortReportCardListLegacy(
            List<Dictionary<string, object?>> rows)
        {
            return rows
                .OrderByDescending(GetReportCardIdValue)
                .ToList();
        }

        private static long GetReportCardIdValue(Dictionary<string, object?> row)
        {
            foreach (var pair in row)
            {
                if (!pair.Key.Equals("ReportCardID", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                if (pair.Value == null || pair.Value == DBNull.Value)
                {
                    return 0;
                }

                if (pair.Value is long longValue)
                {
                    return longValue;
                }

                if (pair.Value is int intValue)
                {
                    return intValue;
                }

                if (long.TryParse(
                        Convert.ToString(pair.Value, CultureInfo.InvariantCulture),
                        NumberStyles.Integer,
                        CultureInfo.InvariantCulture,
                        out var parsed))
                {
                    return parsed;
                }
            }

            return 0;
        }

        private async Task<string> ResolvePortalUsernameAsync(string? identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier))
            {
                return string.Empty;
            }

            return await _reportCardRepository.ResolvePortalUsernameAsync(identifier);
        }

        /// <summary>
        /// Delete student score
        /// </summary>
        public async Task<DeleteScoreResponse> DeleteStudentScoreAsync(DeleteScoreRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.ReportCardId))
                {
                    return new DeleteScoreResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Report Card ID is required"
                    };
                }

                await _reportCardRepository.DeleteStudentScoreAsync(request.ReportCardId);

                return new DeleteScoreResponse
                {
                    IsSuccess = true,
                    Message = "Score has been deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new DeleteScoreResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Add student score
        /// </summary>
        public async Task<StudentScoreResponse> AddStudentScoreAsync(AddStudentScoreRequest request)
        {
            try
            {
                NormalizeAddStudentScoreRequest(request);

                if (ExtractStudentId(request.StudentID) <= 0)
                {
                    return new StudentScoreResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "A valid student is required."
                    };
                }

                await _reportCardRepository.AddStudentScoreAsync(request);

                return new StudentScoreResponse
                {
                    IsSuccess = true,
                    Message = "Scores have been updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new StudentScoreResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Update student score
        /// </summary>
        public async Task<StudentScoreResponse> UpdateStudentScoreAsync(UpdateStudentScoreRequest request)
        {
            try
            {
                await _reportCardRepository.UpdateStudentScoreAsync(request);

                return new StudentScoreResponse
                {
                    IsSuccess = true,
                    Message = "Scores have been updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new StudentScoreResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// View report (summary or semester)
        /// </summary>
        public async Task<ViewReportResponse> ViewReportAsync(ViewReportRequest request)
        {
            try
            {
                var username = await ResolvePortalUsernameAsync(request.Username);
                object reportData;

                if (request.IsSemesterReport)
                {
                    reportData = await _reportCardRepository.GetSemesterReportAsync(username, request.Class);
                }
                else
                {
                    reportData = await _reportCardRepository.GetSummaryReportAsync(username, request.ReportDate, request.Class);
                }

                return new ViewReportResponse
                {
                    IsSuccess = true,
                    ReportData = ConvertToJsonSafeObject(reportData)
                };
            }
            catch (Exception ex)
            {
                return new ViewReportResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Send email notification
        /// </summary>
        public async Task<SendEmailResponse> SendEmailAsync(SendEmailRequest request)
        {
            try
            {
                var username = await ResolvePortalUsernameAsync(
                    !string.IsNullOrEmpty(request.Username) ? request.Username : request.From);

                if (string.IsNullOrEmpty(username))
                {
                    return new SendEmailResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Username is required."
                    };
                }

                var classListData = await _reportCardRepository.GetClassListByInstructorAsync(username);

                if (classListData is DataSet dataSet && dataSet.Tables[0].Rows.Count > 0)
                {
                    var studentClassEmail = dataSet.Tables[0].Rows[0]["StudentEmailGroup"].ToString() ?? "";
                    string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                    var subject = "Agoura Math Circle :Student score has been posted.";
                    var body = "We have posted your kid`s score.<br/>"
                        + "<br/><br/> Please login at www.agouramathcircle.org and view your kid's score and instructor Comments. <br/><br/>"
                        + " If you have any question with your kid's score, please contact the instructor via Message center." + "<br/><br/>"
                        + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                    await _emailUtility.SendEmailAsync(studentClassEmail, fromEmail, subject, body);
                }

                return new SendEmailResponse
                {
                    IsSuccess = true,
                    Message = "Email has been sent successfully"
                };
            }
            catch (Exception ex)
            {
                return new SendEmailResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Import scores from Excel
        /// </summary>
        public async Task<ExcelImportResponse> ImportScoresFromExcelAsync(ExcelImportRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Group))
                    throw new InvalidOperationException("Class is required.");
                if (string.IsNullOrWhiteSpace(request.ExamDate))
                    throw new InvalidOperationException("Exam Date is required.");

                var dataTable = ReportCardScoreImportParser.Parse(request.FileContent, request.FileName);

                foreach (DataRow row in dataTable.Rows)
                {
                    var studentId = ReportCardScoreImportParser.GetCellValue(row, "StudentID");
                    if (string.IsNullOrWhiteSpace(studentId))
                        continue;

                    var addScoreRequest = new AddStudentScoreRequest
                    {
                        StudentID = studentId,
                        Group = request.Group,
                        ExamDate = request.ExamDate,
                        QuizTotalScore = request.TotalQuizScore ?? "5",
                        QuizReceivedScore = ReportCardScoreImportParser.GetCellValue(row, "Quiz"),
                        QuizComments = ReportCardScoreImportParser.GetCellValue(row, "Quiz Comments"),
                        ClassTestTotalScore = request.TotalClassTestScore ?? "20",
                        ClassTestReceivedScore = ReportCardScoreImportParser.GetCellValue(row, "ClassWork"),
                        ClassTestComments = ReportCardScoreImportParser.GetCellValue(row, "Class Work Comments"),
                        HomeWorkTotalScore = request.TotalHomeWorkScore ?? "10",
                        HomeWorkReceivedScore = ReportCardScoreImportParser.GetCellValue(row, "HomeWork"),
                        HomeWorkComments = ReportCardScoreImportParser.GetCellValue(row, "Home Work Comments"),
                        FinalExamTotalScore = "0",
                        FinalExamReceivedScore = "",
                        FinalExamComments = "",
                        PlacementTestTotalScore = "0",
                        PlacementTestReceivedScore = "",
                        PlacementTestComments = "",
                    };

                    await _reportCardRepository.AddStudentScoreAsync(addScoreRequest);
                }

                return new ExcelImportResponse
                {
                    IsSuccess = true,
                    Message = "Scores have been uploaded successfully"
                };
            }
            catch (Exception ex)
            {
                return new ExcelImportResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Export data to Excel
        /// </summary>
        public async Task<ExcelExportResponse> ExportToExcelAsync(ExcelExportRequest request)
        {
            try
            {
                var username = await ResolvePortalUsernameAsync(request.Username);
                object data;
                string fileName;

                if (request.IsSummaryReport)
                {
                    // Get summary report data
                    data = await _reportCardRepository.GetSummaryReportAsync(username, "", "");
                    fileName = "SummaryReport";
                }
                else
                {
                    // Get report card list data
                    data = await _reportCardRepository.GetReportCardListAsync(username);
                    fileName = "ReportCardlist";
                }

                if (data is DataTable dataTable)
                {
                    return new ExcelExportResponse
                    {
                        IsSuccess = true,
                        FileName = $"{fileName}.xlsx",
                        FileContent = DataTableExcelExporter.ToXlsxBytes(dataTable, fileName),
                        ContentType = DataTableExcelExporter.XlsxContentType
                    };
                }

                return new ExcelExportResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "No data available for export"
                };
            }
            catch (Exception ex)
            {
                return new ExcelExportResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get report card dashboard data
        /// </summary>
        public async Task<ReportCardDashboardResponse> GetDashboardDataAsync(ReportCardDashboardRequest request)
        {
            try
            {
                var username = await ResolvePortalUsernameAsync(request.Username);

                // Get all dashboard data in parallel
                var reportCardListTask = _reportCardRepository.GetReportCardListAsync(username);
                var studentListTask = _reportCardRepository.GetStudentListAsync(username);
                var classListTask = _reportCardRepository.GetClassListAsync(username);
                var reportDateListTask = _reportCardRepository.GetReportDateListAsync(username);
                var examDateListTask = _reportCardRepository.GetClassScheduleAsync(username, "date");

                await Task.WhenAll(reportCardListTask, studentListTask, classListTask, reportDateListTask, examDateListTask);

                return new ReportCardDashboardResponse
                {
                    IsSuccess = true,
                    ReportCardList = ConvertToJsonSafeObject(await reportCardListTask),
                    StudentList = ConvertToJsonSafeObject(await studentListTask),
                    ClassList = ConvertToJsonSafeObject(await classListTask),
                    ReportDateList = ConvertToJsonSafeObject(await reportDateListTask),
                    ExamDateList = ConvertToJsonSafeObject(await examDateListTask)
                };
            }
            catch (Exception ex)
            {
                return new ReportCardDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Handle score action (Edit, Delete)
        /// </summary>
        public async Task<ScoreActionResponse> HandleScoreActionAsync(ScoreActionRequest request)
        {
            try
            {
                var response = new ScoreActionResponse { IsSuccess = true };

                switch (request.Action.ToUpper())
                {
                    case "E": // Edit
                        var scoreDetails = await GetScoreDetailsAsync(new GetScoreDetailsRequest { ReportCardId = request.ScoreId });
                        if (scoreDetails.IsSuccess)
                        {
                            response.ScoreDetails = scoreDetails.ScoreDetails;
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.ErrorMessage = scoreDetails.ErrorMessage;
                        }
                        break;

                    case "D": // Delete
                        var deleteResult = await DeleteStudentScoreAsync(new DeleteScoreRequest { ReportCardId = request.ScoreId });
                        if (deleteResult.IsSuccess)
                        {
                            response.Message = deleteResult.Message;
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.ErrorMessage = deleteResult.ErrorMessage;
                        }
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
                return new ScoreActionResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Send student report card email
        /// </summary>
        public async Task<SendStudentReportEmailResponse> SendStudentReportEmailAsync(SendStudentReportEmailRequest request)
        {
            try
            {
                var username = await ResolvePortalUsernameAsync(request.Username);
                var summaryReportData = await _reportCardRepository.GetSummaryReportAsync(username, request.ReportDate, "");

                if (summaryReportData is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                    foreach (DataRow row in dataTable.Rows)
                    {
                        var studentName = row["StudentName"].ToString() ?? "";
                        var examDate = row["ExamDate"].ToString() ?? "";
                        var group = row["Group"].ToString() ?? "";
                        var parentEmail = row["ParentEmail"].ToString() ?? "";

                        var emailBody = GenerateStudentReportEmailBody(row);
                        var subject = "Agoura Math Circle - Student Report Card";

                        await _emailUtility.SendEmailAsync(parentEmail, fromEmail, subject, emailBody);
                    }
                }

                return new SendStudentReportEmailResponse
                {
                    IsSuccess = true,
                    Message = "Email has been sent successfully"
                };
            }
            catch (Exception ex)
            {
                return new SendStudentReportEmailResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Generate student report email body (matches legacy SendEmailStudentReport HTML)
        /// </summary>
        private string GenerateStudentReportEmailBody(DataRow row)
        {
            var studentName = row["StudentName"].ToString() ?? "";
            var examDate = row["ExamDate"].ToString() ?? "";
            var group = row["Group"].ToString() ?? "";

            var emailBody = "<style>"
                + "table {color: #333; font-family: Helvetica, Arial, sans-serif;"
                + "font-weight:bold;width: 640px;border-collapse:collapse;"
                + "border-spacing: 0;}"
                + "td, th {border: 1px solid #CCC; height: 30px; }"
                + "th {background: #F3F3F3;font-weight: bold;}"
                + "td {background: #FAFAFA;text-align: center;}"
                + "</style>"
                + "Hello " + studentName
                + ",<br/>" + "<b>Here is your Report Card for " + examDate + "!<br/>"
                + "<table><tr>"
                + "<td colspan=2> Student Report Card - " + examDate + " </td></tr>"
                + "<tr><td> Name :" + studentName + "</td>"
                + "<td> Class :" + group + " </td> "
                + "</tr> </table>"
                + "<br />"
                + "<table >"
                + "<tr>"
                + "<td></td >"
                + "<td> Total </td>"
                + "<td> Received </td>"
                + "<td> Lecture Comments </td>"
                + "</tr>";

            if (GetRowString(row, "QuizTotal") != "0")
            {
                emailBody += "<tr>"
                    + "<td> Quiz </td>"
                    + "<td>" + GetRowString(row, "QuizTotal") + "</td>"
                    + "<td>" + GetRowString(row, "QuizReceived") + "</td>"
                    + "<td>" + GetRowString(row, "QuizComments") + "</td>"
                    + "</tr>";
            }

            if (GetRowString(row, "ClassTotal") != "0")
            {
                emailBody += "<tr>"
                    + "<td> Class Test </td>"
                    + "<td>" + GetRowString(row, "ClassTotal") + " </td>"
                    + "<td>" + GetRowString(row, "ClassReceived") + " </td>"
                    + "<td>" + GetRowString(row, "ClassComments") + " </td>"
                    + "</tr>";
            }

            if (GetRowString(row, "HomeWorkTotal") != "0")
            {
                emailBody += "<tr>"
                    + "<td> Home Work</td>"
                    + "<td>" + GetRowString(row, "HomeWorkTotal") + " </td>"
                    + "<td>" + GetRowString(row, "HomeWorkReceived") + " </td>"
                    + "<td>" + GetRowString(row, "HomeWorkComments") + " </td></tr>";
            }

            if (GetRowString(row, "FinalExamTotal") != "0")
            {
                emailBody += "<tr>"
                    + "<td> Final Exam</td>"
                    + "<td>" + GetRowString(row, "FinalExamTotal") + " </td>"
                    + "<td>" + GetRowString(row, "FinalExamReceived") + " </td>"
                    + "<td>" + GetRowString(row, "FinalExamComments") + " </td></tr>";
            }

            if (GetRowString(row, "PlacementTestTotal") != "0")
            {
                emailBody += "<tr>"
                    + "<td> Placement Test</td>"
                    + "<td>" + GetRowString(row, "PlacementTestTotal") + " </td>"
                    + "<td>" + GetRowString(row, "PlacementTestReceived") + " </td>"
                    + "<td>" + GetRowString(row, "PlacementTestComments") + " </td></tr>";
            }

            emailBody += "</table>"
                + "<br/><br/> Please login at www.agouramathcircle.org and view your score and instructor Comments. <br/><br/>"
                + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

            return emailBody;
        }

        private static string GetRowString(DataRow row, string columnName)
        {
            if (row?.Table?.Columns == null) return "";
            foreach (DataColumn col in row.Table.Columns)
            {
                if (string.Equals(col.ColumnName, columnName, StringComparison.OrdinalIgnoreCase))
                {
                    var val = row[col.ColumnName];
                    return val == null || val == DBNull.Value ? "" : (val.ToString() ?? "");
                }
            }
            return "";
        }

        private static void NormalizeAddStudentScoreRequest(AddStudentScoreRequest request)
        {
            request.StudentID = ExtractStudentId(request.StudentID).ToString(CultureInfo.InvariantCulture);
            request.Group = request.Group?.Trim() ?? string.Empty;
            request.Session = request.Session?.Trim() ?? string.Empty;
            request.QuizTotalScore = NormalizeScoreValue(request.QuizTotalScore, "10");
            request.QuizReceivedScore = NormalizeScoreValue(request.QuizReceivedScore, "0");
            request.ClassTestTotalScore = NormalizeScoreValue(request.ClassTestTotalScore, "10");
            request.ClassTestReceivedScore = NormalizeScoreValue(request.ClassTestReceivedScore, "0");
            request.HomeWorkTotalScore = NormalizeScoreValue(request.HomeWorkTotalScore, "10");
            request.HomeWorkReceivedScore = NormalizeScoreValue(request.HomeWorkReceivedScore, "0");
            request.FinalExamTotalScore = NormalizeScoreValue(request.FinalExamTotalScore, "0");
            request.FinalExamReceivedScore = NormalizeScoreValue(request.FinalExamReceivedScore, "0");
            request.PlacementTestTotalScore = NormalizeScoreValue(request.PlacementTestTotalScore, "0");
            request.PlacementTestReceivedScore = NormalizeScoreValue(request.PlacementTestReceivedScore, "0");
            request.QuizComments = request.QuizComments?.Trim() ?? string.Empty;
            request.ClassTestComments = request.ClassTestComments?.Trim() ?? string.Empty;
            request.HomeWorkComments = request.HomeWorkComments?.Trim() ?? string.Empty;
            request.FinalExamComments = request.FinalExamComments?.Trim() ?? string.Empty;
            request.PlacementTestComments = request.PlacementTestComments?.Trim() ?? string.Empty;
        }

        private static int ExtractStudentId(string? studentId)
        {
            var value = (studentId ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(value))
            {
                return 0;
            }

            var parts = value.Split('~');
            var idPart = parts.Length >= 2 ? parts[1].Trim() : value;
            return int.TryParse(idPart, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed)
                ? parsed
                : 0;
        }

        private static string NormalizeScoreValue(string? value, string defaultValue)
        {
            return string.IsNullOrWhiteSpace(value) ? defaultValue : value.Trim();
        }
    }
}
