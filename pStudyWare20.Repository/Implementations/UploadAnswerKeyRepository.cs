using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    public class UploadAnswerKeyRepository : IUploadAnswerKeyRepository
    {
        private readonly string _connectionString;

        public UploadAnswerKeyRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _ = context;
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        private static int GetInt(DataRow row, params string[] columns)
        {
            foreach (var column in columns)
            {
                if (!row.Table.Columns.Contains(column) || row[column] == DBNull.Value || row[column] == null)
                    continue;
                if (row[column] is int i) return i;
                if (int.TryParse(row[column].ToString(), out var n)) return n;
            }
            return 0;
        }

        private static string GetString(DataRow row, params string[] columns)
        {
            foreach (var column in columns)
            {
                if (!row.Table.Columns.Contains(column) || row[column] == DBNull.Value || row[column] == null)
                    continue;
                return row[column].ToString()?.Trim() ?? string.Empty;
            }
            return string.Empty;
        }

        public async Task<List<ExamMasterQuestion>> GetExamMasterListAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            var list = new List<ExamMasterQuestion>();
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new SqlCommand("AMC_spExamMaster_Select", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);

            foreach (DataRow row in dataTable.Rows)
            {
                var questionPaper = GetString(row, "QuestionPaper", "mDocName");
                list.Add(new ExamMasterQuestion
                {
                    QuestionID = GetInt(row, "QuestionID"),
                    Class = GetString(row, "Class"),
                    ExamType = GetString(row, "ExamType"),
                    Question = GetString(row, "Question"),
                    AnswerKey = GetString(row, "AnswerKey"),
                    Points = GetInt(row, "Points"),
                    Session = GetString(row, "mSession", "Session"),
                    Category = GetString(row, "Category"),
                    QuestionPaper = questionPaper,
                    Semester = GetString(row, "Semester"),
                });
            }

            return DeduplicateByQuestionId(list);
        }

        public async Task<string> LookupQuestionPaperAsync(
            string classCode,
            string examType,
            string session,
            string semester)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            if (string.IsNullOrWhiteSpace(classCode)
                || string.IsNullOrWhiteSpace(examType)
                || string.IsNullOrWhiteSpace(session))
            {
                return string.Empty;
            }

            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var resolvedSemester = semester?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(resolvedSemester))
            {
                resolvedSemester = await GetActiveSemesterAsync(connection) ?? string.Empty;
            }

            if (string.IsNullOrWhiteSpace(resolvedSemester))
            {
                return string.Empty;
            }

            const string sql = """
                SELECT TOP 1 DM.[mDocName]
                FROM [dbo].[AMC_tblDocuments] DM WITH (NOLOCK)
                WHERE DM.[mBatch] = @Class
                  AND DM.[mDescription] = @ExamType
                  AND DM.[mSession] = @Session
                  AND DM.[mDocSession] = @Semester
                  AND ISNULL(DM.[Active], 1) = 1
                ORDER BY DM.[mDocID] DESC
                """;

            await using var command = new SqlCommand(sql, connection);
            command.Parameters.Add(new SqlParameter("@Class", classCode.Trim()));
            command.Parameters.Add(new SqlParameter("@ExamType", examType.Trim()));
            command.Parameters.Add(new SqlParameter("@Session", session.Trim()));
            command.Parameters.Add(new SqlParameter("@Semester", resolvedSemester));

            var result = await command.ExecuteScalarAsync();
            return result == null || result == DBNull.Value
                ? string.Empty
                : result.ToString()?.Trim() ?? string.Empty;
        }

        private static async Task<string?> GetActiveSemesterAsync(SqlConnection connection)
        {
            const string sql = """
                SELECT TOP 1 semester
                FROM [dbo].[AMC_tblLookupSemester] WITH (NOLOCK)
                WHERE Active = 1
                """;

            await using var command = new SqlCommand(sql, connection);
            var result = await command.ExecuteScalarAsync();
            return result == null || result == DBNull.Value
                ? null
                : result.ToString()?.Trim();
        }

        private static List<ExamMasterQuestion> DeduplicateByQuestionId(List<ExamMasterQuestion> list)
        {
            var seen = new HashSet<int>();
            var deduped = new List<ExamMasterQuestion>(list.Count);

            foreach (var item in list)
            {
                if (!seen.Add(item.QuestionID))
                    continue;

                deduped.Add(item);
            }

            return deduped;
        }

        public async Task DeleteExamQuestionAsync(string questionId)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new SqlCommand("AMC_spExamMaster_Delete", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@QuestionID", questionId ?? ""));
            await command.ExecuteNonQueryAsync();
        }

        public async Task InsertExamMasterRowAsync(
            string classCode,
            string session,
            string examType,
            string answerType,
            string createdBy,
            string question,
            string answerKey,
            string points,
            string category)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            await using var command = new SqlCommand("AMC_spExamMaster_Insert", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Class", classCode ?? ""));
            command.Parameters.Add(new SqlParameter("@mSession", session ?? ""));
            command.Parameters.Add(new SqlParameter("@ExamType", examType ?? ""));
            command.Parameters.Add(new SqlParameter("@AnswerType", answerType ?? ""));
            command.Parameters.Add(new SqlParameter("@CreatedBy", createdBy ?? ""));
            command.Parameters.Add(new SqlParameter("@Question", question ?? ""));
            command.Parameters.Add(new SqlParameter("@AnswerKey", answerKey ?? ""));
            command.Parameters.Add(new SqlParameter("@Points", points ?? "0"));
            command.Parameters.Add(new SqlParameter("@Category", category ?? ""));
            command.Parameters.Add(new SqlParameter("@AnswerDescription", answerKey ?? ""));
            await command.ExecuteNonQueryAsync();
        }
    }
}
