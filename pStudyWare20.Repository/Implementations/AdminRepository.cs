using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for admin dashboard data access operations
    /// </summary>
    public class AdminRepository : IAdminRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public AdminRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get student list for admin dashboard
        /// </summary>
        public async Task<object> GetStudentListAsync(string username, string mode)
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
                throw new Exception($"Error getting student list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Send email notification to student group
        /// </summary>
        public async Task<bool> SendEmailNotificationAsync(string adminEmail, string studentEmailGroup, string subject, string body)
        {
            try
            {
                // This would typically use an email service
                // For now, we'll return true as the original code doesn't show error handling for email sending
                // In a real implementation, you would inject an email service and call it here
                await Task.Delay(100); // Simulate async operation
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error sending email notification: {ex.Message}", ex);
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
        /// Get user tracking list (legacy UserTracking.aspx — AMC_spSelectUserTrackingList).
        /// </summary>
        public async Task<object> GetUserTrackingListAsync(string username)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectUserTrackingList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting user tracking list: {ex.Message}", ex);
            }
        }
    }
}