using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Text.Json;

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
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        private static int GetInt(DataRow row, string column)
        {
            if (!row.Table.Columns.Contains(column) || row[column] == null || row[column] == DBNull.Value) return 0;
            if (row[column] is int i) return i;
            return int.TryParse(row[column].ToString(), out var n) ? n : 0;
        }

        private static string GetString(DataRow row, string column)
        {
            if (!row.Table.Columns.Contains(column) || row[column] == null || row[column] == DBNull.Value) return string.Empty;
            return row[column].ToString() ?? string.Empty;
        }

        private static bool GetBool(DataRow row, string column)
        {
            if (!row.Table.Columns.Contains(column) || row[column] == null || row[column] == DBNull.Value) return false;
            if (row[column] is bool b) return b;
            var s = row[column].ToString();
            return string.Equals(s, "1", StringComparison.Ordinal) || string.Equals(s, "true", StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Get alert list using stored procedure
        /// </summary>
        public async Task<string> GetAlertListAsync(GetAlertListRequest request)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("Apps_GetAlertList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                if (!string.IsNullOrEmpty(request.RowID))
                    command.Parameters.Add(new SqlParameter("@RowID", request.RowID));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                var list = new List<AlertListRowDto>();
                foreach (DataRow row in dataTable.Rows)
                {
                    list.Add(new AlertListRowDto
                    {
                        MessageID = GetInt(row, "MessageID"),
                        RowID = GetInt(row, "RowID"),
                        PostedBy = GetString(row, "PostedBy"),
                        PostedDate = GetString(row, "PostedDate"),
                        AlertDate = GetString(row, "AlertDate"),
                        Description = GetString(row, "Description"),
                        Message = GetString(row, "Message"),
                        Active = GetBool(row, "Active")
                    });
                }
                return JsonSerializer.Serialize(list);
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
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spPostMessage_Insert", connection)
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
        /// Delete post message (legacy used direct SQL)
        /// </summary>
        public async Task<string> DeletePostMessageAsync(DeletePostMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("DELETE FROM AMC_tblPostMessage WHERE MessageID = @MessageID", connection)
                {
                    CommandType = CommandType.Text
                };

                command.Parameters.Add(new SqlParameter("@MessageID", request.MessageID ?? ""));

                await command.ExecuteNonQueryAsync();

                return "{\"deleted\":true}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting post message: {ex.Message}", ex);
            }
        }
    }
}