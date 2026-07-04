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
    /// Repository implementation for online exam data access operations
    /// </summary>
    public class OnlineExamRepository : IOnlineExamRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public OnlineExamRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get student list — mirrors legacy OnlineExam.aspx BindStudentList(..., "E").
        /// </summary>
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

        /// <summary>
        /// Get online exam questions using stored procedure
        /// </summary>
        public async Task<string> GetOnlineExamQuestionsAsync(OnlineExamQuestionsRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spSelectExamQuestions", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
            command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
            command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);

            return DataTableToJson(dataTable);
        }

        /// <summary>
        /// Validate score update using stored procedure
        /// </summary>
        public async Task<string> ValidateScoreUpdateAsync(OnlineExamScoreValidationRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spStudentScore_Validate", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID.ToString()));
            command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
            command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
            command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? "Quiz"));
            command.Parameters.Add(new SqlParameter("@Source", request.Source ?? "OnlineExam"));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);

            return DataTableToJson(dataTable);
        }

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        public async Task<string> GetCurrentSessionAsync(OnlineExamCurrentSessionRequest request)
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

        /// <summary>
        /// Get student scores using stored procedure
        /// </summary>
        public async Task<string> GetStudentScoresAsync(OnlineExamStudentScoresRequest request)
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

        /// <summary>
        /// Submit online exam answers using stored procedure
        /// </summary>
        public async Task<string> SubmitOnlineExamAsync(SubmitOnlineExamRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSubmitOnlineExam", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Answers", request.Answers ?? new List<StudentOnlineExamAnswer>()));
                command.Parameters.Add(new SqlParameter("@ScoreID", request.ScoreID ?? "0"));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return DataTableToJson(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error submitting online exam: {ex.GetBaseException().Message}", ex);
            }
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