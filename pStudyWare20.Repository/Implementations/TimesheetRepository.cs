using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Implementation of timesheet data access operations using stored procedures (matches legacy controller)
    /// </summary>
    public class TimesheetRepository : ITimesheetRepository
    {
        private readonly string? _connectionString;

        public TimesheetRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection connection string not found in configuration.");
        }

        /// <summary>
        /// Remove timesheet entry using AMC_spDeleteTimeTracking stored procedure
        /// </summary>
        public async Task<string> TimeSheetEntryRemoveAsync(TimeSheetID request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spDeleteTimeTracking", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@LogID", request.Logid));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Get timesheet list using AMC_spSelectTimeTracking stored procedure
        /// </summary>
        public async Task<string> GetTimesheetListAsync(UserName request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spSelectTimeTracking", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Username", request.userName));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Add timesheet entry using AMC_spAddTimeTracking stored procedure
        /// </summary>
        public async Task<bool> TimeSheetEntryAsync(TimeSheetEntry request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spAddTimeTracking", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Add parameters matching the legacy controller exactly
                    command.Parameters.Add(new SqlParameter("@LogID", request.LogID));
                    command.Parameters.Add(new SqlParameter("@Username", request.UserName));
                    command.Parameters.Add(new SqlParameter("@TaskName", request.TaskName));
                    command.Parameters.Add(new SqlParameter("@VolunteerDate", request.VolunteerDate));
                    command.Parameters.Add(new SqlParameter("@StartHour", request.StartHour));
                    command.Parameters.Add(new SqlParameter("@Startmin", request.Startmin));
                    command.Parameters.Add(new SqlParameter("@StartType", request.StartType));
                    command.Parameters.Add(new SqlParameter("@EndHour", request.EndHour));
                    command.Parameters.Add(new SqlParameter("@Endmin", request.Endmin));
                    command.Parameters.Add(new SqlParameter("@EndType", request.EndType));
                    command.Parameters.Add(new SqlParameter("@TaskDescription", request.TaskDescription));

                    await command.ExecuteNonQueryAsync();
                    return true;
                }
            }
        }
    }
}
