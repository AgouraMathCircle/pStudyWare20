using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Helpers;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Globalization;

namespace pStudyWare20.Repository.Implementations
{
        /// <summary>
        /// Repository implementation for report card data access operations
        /// </summary>
        public class ReportCardRepository : IReportCardRepository
        {
                private readonly AMC_DBContext _context;
                private readonly string _connectionString;

                public ReportCardRepository(AMC_DBContext context, IConfiguration configuration)
                {
                        _context = context;
                        _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
                }

                public Task<string> ResolvePortalUsernameAsync(string? identifier)
                {
                        return PortalUsernameResolver.ResolveAsync(_context, identifier);
                }

                private static object ParseExamDateParameter(string? examDate)
                {
                        if (string.IsNullOrWhiteSpace(examDate))
                                return DBNull.Value;

                        if (DateTime.TryParse(
                                examDate,
                                CultureInfo.InvariantCulture,
                                DateTimeStyles.AllowWhiteSpaces | DateTimeStyles.AssumeLocal,
                                out var parsed))
                        {
                                return parsed;
                        }

                        if (DateTime.TryParse(examDate, out parsed))
                                return parsed;

                        throw new FormatException($"Invalid exam date value: {examDate}");
                }

                private static int ExtractStudentId(string? studentId)
                {
                        var value = (studentId ?? string.Empty).Trim();
                        if (string.IsNullOrEmpty(value))
                                return 0;

                        var parts = value.Split('~');
                        var idPart = parts.Length >= 2 ? parts[1].Trim() : value;
                        return ParseIntParameter(idPart, 0);
                }

                private static int ParseIntParameter(string? value, int defaultValue)
                {
                        if (string.IsNullOrWhiteSpace(value))
                                return defaultValue;

                        var trimmed = value.Trim();
                        if (int.TryParse(trimmed, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result))
                                return result;

                        if (double.TryParse(trimmed, NumberStyles.Float, CultureInfo.InvariantCulture, out var numeric))
                                return (int)numeric;

                        return defaultValue;
                }

                private static double ParseFloatParameter(string? value, double defaultValue)
                {
                        if (string.IsNullOrWhiteSpace(value))
                                return defaultValue;

                        if (double.TryParse(value.Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out var result))
                                return result;

                        return defaultValue;
                }

                private static object ToOptionalStringParameter(string? value)
                {
                        return string.IsNullOrWhiteSpace(value) ? DBNull.Value : value.Trim();
                }

