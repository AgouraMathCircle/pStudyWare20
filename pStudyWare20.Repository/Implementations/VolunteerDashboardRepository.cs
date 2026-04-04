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
        /// Legacy volunteer/time sheet pages use AMC_spSelectTimeTracking (@Username only).
        /// </summary>
        private async Task<DataTable> SelectTimeTrackingAsync(string username)
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

        private static string? ResolveVolunteerDateColumn(DataTable source)
        {
            if (source?.Columns == null)
                return null;
            foreach (DataColumn col in source.Columns)
            {
                if (string.Equals(col.ColumnName, "DateVolunteer", StringComparison.OrdinalIgnoreCase))
                    return col.ColumnName;
            }
            foreach (DataColumn col in source.Columns)
            {
                if (string.Equals(col.ColumnName, "VolunteerDate", StringComparison.OrdinalIgnoreCase))
                    return col.ColumnName;
            }
            return null;
        }

        private static DataTable FilterRowsByDateRange(DataTable source, DateTime? startDate, DateTime? endDate)
        {
            if (source == null)
                return new DataTable();
            if (!startDate.HasValue && !endDate.HasValue)
                return source;

            var dateCol = ResolveVolunteerDateColumn(source);
            if (string.IsNullOrEmpty(dateCol))
                return source.Clone();

            var result = source.Clone();
            foreach (DataRow row in source.Rows)
            {
                if (row[dateCol] == DBNull.Value)
                    continue;
                var d = Convert.ToDateTime(row[dateCol]).Date;
                if (startDate.HasValue && d < startDate.Value.Date)
                    continue;
                if (endDate.HasValue && d > endDate.Value.Date)
                    continue;
                result.ImportRow(row);
            }

            return result;
        }

        private static DataTable FilterRowsByYearMonth(DataTable source, int? year, int? month)
        {
            if (source == null)
                return new DataTable();
            if (!year.HasValue && !month.HasValue)
                return source;

            var dateCol = ResolveVolunteerDateColumn(source);
            if (string.IsNullOrEmpty(dateCol))
                return source.Clone();

            var result = source.Clone();
            foreach (DataRow row in source.Rows)
            {
                if (row[dateCol] == DBNull.Value)
                    continue;
                var dt = Convert.ToDateTime(row[dateCol]);
                if (year.HasValue && dt.Year != year.Value)
                    continue;
                if (month.HasValue && dt.Month != month.Value)
                    continue;
                result.ImportRow(row);
            }

            return result;
        }

        /// <summary>
        /// Get time tracking list for volunteer dashboard
        /// </summary>
        public async Task<DataTable> GetTimeTrackingListAsync(string username)
        {
            try
            {
                return await SelectTimeTrackingAsync(username);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting time tracking list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get time tracking list with date range filter (in-memory filter; same source as legacy grid).
        /// </summary>
        public async Task<DataTable> GetTimeTrackingListWithDateRangeAsync(string username, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                var all = await SelectTimeTrackingAsync(username);
                return FilterRowsByDateRange(all, startDate, endDate);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting time tracking list with date range: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get time tracking rows for stats APIs (in-memory filter by year/month).
        /// </summary>
        public async Task<DataTable> GetTimeTrackingStatsAsync(string username, int? year = null, int? month = null)
        {
            try
            {
                var all = await SelectTimeTrackingAsync(username);
                return FilterRowsByYearMonth(all, year, month);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting time tracking stats: {ex.Message}", ex);
            }
        }
    }
}