using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Helpers;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Text.Json;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Student score data access — mirrors legacy StudentScore.aspx.cs.
    /// </summary>
    public class StudentScoreRepository : IStudentScoreRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public StudentScoreRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<string> GetStudentListAsync(OnlineExamStudentListRequest request)
        {
            var username = await PortalUsernameResolver.ResolveAsync(_context, request.Username);
            var mode = string.IsNullOrWhiteSpace(request.Type) ? "E" : request.Type.Trim();

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spSelectStudentListbyUserName", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username));

            if (string.Equals(mode, "I", StringComparison.OrdinalIgnoreCase))
            {
                command.Parameters.Add(new SqlParameter("@EmailMode", mode));
            }
            else
            {
                command.Parameters.Add(new SqlParameter("@DisplayMode", mode));
            }

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);
            return DataTableToJson(dataTable);
        }

        public async Task<string> GetStudentScoresAsync(GetStudentScoresRequest request)
        {
            var username = await PortalUsernameResolver.ResolveAsync(_context, request.Username);

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spStudentScore_Select", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);
            return DataTableToJson(dataTable);
        }

        public async Task<string> GetCurrentSessionAsync(GetCurrentSessionRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spSelectCurrentSession", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID ?? ""));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);
            return DataTableToJson(dataTable);
        }

        public async Task<string> ValidateScoreUpdateAsync(ValidateScoreUpdateRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spStudentScore_Validate", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID ?? ""));
            command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
            command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
            command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? "Quiz"));
            command.Parameters.Add(new SqlParameter("@Source", request.Source ?? "UpdateScore"));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);
            return DataTableToJson(dataTable);
        }

        public async Task<string> GetDueDateAsync(GetDueDateRequest request)
        {
            _ = request;
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            try
            {
                using var command = new SqlCommand(
                    """
                    SELECT TOP 1
                        CurrentExamDueTime,
                        ISNULL(OnlineExamDisplayChapter, '') AS OnlineExamDisplayChapter
                    FROM dbo.AMC_tblLookupSemester WITH (NOLOCK)
                    WHERE Active = 1
                    """,
                    connection)
                {
                    CommandType = CommandType.Text
                };

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var dueDateValue = reader["CurrentExamDueTime"];
                    var formatted = dueDateValue != null && dueDateValue != DBNull.Value
                        ? Convert.ToDateTime(dueDateValue).ToString("MM/dd/yyyy")
                        : string.Empty;
                    var onlineExamDisplayChapter =
                        reader["OnlineExamDisplayChapter"]?.ToString()?.Trim() ?? string.Empty;

                    return JsonSerializer.Serialize(new[]
                    {
                        new
                        {
                            DueDate = formatted,
                            OnlineExamDisplayChapter = onlineExamDisplayChapter,
                        }
                    });
                }
            }
            catch (SqlException)
            {
                // OnlineExamDisplayChapter column may not exist until DB script is applied.
            }

            using var fallbackCommand = new SqlCommand(
                "SELECT TOP 1 CurrentExamDueTime FROM dbo.AMC_tblLookupSemester WITH (NOLOCK) WHERE Active = 1",
                connection)
            {
                CommandType = CommandType.Text
            };

            var dueDate = await fallbackCommand.ExecuteScalarAsync();
            var fallbackFormatted = dueDate != null && dueDate != DBNull.Value
                ? Convert.ToDateTime(dueDate).ToString("MM/dd/yyyy")
                : string.Empty;

            return JsonSerializer.Serialize(new[] { new { DueDate = fallbackFormatted, OnlineExamDisplayChapter = "" } });
        }

        public async Task<string> AddStudentScoreAsync(AddStudentScoreRequest request)
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
                command.Parameters.Add(new SqlParameter("@QuizTotalScore", request.QuizTotalScore ?? StudentScoreDefaults.QuizTotal));
                command.Parameters.Add(new SqlParameter("@QuizReceivedScore", request.QuizReceivedScore ?? StudentScoreDefaults.ReceivedEmpty));
                command.Parameters.Add(new SqlParameter("@QuizComments", request.QuizComments ?? ""));
                command.Parameters.Add(new SqlParameter("@ClassTestTotalScore", request.ClassTestTotalScore ?? StudentScoreDefaults.ClassTestTotal));
                command.Parameters.Add(new SqlParameter("@ClassTestReceivedScore", request.ClassTestReceivedScore ?? StudentScoreDefaults.ReceivedEmpty));
                command.Parameters.Add(new SqlParameter("@ClassTestComments", request.ClassTestComments ?? ""));
                command.Parameters.Add(new SqlParameter("@HomeWorkTotalScore", request.HomeWorkTotalScore ?? StudentScoreDefaults.HomeWorkTotal));
                command.Parameters.Add(new SqlParameter("@HomeWorkReceivedScore", request.HomeWorkReceivedScore ?? StudentScoreDefaults.ReceivedEmpty));
                command.Parameters.Add(new SqlParameter("@HomeWorkComments", request.HomeWorkComments ?? ""));
                command.Parameters.Add(new SqlParameter("@FinalExamTotalScore", request.FinalExamTotalScore ?? "0"));
                command.Parameters.Add(new SqlParameter("@FinalExamReceivedScore", request.FinalExamReceivedScore ?? "0"));
                command.Parameters.Add(new SqlParameter("@FinalExamComments", request.FinalExamComments ?? ""));
                command.Parameters.Add(new SqlParameter("@PlacementTestTotalScore", request.PlacementTestTotalScore ?? "0"));
                command.Parameters.Add(new SqlParameter("@PlacementTestReceivedScore", request.PlacementTestReceivedScore ?? "0"));
                command.Parameters.Add(new SqlParameter("@PlacementTestComments", request.PlacementTestComments ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);
                return DataTableToJson(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding student score: {ex.GetBaseException().Message}", ex);
            }
        }

        public async Task<string> UpdateStudentScoreAsync(UpdateStudentScoreRequest request)
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
            return DataTableToJson(dataTable);
        }

        private static string DataTableToJson(DataTable dataTable)
        {
            var list = new List<Dictionary<string, object?>>();
            foreach (DataRow row in dataTable.Rows)
            {
                var dict = new Dictionary<string, object?>();
                foreach (DataColumn col in dataTable.Columns)
                {
                    var val = row[col];
                    dict[col.ColumnName] = val == DBNull.Value ? null : val;
                }
                list.Add(dict);
            }
            return JsonSerializer.Serialize(list);
        }
    }
}
