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
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public TimeSheetTrackingRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get timesheet tracking list for a user
        /// </summary>
        public async Task<DataTable> GetTimeSheetTrackingListAsync(string username)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetTimeSheetTrackingList", connection)
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
        /// Get timesheet tracking entry by LogID for editing
        /// </summary>
        public async Task<DataTable> GetTimeSheetTrackingForEditAsync(string username)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetTimeSheetTrackingForEdit", connection)
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
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteTimeSheetTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@LogID", logId));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
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
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpsertTimeSheetTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@LogID", request.LogID));
                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));
                command.Parameters.Add(new SqlParameter("@TaskName", request.TaskName ?? ""));
                command.Parameters.Add(new SqlParameter("@VolunteerDate", request.VolunteerDate));
                command.Parameters.Add(new SqlParameter("@StartHour", request.StartHour ?? ""));
                command.Parameters.Add(new SqlParameter("@StartMin", request.StartMin ?? ""));
                command.Parameters.Add(new SqlParameter("@StartType", request.StartType ?? ""));
                command.Parameters.Add(new SqlParameter("@EndHour", request.EndHour ?? ""));
                command.Parameters.Add(new SqlParameter("@EndMin", request.EndMin ?? ""));
                command.Parameters.Add(new SqlParameter("@EndType", request.EndType ?? ""));
                command.Parameters.Add(new SqlParameter("@TaskDescription", request.TaskDescription ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error upserting timesheet tracking: {ex.Message}", ex);
            }
        }
    }
}