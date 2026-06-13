using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Helpers;
using pStudyWare20.Repository.Interfaces;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for sent email operations
    /// </summary>
    public class SentEmailRepository : ISentEmailRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public SentEmailRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "DefaultConnection is not configured");
        }

        /// <summary>
        /// Get sent messages for a user
        /// </summary>
        public async Task<DataTable> GetSentMessagesAsync(string username)
        {
            var dataTable = new DataTable();

            try
            {
                username = await PortalUsernameResolver.ResolveAsync(_context, username);

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("AMC_spGetSentMessages", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Username", username);

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving sent messages: {ex.Message}", ex);
            }

            return dataTable;
        }

        /// <summary>
        /// Get specific message details by email ID
        /// </summary>
        public async Task<DataTable> GetMessageDetailsAsync(int emailId)
        {
            var dataTable = new DataTable();

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("AMC_spGetMessageCenter_Message", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@EmailID", emailId);

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving message details: {ex.Message}", ex);
            }

            return dataTable;
        }
    }
}
