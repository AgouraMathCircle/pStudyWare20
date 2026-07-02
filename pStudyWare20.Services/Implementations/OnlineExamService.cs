using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Linq;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Online exam business logic — mirrors legacy OnlineExam.aspx.cs.
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

        public StudentListResponse GetStudentList(StudentListRequest request)
        {
            var response = new StudentListResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Mode))
                {
                    request.Mode = "E";
                }

                var result = _onlineExamRepository.GetStudentListAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Students.Add(new StudentListItem
                            {
                                Value = GetStringFromElement(row, "StudentID"),
                                Text = GetStringFromElement(row, "StudentName")
                            });
                        }
                    }
                }

                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.GetBaseException().Message;
            }

            return response;
        }

        public ExamQuestionsResponse GetExamQuestions(ExamQuestionsRequest request)
        {
            var response = new ExamQuestionsResponse();
            try
            {
                var result = _onlineExamRepository.GetExamQuestionsAsync(request).Result;
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
                response.ErrorMessage = ex.GetBaseException().Message;
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

                var result = _onlineExamRepository.ValidateScoreUpdateAsync(request).Result;
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
                response.ErrorMessage = ex.GetBaseException().Message;
            }

            return response;
        }

        public CurrentSessionResponse GetCurrentSession(CurrentSessionRequest request)
        {
            var response = new CurrentSessionResponse();
            try
            {
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
                response.ErrorMessage = ex.GetBaseException().Message;
            }

            return response;
        }

        public StudentScoresResponse GetStudentScores(StudentScoresRequest request)
        {
            var response = new StudentScoresResponse();
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
                                StudentID = GetIntFromElement(row, "StudentID"),
                                StudentName = GetStringFromElement(row, "StudentName"),
                                Group = GetStringFromElement(row, "Group"),
                                Grade = GetStringFromElement(row, "Grade"),
                                Semester = GetStringFromElement(row, "CurrentSession"),
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
                response.ErrorMessage = ex.GetBaseException().Message;
            }

            return response;
        }

        public SubmitExamResponse SubmitExam(SubmitExamRequest request)
        {
            var response = new SubmitExamResponse();
            try
            {
                if (request.Answers == null ||
                    request.Answers.All(a => string.IsNullOrWhiteSpace(a.AnswerKey)))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Please select at least one answer before submitting.";
                    return response;
                }

                var result = _onlineExamRepository.SubmitExamAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        response.TotalScore = GetStringFromElement(rows[0], "FinalExamTotalScore");
                        response.ReceivedScore = GetStringFromElement(rows[0], "FinalExamReceivedScore");
                        response.Message = "Exam submitted successfully";
                        response.IsSuccess = true;
                        return response;
                    }
                }

                response.IsSuccess = false;
                response.ErrorMessage = "Exam submission did not return a score. Please contact support.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.GetBaseException().Message;
                response.Message = string.Empty;
            }

            return response;
        }

        private static string GetStringFromElement(JsonElement row, string propertyName)
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
            return string.Empty;
        }

        private static int GetIntFromElement(JsonElement row, string propertyName)
        {
            if (row.TryGetProperty(propertyName, out var prop) &&
                prop.ValueKind != JsonValueKind.Null &&
                prop.ValueKind != JsonValueKind.Undefined)
            {
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

        private static float GetFloatFromElement(JsonElement row, string propertyName)
        {
            if (row.TryGetProperty(propertyName, out var prop) &&
                prop.ValueKind != JsonValueKind.Null &&
                prop.ValueKind != JsonValueKind.Undefined)
            {
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

        private static DateTime? GetDateFromElement(JsonElement row, string propertyName)
        {
            if (row.TryGetProperty(propertyName, out var prop) &&
                prop.ValueKind != JsonValueKind.Null &&
                prop.ValueKind != JsonValueKind.Undefined)
            {
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
