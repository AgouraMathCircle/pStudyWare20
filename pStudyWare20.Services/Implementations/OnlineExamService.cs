using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of online exam business logic operations (matches legacy controller)
    /// </summary>
    public class OnlineExamService : IOnlineExamService
    {
        private readonly IOnlineExamRepository _onlineExamRepository;
        private readonly IConfiguration _configuration;

        public OnlineExamService(IOnlineExamRepository onlineExamRepository, IConfiguration configuration)
        {
            _onlineExamRepository = onlineExamRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Get student list (matches legacy controller exactly)
        /// </summary>
        public OnlineExamStudentListResponse GetStudentList(OnlineExamStudentListRequest request)
        {
            OnlineExamStudentListResponse response = new OnlineExamStudentListResponse();
            try
            {
                var result = _onlineExamRepository.GetStudentListAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<System.Text.Json.JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.StudentList.Add(new StudentListItem
                            {
                                Value = GetStringFromElement(row, "StudentID", "Value"),
                                Text = GetStringFromElement(row, "StudentName", "Text"),
                            });
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Get online exam questions (matches legacy controller exactly)
        /// </summary>
        public OnlineExamQuestionsResponse GetOnlineExamQuestions(OnlineExamQuestionsRequest request)
        {
            OnlineExamQuestionsResponse response = new OnlineExamQuestionsResponse();
            try
            {
                var result = _onlineExamRepository.GetOnlineExamQuestionsAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Questions.Add(new OnlineExamQuestion
                            {
                                Question = GetInt(row, "Question"),
                                AnswerKey = GetStringFromElement(row, "AnswerKey"),
                                Points = GetInt(row, "Points"),
                                CreatedDate = GetDate(row, "CreatedDate"),
                            });
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Validate score update (matches legacy controller exactly)
        /// </summary>
        public OnlineExamScoreValidationResponse ValidateScoreUpdate(OnlineExamScoreValidationRequest request)
        {
            OnlineExamScoreValidationResponse response = new OnlineExamScoreValidationResponse();
            try
            {
                var result = _onlineExamRepository.ValidateScoreUpdateAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        var flag = GetStringFromElement(rows[0], "EnableScoreUpdate");
                        response.EnableScoreUpdate = string.Equals(flag, "Y", StringComparison.OrdinalIgnoreCase);
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Get current session (matches legacy controller exactly)
        /// </summary>
        public OnlineExamCurrentSessionResponse GetCurrentSession(OnlineExamCurrentSessionRequest request)
        {
            OnlineExamCurrentSessionResponse response = new OnlineExamCurrentSessionResponse();
            try
            {
                request.ChapterID = (request.ChapterID ?? string.Empty).Trim();
                var result = _onlineExamRepository.GetCurrentSessionAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Sessions.Add(new SessionItem
                            {
                                Session = GetStringFromElement(row, "Session"),
                            });
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Get student scores (matches legacy controller exactly)
        /// </summary>
        public OnlineExamStudentScoresResponse GetStudentScores(OnlineExamStudentScoresRequest request)
        {
            OnlineExamStudentScoresResponse response = new OnlineExamStudentScoresResponse();
            try
            {
                var result = _onlineExamRepository.GetStudentScoresAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Scores.Add(new StudentScore
                            {
                                StudentID = GetInt(row, "StudentID"),
                                StudentName = GetStringFromElement(row, "StudentName"),
                                Group = GetStringFromElement(row, "Group", "Class"),
                                Grade = GetStringFromElement(row, "Grade"),
                                Semester = GetStringFromElement(row, "Semester", "CurrentSession"),
                                ExamType = GetStringFromElement(row, "ExamType"),
                                ExamDate = GetDate(row, "ExamDate") ?? DateTime.MinValue,
                                TotalCredit = GetFloat(row, "TotalCredit", "TotalScore"),
                                ReceivedCredit = GetFloat(row, "ReceivedCredit", "ReceivedScore"),
                                Comments = GetStringFromElement(row, "Comments"),
                            });
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Submit online exam (matches legacy controller exactly)
        /// </summary>
        public SubmitOnlineExamResponse SubmitOnlineExam(SubmitOnlineExamRequest request)
        {
            SubmitOnlineExamResponse response = new SubmitOnlineExamResponse();
            try
            {
                var result = _onlineExamRepository.SubmitOnlineExamAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        response.TotalScore = GetStringFromElement(rows[0], "FinalExamTotalScore");
                        response.ReceivedScore = GetStringFromElement(rows[0], "FinalExamReceivedScore");
                        response.Message = "Online exam submitted successfully";
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
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
                        JsonValueKind.Number => prop.GetRawText(),
                        _ => prop.GetRawText()
                    };
                }
            }

            return string.Empty;
        }

        private static int GetInt(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (!row.TryGetProperty(propertyName, out var prop))
                {
                    continue;
                }

                if (prop.ValueKind == JsonValueKind.Number && prop.TryGetInt32(out var number))
                {
                    return number;
                }

                if (prop.ValueKind == JsonValueKind.String &&
                    int.TryParse(prop.GetString(), out var parsed))
                {
                    return parsed;
                }
            }

            return 0;
        }

        private static float GetFloat(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (!row.TryGetProperty(propertyName, out var prop))
                {
                    continue;
                }

                if (prop.ValueKind == JsonValueKind.Number && prop.TryGetSingle(out var number))
                {
                    return number;
                }

                if (prop.ValueKind == JsonValueKind.String &&
                    float.TryParse(prop.GetString(), out var parsed))
                {
                    return parsed;
                }
            }

            return 0;
        }

        private static DateTime? GetDate(JsonElement row, params string[] propertyNames)
        {
            foreach (var propertyName in propertyNames)
            {
                if (!row.TryGetProperty(propertyName, out var prop))
                {
                    continue;
                }

                if (prop.ValueKind == JsonValueKind.String &&
                    DateTime.TryParse(prop.GetString(), out var parsed))
                {
                    return parsed;
                }
            }

            return null;
        }
    }
}
