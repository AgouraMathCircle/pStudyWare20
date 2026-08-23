using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for student waiting list data access operations
    /// </summary>
    public class StudentWaitingListRepository : IStudentWaitingListRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public StudentWaitingListRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }
     
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

        private static string ResolveColumnName(DataTable table, string preferredName)
        {
            if (table?.Columns == null) return null;
            foreach (DataColumn col in table.Columns)
            {
                if (string.Equals(col.ColumnName, preferredName, StringComparison.OrdinalIgnoreCase))
                    return col.ColumnName;
            }
            return null;
        }

        private static string GetString(DataRow row, string columnName)
        {
            var actual = ResolveColumnName(row?.Table, columnName);
            if (actual == null) return "";
            var val = row[actual];
            return val == null || val == DBNull.Value ? "" : val.ToString() ?? "";
        }

        private static int GetInt(DataRow row, string columnName)
        {
            var actual = ResolveColumnName(row?.Table, columnName);
            if (actual == null) return 0;
            var val = row[actual];
            if (val == null || val == DBNull.Value) return 0;
            return int.TryParse(val.ToString(), out var n) ? n : 0;
        }

        private static DateTime GetDateTime(DataRow row, string columnName)
        {
            var actual = ResolveColumnName(row?.Table, columnName);
            if (actual == null) return default;
            var val = row[actual];
            if (val == null || val == DBNull.Value) return default;
            return DateTime.TryParse(val.ToString(), out var d) ? d : default;
        }

        /// <summary>
        /// Get student waiting list
        /// </summary>
        public async Task<StudentWaitingListResponse> GetStudentWaitingListAsync(GetStudentWaitingListRequest request)
        {
            if (request == null)
            {
                return new StudentWaitingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Request is required.",
                    StudentWaitingList = new List<StudentWaitingList>()
                };
            }
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentWaitingList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@WaitingForOnSite", request.WaitingForOnSite ?? "N"));
                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                var list = new List<StudentWaitingList>();
                foreach (DataRow row in dataTable.Rows)
                {
                    list.Add(new StudentWaitingList
                    {
                        StudentID = GetInt(row, "StudentID"),
                        StudentName = GetString(row, "StudentName"),
                        EventLocation = GetString(row, "EventLocation"),
                        Class = GetString(row, "Class"),
                        Grade = GetString(row, "Grade"),
                        School = GetString(row, "School"),
                        ParentName = GetString(row, "ParentName"),
                        PhoneNumber = GetString(row, "PhoneNumber"),
                        EmailAddress = GetString(row, "EmailAddress"),
                        EventSession = GetString(row, "EventSession"),
                        RegisteredDate = GetDateTime(row, "RegisteredDate"),
                        Password = GetString(row, "Password"),
                        City = GetString(row, "City"),
                        State = GetString(row, "State"),
                        Country = GetString(row, "Country"),
                        ApplicationStatus = GetString(row, "ApplicationStatus"),
                        StudentClassInfo = GetString(row, "StudentClassInfo"),
                    });
                }

                // Defensive dedupe: some environments can return duplicate waiting-list rows
                // for the same StudentID from the legacy SP join path. Keep the latest row only.
                var dedupedList = list
                    .Where(item => item.StudentID > 0)
                    .GroupBy(item => item.StudentID)
                    .Select(group => group
                        .OrderByDescending(item => item.RegisteredDate)
                        .First())
                    .ToList();

                // Preserve any edge rows without a valid student id.
                dedupedList.AddRange(list.Where(item => item.StudentID <= 0));

                return new StudentWaitingListResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    StudentWaitingList = dedupedList
                };
            }
            catch (Exception ex)
            {
                return new StudentWaitingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error getting student waiting list: {ex.Message}",
                    StudentWaitingList = new List<StudentWaitingList>()
                };
            }
        }

        /// <summary>
        /// Update student waiting list status
        /// </summary>
        public async Task<OperationResponse> UpdateStudentWaitingListStatusAsync(UpdateStudentWaitingListStatusRequest request)
        {
            try
            {
                if (request == null)
                {
                    return new OperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Request is required.",
                        Message = ""
                    };
                }

                if (!int.TryParse(request.StudentID, out var studentId) || studentId <= 0)
                {
                    return new OperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid student ID.",
                        Message = ""
                    };
                }

                if (!int.TryParse(request.ChapterID, out var chapterId) || chapterId <= 0)
                {
                    return new OperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Invalid chapter ID.",
                        Message = ""
                    };
                }

                var classCode = (request.Class ?? "").Trim();
                var section = (request.Section ?? "").Trim();
                var location = (request.Location ?? "").Trim();
                var session = (request.Session ?? "").Trim();

                if (string.IsNullOrWhiteSpace(classCode) ||
                    string.IsNullOrWhiteSpace(section) ||
                    string.IsNullOrWhiteSpace(location) ||
                    string.IsNullOrWhiteSpace(session))
                {
                    return new OperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Class, section, location, and session are required.",
                        Message = ""
                    };
                }

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateStudentWaitingListStatus", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Legacy StudentWaitingList.aspx.cs — AMC_spUpdateStudentWaitingListStatus: six parameters only (no @ApplicationStatus).
                command.Parameters.Add(new SqlParameter("@StudentID", SqlDbType.Int) { Value = studentId });
                command.Parameters.Add(new SqlParameter("@Class", SqlDbType.VarChar, 2) { Value = classCode });
                command.Parameters.Add(new SqlParameter("@Section", SqlDbType.Char, 1) { Value = section });
                command.Parameters.Add(new SqlParameter("@ChapterID", SqlDbType.Int) { Value = chapterId });
                command.Parameters.Add(new SqlParameter("@Location", SqlDbType.Char, 1) { Value = location });
                command.Parameters.Add(new SqlParameter("@Session", SqlDbType.VarChar, 10) { Value = session });

                // Legacy StudentWaitingList.aspx.cs uses SqlDataAdapter.Fill, not ExecuteNonQuery.
                // Many SPs return 0 / -1 from ExecuteNonQuery (NOCOUNT, result sets), which incorrectly failed the API.
                using (var adapter = new SqlDataAdapter(command))
                {
                    var ds = new DataSet();
                    adapter.Fill(ds);
                }

                return new OperationResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    Message = "You have registered the student successfully"
                };
            }
            catch (Exception ex)
            {
                return new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error updating student waiting list status: {ex.Message}",
                    Message = ""
                };
            }
        }

        /// <summary>
        /// Delete student
        /// </summary>
        public async Task<OperationResponse> DeleteStudentAsync(DeleteStudentRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteRegisterednfo", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentId ?? ""));

                using (var adapter = new SqlDataAdapter(command))
                {
                    var ds = new DataSet();
                    adapter.Fill(ds);
                }

                return new OperationResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    Message = "You have deleted the student successfully"
                };
            }
            catch (Exception ex)
            {
                return new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error deleting student: {ex.Message}",
                    Message = "Operation failed"
                };
            }
        }

        /// <summary>
        /// Active chapters from AMC_ChapterMaster (Name, Location, City).
        /// </summary>
        public async Task<ChapterLocationResponse> GetChapterLocationAsync(GetChapterLocationRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT
                        ChapterID,
                        LTRIM(RTRIM(Name)) AS Name,
                        LTRIM(RTRIM(Location)) AS Location,
                        LTRIM(RTRIM(City)) AS City,
                        VolunteerEmailGroup,
                        StudentEmailGroup
                    FROM dbo.AMC_ChapterMaster WITH (NOLOCK)
                    WHERE Active = 1
                    ORDER BY Name, Location, City", connection);

                using var reader = await command.ExecuteReaderAsync();
                var chapterLocations = new List<ChapterLocation>();
                while (await reader.ReadAsync())
                {
                    var chapterId = reader.IsDBNull(reader.GetOrdinal("ChapterID"))
                        ? 0
                        : Convert.ToInt32(reader["ChapterID"]);
                    if (chapterId <= 0)
                    {
                        continue;
                    }

                    var name = ReadTrimmedString(reader, "Name");
                    var location = ReadTrimmedString(reader, "Location");
                    var city = ReadTrimmedString(reader, "City");
                    var volunteerEmailGroup = ReadTrimmedString(reader, "VolunteerEmailGroup");
                    var studentEmailGroup = ReadTrimmedString(reader, "StudentEmailGroup");

                    chapterLocations.Add(new ChapterLocation
                    {
                        ChapterID = chapterId.ToString(),
                        ChapterName = name,
                        Location = location,
                        City = city,
                        Label = RegistrationFormatHelper.FormatLocationEmailText(name, location, city),
                        VolunteerEmailGroup = volunteerEmailGroup,
                        StudentEmailGroup = studentEmailGroup
                    });
                }

                return new ChapterLocationResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    ChapterLocations = chapterLocations
                };
            }
            catch (Exception ex)
            {
                return new ChapterLocationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error getting chapter location: {ex.Message}",
                    ChapterLocations = new List<ChapterLocation>()
                };
            }
        }

        /// <summary>
        /// Active session options from AMC_tblLookupSemester:
        /// current Semester and LastSemester only (legacy drSession).
        /// </summary>
        public async Task<StudentWaitingListSessionOptionsResponse> GetActiveSessionOptionsAsync()
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
                        LTRIM(RTRIM(LastSemesterName)) AS LastSemesterName,
                        LTRIM(RTRIM(NextSemesterName)) AS NextSemesterName
                    FROM AMC_tblLookupSemester WITH (NOLOCK)
                    WHERE Active = 1", connection);

                using var reader = await command.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                {
                    return new StudentWaitingListSessionOptionsResponse
                    {
                        IsSuccess = true,
                        ErrorMessage = "",
                        SessionOptions = new List<StudentWaitingListSessionOption>()
                    };
                }

                var options = new List<StudentWaitingListSessionOption>();
                AddSessionOption(options, ReadTrimmedString(reader, "Semester"), ReadTrimmedString(reader, "SemesterName"));
                AddSessionOption(options, ReadTrimmedString(reader, "LastSemester"), ReadTrimmedString(reader, "LastSemesterName"));

                return new StudentWaitingListSessionOptionsResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    SessionOptions = options
                };
            }
            catch (Exception ex)
            {
                return new StudentWaitingListSessionOptionsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error getting session options: {ex.Message}",
                    SessionOptions = new List<StudentWaitingListSessionOption>()
                };
            }
        }

        private static string ReadTrimmedString(SqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? string.Empty : reader.GetString(ordinal).Trim();
        }

        private static void AddSessionOption(
            List<StudentWaitingListSessionOption> options,
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

            options.Add(new StudentWaitingListSessionOption
            {
                Value = value.Trim(),
                Label = string.IsNullOrWhiteSpace(label) ? value.Trim() : label.Trim(),
            });
        }

        /// <summary>
        /// Get password
        /// </summary>
        public async Task<PasswordResponse> GetPasswordAsync(GetPasswordRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetPassword", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@EmailId", request.EmailId ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                var password = "";
                if (dataTable.Rows.Count > 0)
                {
                    password = GetString(dataTable.Rows[0], "Password");
                }

                return new PasswordResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    Password = password
                };
            }
            catch (Exception ex)
            {
                return new PasswordResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error getting password: {ex.Message}",
                    Password = ""
                };
            }
        }

        /// <inheritdoc />
        public async Task<DataTable> GetStudentWaitingListExportTableAsync(
            string username,
            string mode = "E")
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spSelectStudentList", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
            command.Parameters.Add(
                new SqlParameter("@Mode", string.IsNullOrWhiteSpace(mode) ? "E" : mode));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);

            return dataTable;
        }
    }
}