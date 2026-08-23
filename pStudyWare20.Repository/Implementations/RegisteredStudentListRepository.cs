using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for registered student list data access operations
    /// </summary>
    public class RegisteredStudentListRepository : IRegisteredStudentListRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public RegisteredStudentListRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get registered student list
        /// </summary>
        public async Task<object> GetRegisteredStudentListAsync(string username, string mode)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));
                if (!string.IsNullOrEmpty(mode))
                {
                    command.Parameters.Add(new SqlParameter("@Mode", mode));
                }

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting registered student list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Update student class information
        /// </summary>
        public async Task<object> UpdateStudentClassAsync(string studentId, string @class, string section, string chapterId, string location, string session)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateStudentClass", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                if (!int.TryParse(studentId, out var parsedStudentId) || parsedStudentId <= 0)
                {
                    throw new ArgumentException("Invalid student ID.");
                }

                if (!int.TryParse(chapterId, out var parsedChapterId) || parsedChapterId <= 0)
                {
                    throw new ArgumentException("Invalid chapter ID.");
                }

                command.Parameters.Add(new SqlParameter("@StudentID", SqlDbType.Int) { Value = parsedStudentId });
                command.Parameters.Add(new SqlParameter("@Class", SqlDbType.Char, 2) { Value = @class });
                command.Parameters.Add(new SqlParameter("@Section", SqlDbType.Char, 1) { Value = section });
                command.Parameters.Add(new SqlParameter("@ChapterID", SqlDbType.Int) { Value = parsedChapterId });
                command.Parameters.Add(new SqlParameter("@Location", SqlDbType.Char, 1) { Value = location });
                command.Parameters.Add(new SqlParameter("@Session", SqlDbType.Char, 5) { Value = session });

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating student class: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete student registration
        /// </summary>
        public async Task<object> DeleteStudentAsync(string studentId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteRegisterednfo", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", studentId));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting student: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get chapter locations
        /// </summary>
        public async Task<object> GetChapterLocationsAsync(string activeOnly)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectChapter", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting chapter locations: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get student list for Excel export
        /// </summary>
        public async Task<object> GetStudentListForExportAsync(string username, string mode)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));
                command.Parameters.Add(new SqlParameter("@Mode", mode));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting student list for export: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Active semester sessions for update-class (current + next, legacy drSession).
        /// </summary>
        public async Task<List<RegisteredStudentSessionOption>> GetActiveSessionOptionsAsync()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT TOP 1
                        LTRIM(RTRIM(semester)) AS Semester,
                        LTRIM(RTRIM(LastSemester)) AS LastSemester,
                        LTRIM(RTRIM(NextSemester)) AS NextSemester,
                        LTRIM(RTRIM(SemesterName)) AS SemesterName,
                        LTRIM(RTRIM(NextSemesterName)) AS NextSemesterName,
                        LTRIM(RTRIM(LastSemesterName)) AS LastSemesterName
                    FROM AMC_tblLookupSemester WITH (NOLOCK)
                    WHERE Active = 1", connection);

                using var reader = await command.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                {
                    return new List<RegisteredStudentSessionOption>();
                }

                var options = new List<RegisteredStudentSessionOption>();
                AddSessionOption(options, ReadString(reader, "Semester"), ReadString(reader, "SemesterName"));
                AddSessionOption(options, ReadString(reader, "NextSemester"), ReadString(reader, "NextSemesterName"));
                AddSessionOption(options, ReadString(reader, "LastSemester"), ReadString(reader, "LastSemesterName"));
                return options;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting active session options: {ex.Message}", ex);
            }
        }

        public async Task<string?> GetStudentChapterIdAsync(string studentId)
        {
            if (!int.TryParse(studentId, out var id) || id <= 0) return null;

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT ChapterID
                    FROM dbo.AMC_tblStudents WITH (NOLOCK)
                    WHERE colStudentID = @StudentID", connection);

                command.Parameters.Add(new SqlParameter("@StudentID", id));

                var result = await command.ExecuteScalarAsync();
                return result == null || result == DBNull.Value ? null : Convert.ToInt32(result).ToString();
            }
            catch (Exception)
            {
                return null;
            }
        }
        
        public async Task<string?> GetStudentEmailAsync(string studentId)
        {
            if (!int.TryParse(studentId, out var id) || id <= 0) return null;

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT LTRIM(RTRIM(TU.coluserEmail))
                    FROM dbo.AMC_tblStudents TS WITH (NOLOCK)
                    INNER JOIN dbo.AMC_tblUsers TU WITH (NOLOCK) ON TU.coluserID = TS.colParentID
                    WHERE TS.colStudentID = @StudentID", connection);

                command.Parameters.Add(new SqlParameter("@StudentID", id));

                var result = await command.ExecuteScalarAsync();
                return result as string;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>Chapter's StudentEmailGroup, for Google Workspace group sync.</summary>
        public async Task<string?> GetChapterStudentEmailGroupAsync(string chapterId)
        {
            if (!int.TryParse(chapterId, out var id) || id <= 0) return null;

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT LTRIM(RTRIM(StudentEmailGroup))
                    FROM dbo.AMC_ChapterMaster WITH (NOLOCK)
                    WHERE ChapterID = @ChapterID", connection);

                command.Parameters.Add(new SqlParameter("@ChapterID", id));

                var result = await command.ExecuteScalarAsync();
                return result as string;
            }
            catch (Exception)
            {
                return null;
            }
        }

        private static string ReadString(SqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? "" : reader.GetString(ordinal).Trim();
        }

        private static void AddSessionOption(
            List<RegisteredStudentSessionOption> options,
            string value,
            string? label = null)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return;
            }

            if (options.Any(option => option.Value.Equals(value, StringComparison.OrdinalIgnoreCase)))
            {
                return;
            }

            options.Add(new RegisteredStudentSessionOption
            {
                Value = value.Trim(),
                Label = string.IsNullOrWhiteSpace(label) ? value.Trim() : label.Trim(),
            });
        }
    }
}