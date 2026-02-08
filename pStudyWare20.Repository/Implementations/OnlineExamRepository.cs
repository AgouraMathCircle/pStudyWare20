using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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
        /// Get student list using stored procedure
        /// </summary>
        public async Task<string> GetStudentListAsync(OnlineExamStudentListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));
                command.Parameters.Add(new SqlParameter("@Mode", request.Type ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return DataTableToJson(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting online exam student list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Converts DataTable to JSON-serializable list (avoids serializing System.Type in DataColumn.DataType).
        /// </summary>
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
            return System.Text.Json.JsonSerializer.Serialize(list);
        }

        /// <summary>
        /// Get online exam questions using stored procedure
        /// </summary>
        public async Task<string> GetOnlineExamQuestionsAsync(OnlineExamQuestionsRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetOnlineExamQuestions", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting online exam questions: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Validate score update using stored procedure
        /// </summary>
        public async Task<string> ValidateScoreUpdateAsync(OnlineExamScoreValidationRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spValidateOnlineExamScoreUpdate", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                command.Parameters.Add(new SqlParameter("@Source", request.Source ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error validating online exam score update: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        public async Task<string> GetCurrentSessionAsync(OnlineExamCurrentSessionRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetOnlineExamCurrentSession", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting online exam current session: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get student scores using stored procedure
        /// </summary>
        public async Task<string> GetStudentScoresAsync(OnlineExamStudentScoresRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetOnlineExamStudentScores", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting online exam student scores: {ex.Message}", ex);
            }
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

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error submitting online exam: {ex.Message}", ex);
            }
        }
    }
}