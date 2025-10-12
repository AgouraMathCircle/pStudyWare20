using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for post message data access operations
    /// </summary>
    public class PostMessageRepository : IPostMessageRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public PostMessageRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get alert list using stored procedure
        /// </summary>
        public async Task<string> GetAlertListAsync(GetAlertListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetAlertList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@RowID", request.RowID ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting alert list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Insert or update post message using stored procedure
        /// </summary>
        public async Task<string> InsertOrUpdatePostMessageAsync(PostMessageRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spInsertOrUpdatePostMessage", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@MessageID", request.MessageID ?? "0"));
                command.Parameters.Add(new SqlParameter("@PostedBy", request.PostedBy ?? ""));
                command.Parameters.Add(new SqlParameter("@PostedDate", request.PostedDate ?? ""));
                command.Parameters.Add(new SqlParameter("@Active", request.Active ?? "0"));
                command.Parameters.Add(new SqlParameter("@Message", request.Message ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inserting or updating post message: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete post message using direct SQL
        /// </summary>
        public async Task<string> DeletePostMessageAsync(DeletePostMessageRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeletePostMessage", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@MessageID", request.MessageID ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting post message: {ex.Message}", ex);
            }
        }
    }
}