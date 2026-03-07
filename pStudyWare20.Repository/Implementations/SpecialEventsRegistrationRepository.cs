using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for special events registration data access operations
    /// </summary>
    public class SpecialEventsRegistrationRepository : ISpecialEventsRegistrationRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public SpecialEventsRegistrationRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        /// <summary>
        /// Get special events registration list
        /// </summary>
        public async Task<object> GetSpecialEventsRegistrationListAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectSpecialEventsRegistration", connection)
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
                throw new Exception($"Error getting special events registration list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete special events registration application
        /// </summary>
        public async Task<object> DeleteSpecialEventsRegistrationAsync(string requestId)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteSpecialEventsRegistration", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@RequestID", requestId));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting special events registration: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get special events registration list for Excel export
        /// </summary>
        public async Task<object> GetSpecialEventsRegistrationListForExportAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectSpecialEventsRegistration", connection)
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
                throw new Exception($"Error getting special events registration list for export: {ex.Message}", ex);
            }
        }
    }
}