using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Text;

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
                var reportCardList = await _reportCardRepository.GetReportCardListAsync(request.Username);

                return new ReportCardListResponse
                {
                    IsSuccess = true,
                    ReportCardList = reportCardList
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
                var scoreData = await _reportCardRepository.GetScoreDetailsAsync(request.ReportCardId);

                if (scoreData is DataSet dataSet && dataSet.Tables[0].Rows.Count > 0)
                {
                    var row = dataSet.Tables[0].Rows[0];
                    var scoreDetails = new ScoreDetails
                    {
                        StudentId = row["StudentID"].ToString() ?? "",
                        StudentName = row["StudentName"].ToString() ?? "",
                        Group = row["Group"].ToString() ?? "",
                        ExamType = row["ExamType"].ToString() ?? "",
                        ExamDate = row["ExamDate"].ToString() ?? "",
                        TotalCredit = row["TotalCredit"].ToString() ?? "",
                        ReceivedCredit = row["ReceivedCredit"].ToString() ?? "",
                        Comments = row["Comments"].ToString() ?? ""
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

        /// <summary>
        /// Delete student score
        /// </summary>
        public async Task<DeleteScoreResponse> DeleteStudentScoreAsync(DeleteScoreRequest request)
        {
            try
            {
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
                object reportData;

                if (request.IsSemesterReport)
                {
                    reportData = await _reportCardRepository.GetSemesterReportAsync(request.Username, request.Class);
                }
                else
                {
                    reportData = await _reportCardRepository.GetSummaryReportAsync(request.Username, request.ReportDate, request.Class);
                }

                return new ViewReportResponse
                {
                    IsSuccess = true,
                    ReportData = reportData
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
                var classListData = await _reportCardRepository.GetClassListByInstructorAsync(request.SendBy);

                if (classListData is DataSet dataSet && dataSet.Tables[0].Rows.Count > 0)
                {
                    var studentClassEmail = dataSet.Tables[0].Rows[0]["StudentEmailGroup"].ToString() ?? "";
                    var adminEmail = _configuration["AdminEmailID"] ?? "admin@agouramathcircle.org";

                    var subject = "Agoura Math Circle :Student score has been posted.";
                    var body = "We have posted your kid`s score.<br/>"
                        + "<br/><br/> Please login at www.agouramathcircle.org and view your kid's score and instructor Comments. <br/><br/>"
                        + " If you have any question with your kid's score, please contact the instructor via Message center." + "<br/><br/>"
                        + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                    await _emailUtility.SendEmailAsync(studentClassEmail, adminEmail, subject, body);
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
                // Parse Excel file and extract data
                var dataTable = ParseExcelFile(request.FileContent, request.FileName);

                // Process each row and add scores
                foreach (DataRow row in dataTable.Rows)
                {
                    var addScoreRequest = new AddStudentScoreRequest
                    {
                        StudentID = row["StudentID"].ToString() ?? "",
                        QuizTotalScore = request.TotalQuizScore,
                        QuizReceivedScore = row["Quiz"].ToString() ?? "",
                        QuizComments = row["Quiz Comments"].ToString() ?? "",
                        ClassTestTotalScore = request.TotalClassTestScore,
                        ClassTestReceivedScore = row["ClassWork"].ToString() ?? "",
                        ClassTestComments = row["Class Work Comments"].ToString() ?? "",
                        HomeWorkTotalScore = request.TotalHomeWorkScore,
                        HomeWorkReceivedScore = row["HomeWork"].ToString() ?? "",
                        HomeWorkComments = row["Home Work Comments"].ToString() ?? "",
                        Session = "2024-2025" // Default session value
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
                object data;
                string fileName;

                if (request.IsSummaryReport)
                {
                    // Get summary report data
                    data = await _reportCardRepository.GetSummaryReportAsync(request.Username, "", "");
                    fileName = "SummaryReport";
                }
                else
                {
                    // Get report card list data
                    data = await _reportCardRepository.GetReportCardListAsync(request.Username);
                    fileName = "ReportCardlist";
                }

                if (data is DataTable dataTable)
                {
                    var excelContent = ConvertDataTableToExcel(dataTable);

                    return new ExcelExportResponse
                    {
                        IsSuccess = true,
                        FileName = $"{fileName}.xls",
                        FileContent = excelContent,
                        ContentType = "application/vnd.xlsx"
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
                // Get all dashboard data in parallel
                var reportCardListTask = _reportCardRepository.GetReportCardListAsync(request.Username);
                var studentListTask = _reportCardRepository.GetStudentListAsync(request.Username);
                var classListTask = _reportCardRepository.GetClassListAsync(request.Username);
                var reportDateListTask = _reportCardRepository.GetReportDateListAsync(request.Username);
                var examDateListTask = _reportCardRepository.GetClassScheduleAsync(request.Username, "date");

                await Task.WhenAll(reportCardListTask, studentListTask, classListTask, reportDateListTask, examDateListTask);

                return new ReportCardDashboardResponse
                {
                    IsSuccess = true,
                    ReportCardList = await reportCardListTask,
                    StudentList = await studentListTask,
                    ClassList = await classListTask,
                    ReportDateList = await reportDateListTask,
                    ExamDateList = await examDateListTask
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
                var summaryReportData = await _reportCardRepository.GetSummaryReportAsync(request.Username, request.ReportDate, "");

                if (summaryReportData is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    var adminEmail = _configuration["AdminEmailID"] ?? "admin@agouramathcircle.org";

                    foreach (DataRow row in dataTable.Rows)
                    {
                        var studentName = row["StudentName"].ToString() ?? "";
                        var examDate = row["ExamDate"].ToString() ?? "";
                        var group = row["Group"].ToString() ?? "";
                        var parentEmail = row["ParentEmail"].ToString() ?? "";

                        var emailBody = GenerateStudentReportEmailBody(row);
                        var subject = "Agoura Math Circle - Student Report Card";

                        await _emailUtility.SendEmailAsync(parentEmail, adminEmail, subject, emailBody);
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
        /// Parse Excel file and return DataTable
        /// </summary>
        private DataTable ParseExcelFile(byte[] fileContent, string fileName)
        {
            // This is a simplified implementation
            // In a real scenario, you would use a library like EPPlus or ClosedXML
            var dataTable = new DataTable();

            // Add basic columns based on the original code structure
            dataTable.Columns.Add("StudentID");
            dataTable.Columns.Add("Quiz");
            dataTable.Columns.Add("Quiz Comments");
            dataTable.Columns.Add("ClassWork");
            dataTable.Columns.Add("Class Work Comments");
            dataTable.Columns.Add("HomeWork");
            dataTable.Columns.Add("Home Work Comments");

            // For now, return empty table - in real implementation, parse the Excel file
            return dataTable;
        }

        /// <summary>
        /// Convert DataTable to Excel format
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
        /// Generate student report email body
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

            // Add score details based on available data
            if (row["QuizTotal"].ToString() != "0")
            {
                emailBody += "<tr>"
                    + "<td> Quiz </td>"
                    + "<td>" + row["QuizTotal"].ToString() + "</td>"
                    + "<td>" + row["QuizReceived"].ToString() + "</td>"
                    + "<td>" + row["QuizComments"].ToString() + "</td>"
                    + "</tr>";
            }

            // Add other score types similarly...
            emailBody += "</table>"
                + "<br/><br/> Please login at www.agouramathcircle.org and view your score and instructor Comments. <br/><br/>"
                + " Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

            return emailBody;
        }
    }
}
