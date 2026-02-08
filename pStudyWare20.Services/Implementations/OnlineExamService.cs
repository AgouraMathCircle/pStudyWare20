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
                                Value = GetStringFromElement(row, "Value"),
                                Text = GetStringFromElement(row, "Text")
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
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            response.Questions.Add(new OnlineExamQuestion
                            {
                                Question = Convert.ToInt32(row["Question"]),
                                AnswerKey = row["AnswerKey"]?.ToString() ?? string.Empty,
                                Points = Convert.ToInt32(row["Points"]),
                                CreatedDate = row["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(row["CreatedDate"]) : null
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
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        var enableScoreUpdate = dataTable.Rows[0]["EnableScoreUpdate"]?.ToString();
                        response.EnableScoreUpdate = enableScoreUpdate == "Y";
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
                var result = _onlineExamRepository.GetCurrentSessionAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            response.Sessions.Add(new SessionItem
                            {
                                Session = row["Session"]?.ToString() ?? string.Empty
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
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            response.Scores.Add(new StudentScore
                            {
                                StudentName = row["StudentName"]?.ToString() ?? string.Empty,
                                Group = row["Class"]?.ToString() ?? string.Empty,
                                Semester = row["CurrentSemester"]?.ToString() ?? string.Empty,
                                ExamDate = DateTime.TryParse(row["ExamDate"]?.ToString(), out var examDate) ? examDate : DateTime.MinValue,
                                TotalCredit = float.TryParse(row["TotalScore"]?.ToString(), out var totalScore) ? totalScore : 0,
                                ReceivedCredit = float.TryParse(row["ReceivedScore"]?.ToString(), out var receivedScore) ? receivedScore : 0,
                                Comments = row["Comments"]?.ToString() ?? string.Empty
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
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        response.TotalScore = dataTable.Rows[0]["FinalExamTotalScore"]?.ToString() ?? "0";
                        response.ReceivedScore = dataTable.Rows[0]["FinalExamReceivedScore"]?.ToString() ?? "0";
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

        private static string GetStringFromElement(JsonElement row, string propertyName)
        {
            if (row.TryGetProperty(propertyName, out var prop))
                return prop.ValueKind == JsonValueKind.Null || prop.ValueKind == JsonValueKind.Undefined ? string.Empty : (prop.GetString() ?? string.Empty);
            return string.Empty;
        }
    }
}
