using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of final exam business logic operations (matches legacy controller)
    /// </summary>
    public class FinalExamService : IFinalExamService
    {
        private readonly IFinalExamRepository _finalExamRepository;
        private readonly IConfiguration _configuration;

        public FinalExamService(IFinalExamRepository finalExamRepository, IConfiguration configuration)
        {
            _finalExamRepository = finalExamRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Get student list (matches legacy controller exactly)
        /// </summary>
        public StudentListResponse GetStudentList(StudentListRequest request)
        {
            StudentListResponse response = new StudentListResponse();
            try
            {
                var result = _finalExamRepository.GetStudentListAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    var studentList = new List<StudentListItem>();
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            studentList.Add(new StudentListItem
                            {
                                Value = row["Value"]?.ToString() ?? string.Empty,
                                Text = row["Text"]?.ToString() ?? string.Empty
                            });
                        }
                    }
                    response.StudentList = studentList;
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
        /// Get exam questions (matches legacy controller exactly)
        /// </summary>
        public ExamQuestionsResponse GetExamQuestions(ExamQuestionsRequest request)
        {
            ExamQuestionsResponse response = new ExamQuestionsResponse();
            try
            {
                var result = _finalExamRepository.GetExamQuestionsAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            response.Questions.Add(new ExamQuestion
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
        public ScoreValidationResponse ValidateScoreUpdate(ScoreValidationRequest request)
        {
            ScoreValidationResponse response = new ScoreValidationResponse();
            try
            {
                var result = _finalExamRepository.ValidateScoreUpdateAsync(request).Result;

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
        public CurrentSessionResponse GetCurrentSession(CurrentSessionRequest request)
        {
            CurrentSessionResponse response = new CurrentSessionResponse();
            try
            {
                var result = _finalExamRepository.GetCurrentSessionAsync(request).Result;

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
        public StudentScoresResponse GetStudentScores(StudentScoresRequest request)
        {
            StudentScoresResponse response = new StudentScoresResponse();
            try
            {
                var result = _finalExamRepository.GetStudentScoresAsync(request).Result;

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
        /// Submit exam (matches legacy controller exactly)
        /// </summary>
        public SubmitExamResponse SubmitExam(SubmitExamRequest request)
        {
            SubmitExamResponse response = new SubmitExamResponse();
            try
            {
                var result = _finalExamRepository.SubmitExamAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        response.TotalScore = dataTable.Rows[0]["FinalExamTotalScore"]?.ToString() ?? "0";
                        response.ReceivedScore = dataTable.Rows[0]["FinalExamReceivedScore"]?.ToString() ?? "0";
                        response.Message = "Exam submitted successfully";
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
    }
}
