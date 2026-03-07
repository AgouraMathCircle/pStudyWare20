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

                return new StudentWaitingListResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    StudentWaitingList = list
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
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateStudentWaitingListStatus", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@Section", request.Section ?? ""));
                command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID ?? ""));
                command.Parameters.Add(new SqlParameter("@Location", request.Location ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@ApplicationStatus", request.ApplicationStatus ?? ""));

                var result = await command.ExecuteNonQueryAsync();

                return new OperationResponse
                {
                    IsSuccess = result > 0,
                    ErrorMessage = result > 0 ? "" : "No records updated",
                    Message = result > 0 ? "Status updated successfully" : "No records updated"
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

                var result = await command.ExecuteNonQueryAsync();

                return new OperationResponse
                {
                    IsSuccess = result > 0,
                    ErrorMessage = result > 0 ? "" : "No records deleted",
                    Message = result > 0 ? "Student deleted successfully" : "No records deleted"
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
        /// Get chapter location
        /// </summary>
        public async Task<ChapterLocationResponse> GetChapterLocationAsync(GetChapterLocationRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetChapterLocation", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Mode", request.Mode ?? "N"));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return new ChapterLocationResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    ChapterLocations = new List<ChapterLocation>() // Convert DataTable to List<ChapterLocation>
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

                return new PasswordResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    Password = "" // Extract password from DataTable
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

        /// <summary>
        /// Export to excel
        /// </summary>
        public async Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spExportToExcel", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return new ExportExcelResponse
                {
                    IsSuccess = true,
                    FileName = "StudentWaitingList.xlsx",
                    FileContent = Array.Empty<byte>(),
                    ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ErrorMessage = ""
                };
            }
            catch (Exception ex)
            {
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    FileName = "",
                    FileContent = Array.Empty<byte>(),
                    ContentType = "",
                    ErrorMessage = $"Error exporting to excel: {ex.Message}"
                };
            }
        }
    }
}