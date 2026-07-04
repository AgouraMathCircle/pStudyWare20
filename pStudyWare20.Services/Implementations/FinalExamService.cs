using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Final exam business logic — mirrors legacy FinalExam.aspx.cs.
    /// </summary>
    public class FinalExamService : IFinalExamService
    {
        private readonly IFinalExamRepository _finalExamRepository;
        private readonly IStudentDashboardRepository _studentDashboardRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public FinalExamService(
            IFinalExamRepository finalExamRepository,
            IStudentDashboardRepository studentDashboardRepository,
            IEmailUtility emailUtility,
            IConfiguration configuration)
        {
            _finalExamRepository = finalExamRepository;
            _studentDashboardRepository = studentDashboardRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
        }

        public StudentListResponse GetStudentList(StudentListRequest request)
        {
            var response = new StudentListResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Username is required";
                    return response;
                }

                if (string.IsNullOrWhiteSpace(request.Mode))
                {
                    request.Mode = "E";
                }

                var semesterLookup = _studentDashboardRepository.GetActiveSemesterLookupAsync().GetAwaiter().GetResult();
                var allStudents = LoadStudentsFromRepository(request);
                response.Students = FinalExamDisplayHelper.FilterEligibleStudents(
                    allStudents,
                    semesterLookup.FinalExamDisplay,
                    semesterLookup.FinalExamDisplayChapter);

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public ExamQuestionsResponse GetExamQuestions(ExamQuestionsRequest request)
        {
            var response = new ExamQuestionsResponse();
            try
            {
                if (!EnsureEligibleStudentAccess(
                        request.PortalUsername,
                        request.StudentID.ToString(),
                        request.Class,
                        out var accessError))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = accessError;
                    return response;
                }

                var result = _finalExamRepository.GetExamQuestionsAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Questions.Add(new ExamQuestion
                            {
                                Question = GetIntFromElement(row, "Question"),
                                AnswerKey = GetStringFromElement(row, "AnswerKey"),
                                Points = GetIntFromElement(row, "Points"),
                                CreatedDate = GetDateFromElement(row, "CreatedDate")
                            });
                        }
                    }
                }

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public ScoreValidationResponse ValidateScoreUpdate(ScoreValidationRequest request)
        {
            var response = new ScoreValidationResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Source))
                {
                    request.Source = "OnlineExam";
                }

                if (!EnsureEligibleStudentAccess(
                        request.PortalUsername,
                        request.StudentID.ToString(),
                        request.Class,
                        out var accessError))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = accessError;
                    response.EnableScoreUpdate = false;
                    return response;
                }

                var result = _finalExamRepository.ValidateScoreUpdateAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        var enableScoreUpdate = GetStringFromElement(rows[0], "EnableScoreUpdate");
                        response.EnableScoreUpdate = enableScoreUpdate == "Y";
                    }
                }

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public CurrentSessionResponse GetCurrentSession(CurrentSessionRequest request)
        {
            var response = new CurrentSessionResponse();
            try
            {
                var result = _finalExamRepository.GetCurrentSessionAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Sessions.Add(new SessionItem
                            {
                                Session = GetStringFromElement(row, "Session")
                            });
                        }
                    }
                }

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public StudentScoresResponse GetStudentScores(StudentScoresRequest request)
        {
            var response = new StudentScoresResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Username is required";
                    return response;
                }

                var result = _finalExamRepository.GetStudentScoresAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Scores.Add(new StudentScore
                            {
                                StudentID = GetIntFromElement(row, "StudentID"),
                                StudentName = GetStringFromElement(row, "StudentName"),
                                Group = GetStringFromElement(row, "Group", "Class"),
                                Grade = GetStringFromElement(row, "Grade"),
                                Semester = GetStringFromElement(row, "CurrentSession", "Semester"),
                                ExamType = GetStringFromElement(row, "ExamType"),
                                ExamDate = GetDateFromElement(row, "ExamDate") ?? DateTime.MinValue,
                                TotalCredit = GetFloatFromElement(row, "TotalCredit"),
                                ReceivedCredit = GetFloatFromElement(row, "ReceivedCredit"),
                                Comments = GetStringFromElement(row, "Comments"),
                                SubmittedDate = GetStringFromElement(row, "SubmittedDate")
                            });
                        }
                    }
                }

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public FinalExamAvailabilityResponse GetExamAvailability(string portalUsername)
        {
            var response = new FinalExamAvailabilityResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(portalUsername))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Username is required";
                    return response;
                }

                var semesterLookup = _studentDashboardRepository.GetActiveSemesterLookupAsync().GetAwaiter().GetResult();
                var allStudents = LoadStudentsFromRepository(new StudentListRequest
                {
                    Username = portalUsername,
                    Mode = "E"
                });
                var eligibleStudents = FinalExamDisplayHelper.FilterEligibleStudents(
                    allStudents,
                    semesterLookup.FinalExamDisplay,
                    semesterLookup.FinalExamDisplayChapter);

                response.EligibleStudentCount = eligibleStudents.Count;
                response.ShowFinalExam = semesterLookup.FinalExamDisplay && eligibleStudents.Count > 0;
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public SubmitExamResponse SubmitExam(SubmitExamRequest request)
        {
            var response = new SubmitExamResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.PortalUsername))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Portal username is required";
                    return response;
                }

                if (!EnsureEligibleStudentAccess(
                        request.PortalUsername,
                        request.StudentID,
                        request.Class,
                        out var accessError))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = accessError;
                    return response;
                }

                var result = _finalExamRepository.SubmitExamAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        response.TotalScore = GetStringFromElement(rows[0], "FinalExamTotalScore");
                        response.ReceivedScore = GetStringFromElement(rows[0], "FinalExamReceivedScore");
                        response.Message = "Exam submitted successfully";

                        TrySendFinalExamReportEmail(request.PortalUsername, request.ExamType, rows[0]);
                    }
                }

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = string.Empty;
            }

            return response;
        }

        private List<StudentListItem> LoadStudentsFromRepository(StudentListRequest request)
        {
            var students = new List<StudentListItem>();
            var result = _finalExamRepository.GetStudentListAsync(request).Result;

            if (string.IsNullOrEmpty(result))
            {
                return students;
            }

            var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
            if (rows == null)
            {
                return students;
            }

            foreach (var row in rows)
            {
                students.Add(new StudentListItem
                {
                    Value = GetStringFromElement(row, "StudentID", "Value"),
                    Text = GetStringFromElement(row, "StudentName", "Text")
                });
            }

            return students;
        }

        private bool EnsureEligibleStudentAccess(
            string portalUsername,
            string studentId,
            string? expectedClass,
            out string errorMessage)
        {
            errorMessage = string.Empty;

            if (string.IsNullOrWhiteSpace(portalUsername))
            {
                errorMessage = "Portal username is required.";
                return false;
            }

            if (string.IsNullOrWhiteSpace(studentId))
            {
                errorMessage = "Student ID is required.";
                return false;
            }

            var listResponse = GetStudentList(new StudentListRequest
            {
                Username = portalUsername,
                Mode = "E"
            });

            if (!listResponse.IsSuccess)
            {
                errorMessage = listResponse.ErrorMessage ?? "Unable to verify student eligibility.";
                return false;
            }

            var student = listResponse.Students.FirstOrDefault(item =>
                StudentListValueMatchesStudentId(item.Value, studentId));

            if (student == null)
            {
                errorMessage =
                    "The selected student is not eligible for the Final Exam or is not associated with your account.";
                return false;
            }

            if (!string.IsNullOrWhiteSpace(expectedClass))
            {
                var parts = (student.Value ?? string.Empty).Split('~');
                if (parts.Length >= 1 &&
                    !string.Equals(parts[0].Trim(), expectedClass.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    errorMessage = "The class does not match the selected student.";
                    return false;
                }
            }

            return true;
        }

        private static bool StudentListValueMatchesStudentId(string? studentListValue, string studentId)
        {
            var value = studentListValue ?? string.Empty;
            var parts = value.Split('~');
            if (parts.Length >= 2)
            {
                return string.Equals(parts[1].Trim(), studentId.Trim(), StringComparison.OrdinalIgnoreCase);
            }

            return string.Equals(value.Trim(), studentId.Trim(), StringComparison.OrdinalIgnoreCase);
        }

        private void TrySendFinalExamReportEmail(string portalUsername, string examType, JsonElement resultRow)
        {
            try
            {
                var studentName = GetStringFromElement(resultRow, "StudentName");
                var currentSemester = GetStringFromElement(resultRow, "CurrentSemster", "CurrentSemester", "CurrentSession");
                var className = GetStringFromElement(resultRow, "Class");
                var examDate = GetStringFromElement(resultRow, "ExamDate");
                var totalScore = GetStringFromElement(resultRow, "FinalExamTotalScore");
                var receivedScore = GetStringFromElement(resultRow, "FinalExamReceivedScore");
                var comments = GetStringFromElement(resultRow, "Comments");
                var resolvedExamType = string.IsNullOrWhiteSpace(examType) ? "Final Exam" : examType;

                var subject = $"Agoura Math Circle - {studentName}'s {resolvedExamType} score for {currentSemester}";
                var body = GenerateFinalExamReportEmailBody(
                    studentName,
                    resolvedExamType,
                    currentSemester,
                    className,
                    examDate,
                    totalScore,
                    receivedScore,
                    comments);

                var emailFrom = _configuration.GetSection("AppSettings")["Email"]
                    ?? _configuration.GetSection("AppSettings")["AdminEmailID"]
                    ?? "support@agouramathcircle.org";

                _emailUtility.SendEmailAsync(portalUsername, emailFrom, subject, body)
                    .GetAwaiter()
                    .GetResult();
            }
            catch
            {
                // Email failure must not fail a successful exam submission (legacy behavior).
            }
        }

        /// <summary>
        /// Matches legacy FinalExam.aspx.cs SendEmailStudentReport HTML.
        /// </summary>
        private static string GenerateFinalExamReportEmailBody(
            string studentName,
            string examType,
            string currentSemester,
            string className,
            string examDate,
            string totalScore,
            string receivedScore,
            string comments)
        {
            return "<style>"
                + "table {color: #333; font-family: Helvetica, Arial, sans-serif;"
                + "font-weight:bold;width: 640px;border-collapse:collapse;"
                + "border-spacing: 0;}"
                + "td, th {border: 1px solid #CCC; height: 30px; }"
                + "th {background: #F3F3F3;font-weight: bold;}"
                + "td {background: #FAFAFA;text-align: center;}"
                + "</style>"
                + "Hello " + studentName
                + ",<br/><b>Thank you for submitting the " + examType + ". Here is your " + examType + " Score for " + currentSemester + "!<br/>"
                + "<table>"
                + "<tr><td align='center'>" + examType + " Results - " + currentSemester + "</td></tr>"
                + "<tr><td>Name: " + studentName + "</td></tr>"
                + "<tr><td>Class: " + className + "</td></tr>"
                + "<tr><td>Exam Date: " + examDate + "</td></tr>"
                + "</table>"
                + "<br />"
                + "<table border=1>"
                + "<tr>"
                + "<td></td>"
                + "<td>Total Score</td>"
                + "<td>Your Score</td>"
                + "<td>Comments</td>"
                + "</tr>"
                + "<tr>"
                + "<td>" + examType + "</td>"
                + "<td>" + totalScore + "</td>"
                + "<td>" + receivedScore + "</td>"
                + "<td>" + comments + "</td>"
                + "</tr>"
                + "</table>"
                + "<br/><br/>Please login at www.agouramathcircle.org and view your score and instructor Comments.<br/><br/>"
                + "Regards<br/>Agoura Math Circle<br/>www.agouramathcircle.org";
        }

        private static string GetStringFromElement(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (row.TryGetProperty(propertyName, out var prop))
                {
                    return prop.ValueKind switch
                    {
                        JsonValueKind.Null or JsonValueKind.Undefined => string.Empty,
                        JsonValueKind.String => prop.GetString() ?? string.Empty,
                        _ => prop.ToString()
                    };
                }
            }

            return string.Empty;
        }

        private static int GetIntFromElement(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (!row.TryGetProperty(propertyName, out var prop) ||
                    prop.ValueKind == JsonValueKind.Null ||
                    prop.ValueKind == JsonValueKind.Undefined)
                {
                    continue;
                }

                if (prop.TryGetInt32(out var intVal))
                {
                    return intVal;
                }

                if (int.TryParse(prop.ToString(), out var parsed))
                {
                    return parsed;
                }
            }

            return 0;
        }

        private static float GetFloatFromElement(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (!row.TryGetProperty(propertyName, out var prop) ||
                    prop.ValueKind == JsonValueKind.Null ||
                    prop.ValueKind == JsonValueKind.Undefined)
                {
                    continue;
                }

                if (prop.TryGetSingle(out var floatVal))
                {
                    return floatVal;
                }

                if (float.TryParse(prop.ToString(), out var parsed))
                {
                    return parsed;
                }
            }

            return 0;
        }

        private static DateTime? GetDateFromElement(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (!row.TryGetProperty(propertyName, out var prop) ||
                    prop.ValueKind == JsonValueKind.Null ||
                    prop.ValueKind == JsonValueKind.Undefined)
                {
                    continue;
                }

                if (prop.TryGetDateTime(out var dateVal))
                {
                    return dateVal;
                }

                if (DateTime.TryParse(prop.ToString(), out var parsed))
                {
                    return parsed;
                }
            }

            return null;
        }
    }
}
