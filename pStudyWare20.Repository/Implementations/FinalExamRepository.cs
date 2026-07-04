using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Final exam data access — mirrors legacy FinalExam.aspx.cs stored procedures.
    /// </summary>
    public class FinalExamRepository : IFinalExamRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public FinalExamRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<string> GetStudentListAsync(StudentListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentListbyUserName", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));
                var mode = string.IsNullOrWhiteSpace(request.Mode) ? "E" : request.Mode;
                command.Parameters.Add(new SqlParameter("@DisplayMode", mode));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return DataTableToJson(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting final exam student list: {ex.Message}", ex);
            }
        }

        public async Task<string> GetExamQuestionsAsync(ExamQuestionsRequest request)
        {
            try
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
            catch (Exception ex)
            {
                throw new Exception($"Error getting final exam questions: {ex.Message}", ex);
            }
        }

        public async Task<string> ValidateScoreUpdateAsync(ScoreValidationRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spStudentScore_Validate", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                command.Parameters.Add(new SqlParameter("@Source", request.Source ?? "OnlineExam"));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return DataTableToJson(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error validating final exam score update: {ex.Message}", ex);
            }
        }

        public async Task<string> GetCurrentSessionAsync(CurrentSessionRequest request)
        {
            try
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
            catch (Exception ex)
            {
                throw new Exception($"Error getting final exam current session: {ex.Message}", ex);
            }
        }

        public async Task<string> GetStudentScoresAsync(StudentScoresRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spStudentScore_Select", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return DataTableToJson(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting final exam student scores: {ex.Message}", ex);
            }
        }

        public async Task<string> SubmitExamAsync(SubmitExamRequest request)
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

                using var command = new SqlCommand("AMC_spStudentExamAnswerKey_Insert_All", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", int.Parse(request.StudentID)));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@CurrentSemester", semester));
                command.Parameters.Add(new SqlParameter("@ExamType", request.ExamType ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));

                var tableParam = new SqlParameter("@TempTable", SqlDbType.Structured)
                {
                    TypeName = "dbo.AMC_tblTypeExamMasterAnswerKey",
                    Value = answerTable
                };
                command.Parameters.Add(tableParam);

                var resultTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(resultTable);

                return DataTableToJson(resultTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error submitting final exam: {ex.Message}", ex);
            }
        }

        private static DataTable BuildAnswerTable(SubmitExamRequest request, string semester)
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

            foreach (var answer in request.Answers ?? new List<StudentExamAnswer>())
            {
                if (string.IsNullOrWhiteSpace(answer.AnswerKey))
                {
                    continue;
                }

                var rowSemester = !string.IsNullOrWhiteSpace(answer.Semester)
                    ? answer.Semester
                    : semester;

                dt.Rows.Add(
                    int.Parse(request.StudentID),
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
            return System.Text.Json.JsonSerializer.Serialize(list);
        }
    }
}
