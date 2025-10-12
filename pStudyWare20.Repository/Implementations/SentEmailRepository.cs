using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for sent email data access operations
    /// </summary>
    public class SentEmailRepository : ISentEmailRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public SentEmailRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get sent messages using stored procedure
        /// </summary>
        public async Task<string> GetSentMessagesAsync(GetSentMessagesRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetSentMessages", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting sent messages: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get message using stored procedure
        /// </summary>
        public async Task<string> GetMessageAsync(GetMessageRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetMessage", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@EmailId", request.EmailId ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting message: {ex.Message}", ex);
            }
        }
    }
}