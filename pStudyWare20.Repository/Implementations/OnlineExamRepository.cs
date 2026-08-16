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

                var semester = string.Empty;
                var scoreId = request.ScoreID ?? "0";

                if (scoreId == "0")
                {
                    using var deleteCmd = new SqlCommand("AMC_spDeleteExistingReport", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    deleteCmd.Parameters.Add(new SqlParameter("@StudentID", int.Parse(request.StudentID)));
                    deleteCmd.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                    deleteCmd.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                    deleteCmd.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

                    using var reader = await deleteCmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        semester = reader["CurrentSemester"]?.ToString()?.Trim() ?? string.Empty;
                    }
                    await reader.CloseAsync();
                }

                var answerTable = BuildAnswerTable(request, semester);

                using var command = new SqlCommand("AMC_spSubmitOnlineExam", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

                var answersParam = new SqlParameter("@Answers", SqlDbType.Structured)
                {
                    TypeName = "dbo.AMC_tblTypeExamMasterAnswerKey",
                    Value = answerTable
                };
                command.Parameters.Add(answersParam);
                command.Parameters.Add(new SqlParameter("@ScoreID", scoreId));

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

        private static DataTable BuildAnswerTable(SubmitOnlineExamRequest request, string semester)
        {
            var dt = new DataTable();
            dt.Columns.Add("StudentID", typeof(int));
            dt.Columns.Add("Semester", typeof(string));
            dt.Columns.Add("Class", typeof(string));
            dt.Columns.Add("Question", typeof(int));
            dt.Columns.Add("AnswerKey", typeof(string));
            dt.Columns.Add("Points", typeof(int));
            dt.Columns.Add("CreatedDate", typeof(DateTime));
            dt.Columns.Add("ExamType", typeof(string));
            dt.Columns.Add("Session", typeof(string));

            var studentId = int.Parse(request.StudentID);

            foreach (var answer in request.Answers ?? new List<StudentOnlineExamAnswer>())
            {
                if (string.IsNullOrWhiteSpace(answer.AnswerKey))
                {
                    continue;
                }

                var rowSemester = !string.IsNullOrWhiteSpace(answer.CurrentSemester)
                    ? answer.CurrentSemester
                    : semester;

                dt.Rows.Add(
                    answer.StudentID > 0 ? answer.StudentID : studentId,
                    rowSemester,
                    request.Class ?? answer.Class,
                    answer.Question,
                    answer.AnswerKey,
                    0,
                    DateTime.Now,
                    request.ExamType ?? answer.ExamType,
                    request.Session ?? answer.Session
                );
            }

            return dt;
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