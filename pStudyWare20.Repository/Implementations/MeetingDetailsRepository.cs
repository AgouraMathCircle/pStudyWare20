using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for meeting details data access operations
    /// </summary>
    public class MeetingDetailsRepository : IMeetingDetailsRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public MeetingDetailsRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get meeting schedule list (matches legacy - pass "0" as string for all records)
        /// </summary>
        public async Task<object> GetMeetingScheduleListAsync(string rowId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_tblMeetingSchedule_Select", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Legacy passes "0" as string to get all records (MeetingDetails.aspx.cs line 57)
                command.Parameters.Add(new SqlParameter("@RowID", rowId));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting meeting schedule list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get specific meeting schedule by Row ID
        /// </summary>
        public async Task<object> GetMeetingScheduleByIdAsync(string rowId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_tblMeetingSchedule_Select", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@RowID", rowId));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting meeting schedule by ID: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Insert or update meeting schedule
        /// </summary>
        public async Task<object> UpsertMeetingScheduleAsync(MeetingSchedule meetingSchedule)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_tblMeetingSchedule_Insert", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@RowID", meetingSchedule.RowId));
                command.Parameters.Add(new SqlParameter("@ChapterID", meetingSchedule.ChapterId));
                command.Parameters.Add(new SqlParameter("@Class", meetingSchedule.Class));
                command.Parameters.Add(new SqlParameter("@Section", meetingSchedule.Section));
                command.Parameters.Add(new SqlParameter("@MeetingProviderURL", meetingSchedule.MeetingProviderUrl));
                command.Parameters.Add(new SqlParameter("@MeetingURL", meetingSchedule.MeetingUrl));
                command.Parameters.Add(new SqlParameter("@MeetingID", meetingSchedule.MeetingId));
                command.Parameters.Add(new SqlParameter("@Passcode", meetingSchedule.Passcode));
                command.Parameters.Add(new SqlParameter("@AdminLogin", meetingSchedule.AdminLogin));
                command.Parameters.Add(new SqlParameter("@AdminPassCode", meetingSchedule.AdminPassCode));
                command.Parameters.Add(new SqlParameter("@IncludeSection", meetingSchedule.IncludeSection ? "1" : "0"));
                command.Parameters.Add(new SqlParameter("@Active", meetingSchedule.Active ? "1" : "0"));
                command.Parameters.Add(new SqlParameter("@MeetingTime", meetingSchedule.MeetingTime));
                command.Parameters.Add(new SqlParameter("@MeetingDate", meetingSchedule.MeetingDate));

                await command.ExecuteNonQueryAsync();

                return new { Success = true };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error upserting meeting schedule: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get chapter locations (uses AMC_spSelectChapter stored procedure)
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

                // Add parameter if needed (check stored procedure definition)
                // command.Parameters.Add(new SqlParameter("@ActiveOnly", activeOnly));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to List<ChapterLocation> for better structure
                var chapterLocations = new List<ChapterLocation>();

                if (dataTable.Rows.Count > 0)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        chapterLocations.Add(new ChapterLocation
                        {
                            ChapterID = row["ChapterID"]?.ToString() ?? "",
                            ChapterName = row["ChapterName"]?.ToString() ?? "",
                            Location = row.Table.Columns.Contains("Location") ? row["Location"]?.ToString() ?? "" : ""
                        });
                    }
                }

                return chapterLocations;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting chapter locations: {ex.Message}", ex);
            }
        }
    }
}