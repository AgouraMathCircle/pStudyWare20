using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Student score business logic — mirrors legacy StudentScore.aspx.cs.
    /// </summary>
    public class StudentScoreService : IStudentScoreService
    {
        private readonly IStudentScoreRepository _studentScoreRepository;

        public StudentScoreService(IStudentScoreRepository studentScoreRepository)
        {
            _studentScoreRepository = studentScoreRepository;
        }

        public OnlineExamStudentListResponse GetStudentList(OnlineExamStudentListRequest request)
        {
            var response = new OnlineExamStudentListResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Username is required.";
                    return response;
                }

                if (string.IsNullOrWhiteSpace(request.Type))
                {
                    request.Type = "E";
                }

                var result = _studentScoreRepository.GetStudentListAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.StudentList.Add(new StudentListItem
                            {
                                Value = GetString(row, "StudentID", "Value"),
                                Text = GetString(row, "StudentName", "Text"),
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

        public CurrentSessionResponse GetCurrentSession(GetCurrentSessionRequest request)
        {
            var response = new CurrentSessionResponse();
            try
            {
                var result = _studentScoreRepository.GetCurrentSessionAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.Sessions.Add(new SessionItem
                            {
                                Session = GetString(row, "Session"),
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

        public ScoreValidationResponse ValidateScoreUpdate(ValidateScoreUpdateRequest request)
        {
            var response = new ScoreValidationResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Source))
                {
                    request.Source = "UpdateScore";
                }

                var result = _studentScoreRepository.ValidateScoreUpdateAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                if (rows != null && rows.Count > 0)
                {
                    var flag = GetString(rows[0], "EnableScoreUpdate");
                    response.EnableScoreUpdate = string.Equals(flag, "Y", StringComparison.OrdinalIgnoreCase);
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

        public DueDateResponse GetDueDate(GetDueDateRequest request)
        {
            var response = new DueDateResponse();
            try
            {
                var result = _studentScoreRepository.GetDueDateAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        response.DueDate = GetString(rows[0], "DueDate");
                        response.OnlineExamDisplayChapter = GetString(rows[0], "OnlineExamDisplayChapter");
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

        public StudentScoresListResponse GetStudentScores(GetStudentScoresRequest request)
        {
            var response = new StudentScoresListResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Username is required.";
                    return response;
                }

                var result = _studentScoreRepository.GetStudentScoresAsync(request).Result;
                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<JsonElement>>(result);
                    if (rows != null)
                    {
                        foreach (var row in rows)
                        {
                            response.StudentScores.Add(new StudentScore
                            {
                                StudentID = GetInt(row, "StudentID"),
                                StudentName = GetString(row, "StudentName"),
                                Group = GetString(row, "Group"),
                                Grade = GetString(row, "Grade"),
                                Semester = GetString(row, "Semester", "CurrentSession"),
                                ExamType = GetString(row, "ExamType"),
                                ExamDate = GetDate(row, "ExamDate") ?? DateTime.MinValue,
                                TotalCredit = GetFloat(row, "TotalCredit"),
                                ReceivedCredit = GetFloat(row, "ReceivedCredit"),
                                Comments = GetString(row, "Comments"),
                                ReportID = GetString(row, "ReportID", "ScoreID"),
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

        public ScoreOperationResponse AddStudentScore(AddStudentScoreRequest request)
        {
            try
            {
                NormalizeAddStudentScoreRequest(request);

                if (string.IsNullOrWhiteSpace(request.StudentID))
                {
                    return new ScoreOperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Student ID is required.",
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Session))
                {
                    return new ScoreOperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Session is required.",
                    };
                }

                var scoreValidationError = ValidateScoreValues(request);
                if (!string.IsNullOrEmpty(scoreValidationError))
                {
                    return new ScoreOperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = scoreValidationError,
                    };
                }

                if (!string.IsNullOrWhiteSpace(request.Group))
                {
                    var windowValidation = ValidateScoreUpdate(new ValidateScoreUpdateRequest
                    {
                        StudentID = request.StudentID,
                        Session = request.Session,
                        Class = request.Group,
                        ExamType = "Quiz",
                        Source = "UpdateScore",
                    });

                    if (!windowValidation.IsSuccess)
                    {
                        return new ScoreOperationResponse
                        {
                            IsSuccess = false,
                            ErrorMessage = windowValidation.ErrorMessage
                                ?? "Unable to validate the score update window.",
                        };
                    }

                    if (!windowValidation.EnableScoreUpdate)
                    {
                        return new ScoreOperationResponse
                        {
                            IsSuccess = false,
                            ErrorMessage = "The Score Update window has closed.",
                        };
                    }
                }

                var result = _studentScoreRepository.AddStudentScoreAsync(request).Result;
                return ParseScoreOperationResult(result);
            }
            catch (Exception ex)
            {
                return new ScoreOperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.GetBaseException().Message,
                };
            }
        }

        public ScoreOperationResponse UpdateStudentScore(UpdateStudentScoreRequest request)
        {
            try
            {
                _studentScoreRepository.UpdateStudentScoreAsync(request).Wait();
                return new ScoreOperationResponse
                {
                    IsSuccess = true,
                    Message = "Scores have been updated successfully.",
                };
            }
            catch (Exception ex)
            {
                return new ScoreOperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.GetBaseException().Message,
                };
            }
        }

        private static void NormalizeAddStudentScoreRequest(AddStudentScoreRequest request)
        {
            request.StudentID = ExtractStudentId(request.StudentID);
            request.Group = request.Group?.Trim() ?? string.Empty;
            request.Session = request.Session?.Trim() ?? string.Empty;
            request.QuizTotalScore = NormalizeScoreValue(request.QuizTotalScore, "5");
            request.QuizReceivedScore = NormalizeScoreValue(request.QuizReceivedScore, "0");
            request.ClassTestTotalScore = NormalizeScoreValue(request.ClassTestTotalScore, "20");
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

        private static string ExtractStudentId(string? studentId)
        {
            var value = (studentId ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            var parts = value.Split('~');
            return parts.Length >= 2 ? parts[1].Trim() : value;
        }

        private static string NormalizeScoreValue(string? value, string defaultValue)
        {
            return string.IsNullOrWhiteSpace(value) ? defaultValue : value.Trim();
        }

        private static string? ValidateScoreValues(AddStudentScoreRequest request)
        {
            var rows = new (string Label, string Total, string Received)[]
            {
                ("Quiz", request.QuizTotalScore, request.QuizReceivedScore),
                ("Class Test", request.ClassTestTotalScore, request.ClassTestReceivedScore),
                ("Home Work", request.HomeWorkTotalScore, request.HomeWorkReceivedScore),
            };

            foreach (var row in rows)
            {
                if (!double.TryParse(row.Total, out var total) || !double.TryParse(row.Received, out var received))
                {
                    return $"{row.Label}: please enter valid numeric scores.";
                }

                if (total < 0 || received < 0)
                {
                    return $"{row.Label}: scores cannot be negative.";
                }

                if (received > total)
                {
                    return $"{row.Label}: received score cannot be greater than total score.";
                }
            }

            return null;
        }

        private static ScoreOperationResponse ParseScoreOperationResult(string? resultJson)
        {
            const string successMessage = "Scores have been updated successfully.";

            if (string.IsNullOrWhiteSpace(resultJson) || resultJson == "[]")
            {
                return new ScoreOperationResponse
                {
                    IsSuccess = true,
                    Message = successMessage,
                };
            }

            var rows = JsonSerializer.Deserialize<List<JsonElement>>(resultJson);
            if (rows == null || rows.Count == 0)
            {
                return new ScoreOperationResponse
                {
                    IsSuccess = true,
                    Message = successMessage,
                };
            }

            var row = rows[0];
            var errorMessage = GetString(row, "ErrorMessage", "Message", "Result", "StatusMessage");
            var successFlag = GetString(row, "IsSuccess", "Success", "Status");

            if (IsFailureFlag(successFlag) ||
                (!string.IsNullOrWhiteSpace(errorMessage) &&
                 errorMessage.Contains("error", StringComparison.OrdinalIgnoreCase)))
            {
                return new ScoreOperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = string.IsNullOrWhiteSpace(errorMessage)
                        ? "Failed to update scores."
                        : errorMessage,
                };
            }

            return new ScoreOperationResponse
            {
                IsSuccess = true,
                Message = string.IsNullOrWhiteSpace(errorMessage) ? successMessage : errorMessage,
            };
        }

        private static bool IsFailureFlag(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }

            return value.Equals("N", StringComparison.OrdinalIgnoreCase)
                || value.Equals("0", StringComparison.OrdinalIgnoreCase)
                || value.Equals("false", StringComparison.OrdinalIgnoreCase)
                || value.Equals("no", StringComparison.OrdinalIgnoreCase);
        }

        private static string GetString(JsonElement row, params string[] names)
        {
            foreach (var name in names)
            {
                if (row.TryGetProperty(name, out var prop))
                {
                    return prop.ValueKind == JsonValueKind.Null ? string.Empty : prop.ToString();
                }

                foreach (var property in row.EnumerateObject())
                {
                    if (string.Equals(property.Name, name, StringComparison.OrdinalIgnoreCase))
                    {
                        return property.Value.ValueKind == JsonValueKind.Null
                            ? string.Empty
                            : property.Value.ToString();
                    }
                }
            }
            return string.Empty;
        }

        private static int GetInt(JsonElement row, string name)
        {
            if (!row.TryGetProperty(name, out var prop) || prop.ValueKind == JsonValueKind.Null)
            {
                return 0;
            }

            return prop.TryGetInt32(out var value) ? value : int.TryParse(prop.ToString(), out var parsed) ? parsed : 0;
        }

        private static float GetFloat(JsonElement row, string name)
        {
            if (!row.TryGetProperty(name, out var prop) || prop.ValueKind == JsonValueKind.Null)
            {
                return 0;
            }

            return prop.TryGetSingle(out var value) ? value : float.TryParse(prop.ToString(), out var parsed) ? parsed : 0;
        }

        private static DateTime? GetDate(JsonElement row, string name)
        {
            if (!row.TryGetProperty(name, out var prop) || prop.ValueKind == JsonValueKind.Null)
            {
                return null;
            }

            return DateTime.TryParse(prop.ToString(), out var date) ? date : null;
        }
    }
}
