using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for timesheet data access operations
    /// </summary>
    public class TimesheetRepository : ITimesheetRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public TimesheetRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Remove timesheet entry using stored procedure
        /// </summary>
        public async Task<string> TimeSheetEntryRemoveAsync(TimeSheetID request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spTimeSheetEntryRemove", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@LogID", request.Logid));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error removing timesheet entry: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get timesheet list using stored procedure
        /// </summary>
        public async Task<string> GetTimesheetListAsync(UserName request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetTimesheetList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.userName ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting timesheet list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Add timesheet entry using stored procedure
        /// </summary>
        public async Task<bool> TimeSheetEntryAsync(TimeSheetEntry request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spTimeSheetEntry", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@LogID", request.LogID ?? ""));
                command.Parameters.Add(new SqlParameter("@UserName", request.UserName ?? ""));
                command.Parameters.Add(new SqlParameter("@TaskName", request.TaskName ?? ""));
                command.Parameters.Add(new SqlParameter("@VolunteerDate", request.VolunteerDate));
                command.Parameters.Add(new SqlParameter("@StartHour", request.StartHour ?? ""));
                command.Parameters.Add(new SqlParameter("@Startmin", request.Startmin ?? ""));
                command.Parameters.Add(new SqlParameter("@StartType", request.StartType ?? ""));

                var result = await command.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding timesheet entry: {ex.Message}", ex);
            }
        }
    }
}