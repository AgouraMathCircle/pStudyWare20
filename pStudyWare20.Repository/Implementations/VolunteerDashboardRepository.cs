using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for volunteer dashboard data access operations
    /// </summary>
    public class VolunteerDashboardRepository : IVolunteerDashboardRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public VolunteerDashboardRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get time tracking list for volunteer dashboard
        /// </summary>
        public async Task<DataTable> GetTimeTrackingListAsync(string username)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetTimeTrackingList", connection)
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
                throw new Exception($"Error getting time tracking list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get time tracking list with date range filter
        /// </summary>
        public async Task<DataTable> GetTimeTrackingListWithDateRangeAsync(string username, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetTimeTrackingListWithDateRange", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
                command.Parameters.Add(new SqlParameter("@StartDate", startDate ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@EndDate", endDate ?? (object)DBNull.Value));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting time tracking list with date range: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get time tracking statistics for volunteer dashboard
        /// </summary>
        public async Task<DataTable> GetTimeTrackingStatsAsync(string username, int? year = null, int? month = null)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetTimeTrackingStats", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username ?? ""));
                command.Parameters.Add(new SqlParameter("@Year", year ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@Month", month ?? (object)DBNull.Value));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting time tracking stats: {ex.Message}", ex);
            }
        }
    }
}