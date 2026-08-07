using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for timesheet tracking data access operations
    /// </summary>
    public class TimeSheetTrackingRepository : ITimeSheetTrackingRepository
    {
        /// <summary>Legacy TimeSheetTracking.aspx.cs — do not use AMC_spUpsertTimeSheetTracking (not in DB).</summary>
        private const string SpAddTimeTracking = "AMC_spAddTimeTracking";

        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public TimeSheetTrackingRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        /// <summary>
        /// Legacy AMC_spSelectTimeTracking non-admin branch — only the member's own rows.
        /// Admins use MemberType A, which otherwise returns all chapter entries from the SP.
        /// </summary>
        private const string SelectMyTimeTrackingSql = """
            SELECT TT.LogId AS LogID,
                   ROW_NUMBER() OVER (ORDER BY TT.LogID) AS mLogID,
                   MM.FirstName + ' ' + MM.LastName AS Name,
                   MM.Username AS Username,
                   TT.TaskName,
                   CONVERT(VARCHAR(10), TT.DateVolunteer, 101) AS DateVolunteer,
                   LTRIM(RIGHT(CONVERT(VARCHAR(25), TT.StartTime, 100), 7)) AS StartTime,
                   LTRIM(RIGHT(CONVERT(VARCHAR(25), TT.EndTime, 100), 7)) AS EndTime,
                   CAST((DATEDIFF(MINUTE, TT.StartTime, TT.EndTime)) / 60 AS VARCHAR)
                       + ':' + CAST((DATEDIFF(MINUTE, TT.StartTime, TT.EndTime)) % 60 AS VARCHAR) AS TotalHours,
                   TT.CreatedDate,
                   TT.TaskDescription,
                   TT.Comments,
                   TT.Approved,
                   CONVERT(VARCHAR, TT.LogID) + '~#' + TT.TaskName
                       + '~#' + CONVERT(VARCHAR(10), TT.DateVolunteer, 101) AS TimeTrackInfo
            FROM AMC_tblTimeTracking TT WITH (NOLOCK)
            INNER JOIN MemberMaster MM WITH (NOLOCK) ON TT.MemberId = MM.pMemberID
            WHERE UPPER(LTRIM(MM.Username)) = UPPER(LTRIM(@Username))
              AND MM.ChapterID IN (SELECT ChapterID FROM dbo.GettingAuthorizedChapter(@Username))
            ORDER BY TT.LogID DESC
            """;

        /// <summary>
        /// Get timesheet tracking list for a user
        /// </summary>
        public async Task<DataTable> GetTimeSheetTrackingListAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectTimeTracking", connection)
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
                throw new Exception($"Error getting timesheet tracking list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get only the signed-in member's timesheet rows (admin self-service).
        /// </summary>
        public async Task<DataTable> GetMyTimeSheetTrackingListAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(SelectMyTimeTrackingSql, connection);
                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting my timesheet tracking list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get timesheet tracking entry by LogID for editing (uses same list SP; service filters by LogID).
        /// </summary>
        public async Task<DataTable> GetTimeSheetTrackingForEditAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectTimeTracking", connection)
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
                throw new Exception($"Error getting timesheet tracking for edit: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete timesheet tracking entry
        /// </summary>
        public async Task<DataTable> DeleteTimeSheetTrackingAsync(int logId)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteTimeTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@LogID", logId));

                await command.ExecuteNonQueryAsync();
                return new DataTable();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting timesheet tracking: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Add or update timesheet tracking entry
        /// </summary>
        public async Task<DataTable> UpsertTimeSheetTrackingAsync(UpsertTimeSheetTrackingRequest request)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Legacy: same params as TimeSheetTracking.aspx.cs / AMCWebServices TimeSheetController.TimeSheetEntry
                using var command = new SqlCommand(SpAddTimeTracking, connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                var logId = request.LogID.HasValue && request.LogID.Value > 0 ? request.LogID.Value : 0;
                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));
                command.Parameters.Add(new SqlParameter("@TaskName", request.TaskName ?? ""));
                command.Parameters.Add(new SqlParameter("@VolunteerDate", request.VolunteerDate));
                command.Parameters.Add(new SqlParameter("@StartHour", request.StartHour ?? ""));
                command.Parameters.Add(new SqlParameter("@Startmin", request.StartMin ?? ""));
                command.Parameters.Add(new SqlParameter("@StartType", request.StartType ?? ""));
                command.Parameters.Add(new SqlParameter("@EndHour", request.EndHour ?? ""));
                command.Parameters.Add(new SqlParameter("@Endmin", request.EndMin ?? ""));
                command.Parameters.Add(new SqlParameter("@EndType", request.EndType ?? ""));
                command.Parameters.Add(new SqlParameter("@LogID", logId));
                command.Parameters.Add(new SqlParameter("@TaskDescription", request.TaskDescription ?? ""));
                command.Parameters.Add(new SqlParameter("@ApprovalStatus", request.ApprovalStatus ?? "P"));

                await command.ExecuteNonQueryAsync();
                return new DataTable();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error saving time sheet ({SpAddTimeTracking}): {ex.Message}", ex);
            }
        }

        public async Task<bool> MemberOwnsTimeSheetEntryAsync(int logId, string username)
        {
            if (logId <= 0 || string.IsNullOrWhiteSpace(username))
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                const string sql = """
                    SELECT COUNT(1)
                    FROM AMC_tblTimeTracking TT WITH (NOLOCK)
                    INNER JOIN MemberMaster MM WITH (NOLOCK) ON TT.MemberId = MM.pMemberID
                    WHERE TT.LogId = @LogID
                      AND UPPER(LTRIM(MM.Username)) = UPPER(LTRIM(@Username))
                    """;

                using var command = new SqlCommand(sql, connection);
                command.Parameters.Add(new SqlParameter("@LogID", logId));
                command.Parameters.Add(new SqlParameter("@Username", username));

                var result = await command.ExecuteScalarAsync();
                return Convert.ToInt32(result) > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error verifying timesheet ownership: {ex.Message}", ex);
            }
        }
    }
}