                /// <summary>
                /// Get report card list — matches ReportCard.aspx.cs BindGridView(): AMC_spReportCard with @Username only.
                /// </summary>
                public async Task<object> GetReportCardListAsync(string username)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spReportCard", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting report card list: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get score details by report card ID
                /// </summary>
                public async Task<object> GetScoreDetailsAsync(string reportCardId)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spReportCard", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@ReportCardID", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(reportCardId, 0)
                                });

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting score details: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Delete student score
                /// </summary>
                public async Task<object> DeleteStudentScoreAsync(string reportCardId)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spDeleteStudentScore", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@ReportCardID", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(reportCardId, 0)
                                });

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error deleting student score: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Add student score
                /// </summary>
                public async Task<object> AddStudentScoreAsync(AddStudentScoreRequest request)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spAddStudentScore", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@StudentID", SqlDbType.Int)
                                {
                                        Value = ExtractStudentId(request.StudentID)
                                });
                                command.Parameters.Add(new SqlParameter("@Group", SqlDbType.VarChar, 100)
                                {
                                        Value = ToOptionalStringParameter(request.Group)
                                });
                                command.Parameters.Add(new SqlParameter("@ExamDate", SqlDbType.Date)
                                {
                                        Value = ParseExamDateParameter(request.ExamDate)
                                });
                                command.Parameters.Add(new SqlParameter("@QuizTotalScore", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.QuizTotalScore, 10)
                                });
                                command.Parameters.Add(new SqlParameter("@QuizReceivedScore", SqlDbType.Float)
                                {
                                        Value = ParseFloatParameter(request.QuizReceivedScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@QuizComments", SqlDbType.VarChar, 1000)
                                {
                                        Value = request.QuizComments ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@ClassTestTotalScore", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.ClassTestTotalScore, 10)
                                });
                                command.Parameters.Add(new SqlParameter("@ClassTestReceivedScore", SqlDbType.Float)
                                {
                                        Value = ParseFloatParameter(request.ClassTestReceivedScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@ClassTestComments", SqlDbType.VarChar, 1000)
                                {
                                        Value = request.ClassTestComments ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@HomeWorkTotalScore", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.HomeWorkTotalScore, 10)
                                });
                                command.Parameters.Add(new SqlParameter("@HomeWorkReceivedScore", SqlDbType.Float)
                                {
                                        Value = ParseFloatParameter(request.HomeWorkReceivedScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@HomeWorkComments", SqlDbType.VarChar, 1000)
                                {
                                        Value = request.HomeWorkComments ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@FinalExamTotalScore", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.FinalExamTotalScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@FinalExamReceivedScore", SqlDbType.Float)
                                {
                                        Value = ParseFloatParameter(request.FinalExamReceivedScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@FinalExamComments", SqlDbType.VarChar, 1000)
                                {
                                        Value = request.FinalExamComments ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@PlacementTestTotalScore", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.PlacementTestTotalScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@PlacementTestReceivedScore", SqlDbType.Float)
                                {
                                        Value = ParseFloatParameter(request.PlacementTestReceivedScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@PlacementTestComments", SqlDbType.VarChar, 1000)
                                {
                                        Value = request.PlacementTestComments ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@Session", SqlDbType.VarChar, 30)
                                {
                                        Value = ToOptionalStringParameter(request.Session)
                                });

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error adding student score: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Update student score
                /// </summary>
                public async Task<object> UpdateStudentScoreAsync(UpdateStudentScoreRequest request)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spUpdateStudentScore", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@ReportID", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.ReportID, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@Group", SqlDbType.VarChar, 100)
                                {
                                        Value = ToOptionalStringParameter(request.Group)
                                });
                                command.Parameters.Add(new SqlParameter("@ExamDate", SqlDbType.Date)
                                {
                                        Value = ParseExamDateParameter(request.ExamDate)
                                });
                                command.Parameters.Add(new SqlParameter("@Type", SqlDbType.VarChar, 100)
                                {
                                        Value = request.Type ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@TotalScore", SqlDbType.Int)
                                {
                                        Value = ParseIntParameter(request.TotalScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@ReceivedScore", SqlDbType.Float)
                                {
                                        Value = ParseFloatParameter(request.ReceivedScore, 0)
                                });
                                command.Parameters.Add(new SqlParameter("@Comments", SqlDbType.VarChar, 500)
                                {
                                        Value = request.Comments ?? string.Empty
                                });

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error updating student score: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get semester report
                /// </summary>
                public async Task<object> GetSemesterReportAsync(string username, string @class)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spReportCard_SemesterReport", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
                                command.Parameters.Add(new SqlParameter("@Class", @class ?? ""));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting semester report: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get summary report
                /// </summary>
                public async Task<object> GetSummaryReportAsync(string username, string reportDate, string @class)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spReportCard_SummaryReport", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", SqlDbType.VarChar, 100)
                                {
                                        Value = username ?? string.Empty
                                });
                                command.Parameters.Add(new SqlParameter("@ReportDate", SqlDbType.Date)
                                {
                                        Value = ParseExamDateParameter(reportDate)
                                });
                                command.Parameters.Add(new SqlParameter("@Class", SqlDbType.VarChar, 100)
                                {
                                        Value = string.IsNullOrWhiteSpace(@class) ? "ALL" : @class.Trim()
                                });

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting summary report: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get class list by instructor
                /// </summary>
                public async Task<object> GetClassListByInstructorAsync(string username)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spSelectClassListbyInstructor", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting class list by instructor: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get student list for dropdown
                /// </summary>
                public async Task<object> GetStudentListAsync(string username)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spSelectStudentListbyUserName", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting student list: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get class list for dropdown
                /// </summary>
                public async Task<object> GetClassListAsync(string username)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spSelectClassListbyInstructor", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting class list: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get report date list
                /// </summary>
                public async Task<object> GetReportDateListAsync(string username)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spSelectReportCardDate", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting report date list: {ex.Message}", ex);
                        }
                }

                /// <summary>
                /// Get class schedule (exam dates)
                /// </summary>
                public async Task<object> GetClassScheduleAsync(string username, string type)
                {
                        if (string.IsNullOrWhiteSpace(_connectionString))
                            throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spSelectScheduleLookup", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
                                command.Parameters.Add(new SqlParameter("@DisplayValue", type ?? "date"));

                                var dataTable = new DataTable();
                                using var adapter = new SqlDataAdapter(command);
                                adapter.Fill(dataTable);

                                return dataTable;
                        }
                        catch (Exception ex)
                        {
                                throw new Exception($"Error getting class schedule: {ex.Message}", ex);
                        }
                }
        }
}