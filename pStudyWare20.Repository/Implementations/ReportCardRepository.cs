using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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
                        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
                }

                /// <summary>
                /// Get report card list
                /// </summary>
                public async Task<object> GetReportCardListAsync(string username)
                {
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetReportCardList", connection)
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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetScoreDetails", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@ReportCardID", reportCardId ?? ""));

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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spDeleteStudentScore", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@ReportCardID", reportCardId ?? ""));

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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spAddStudentScore", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID ?? ""));
                                command.Parameters.Add(new SqlParameter("@QuizTotalScore", request.QuizTotalScore ?? "5"));
                                command.Parameters.Add(new SqlParameter("@QuizReceivedScore", request.QuizReceivedScore ?? ""));
                                command.Parameters.Add(new SqlParameter("@QuizComments", request.QuizComments ?? ""));
                                command.Parameters.Add(new SqlParameter("@ClassTestTotalScore", request.ClassTestTotalScore ?? "20"));
                                command.Parameters.Add(new SqlParameter("@ClassTestReceivedScore", request.ClassTestReceivedScore ?? ""));
                                command.Parameters.Add(new SqlParameter("@ClassTestComments", request.ClassTestComments ?? ""));
                                command.Parameters.Add(new SqlParameter("@HomeWorkTotalScore", request.HomeWorkTotalScore ?? "10"));
                                command.Parameters.Add(new SqlParameter("@HomeWorkReceivedScore", request.HomeWorkReceivedScore ?? ""));
                                command.Parameters.Add(new SqlParameter("@HomeWorkComments", request.HomeWorkComments ?? ""));
                                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spUpdateStudentScore", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@ReportID", request.ReportID ?? ""));
                                command.Parameters.Add(new SqlParameter("@Type", request.Type ?? ""));
                                command.Parameters.Add(new SqlParameter("@TotalScore", request.TotalScore ?? ""));
                                command.Parameters.Add(new SqlParameter("@ReceivedScore", request.ReceivedScore ?? ""));
                                command.Parameters.Add(new SqlParameter("@Comments", request.Comments ?? ""));

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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetSemesterReport", connection)
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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetSummaryReport", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
                                command.Parameters.Add(new SqlParameter("@ReportDate", reportDate ?? ""));
                                command.Parameters.Add(new SqlParameter("@Class", @class ?? ""));

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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetClassListByInstructor", connection)
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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetStudentList", connection)
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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetClassList", connection)
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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetReportDateList", connection)
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
                        try
                        {
                                using var connection = new SqlConnection(_connectionString);
                                await connection.OpenAsync();

                                using var command = new SqlCommand("AMC_spGetClassSchedule", connection)
                                {
                                        CommandType = CommandType.StoredProcedure
                                };

                                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
                                command.Parameters.Add(new SqlParameter("@Type", type ?? ""));

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