using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Helpers;
using pStudyWare20.Repository.Interfaces;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for Email Manager data access operations
    /// </summary>
    public class EmailManagerRepository : IEmailManagerRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public EmailManagerRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get messages for a user (inbox) using AMC_spGetMessageCenter
        /// </summary>
        public async Task<DataTable> GetMessagesAsync(string username, string? mode = null)
        {
            try
            {
                username = await PortalUsernameResolver.ResolveAsync(_context, username);

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetMessageCenter", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 60,
                };

                command.Parameters.Add(new SqlParameter("@Username", username));

                if (!string.IsNullOrEmpty(mode))
                {
                    command.Parameters.Add(new SqlParameter("@Mode", mode));
                }

                var dataTable = new DataTable();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    dataTable.Load(reader);
                }

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting messages: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get a specific message by ID using AMC_spGetMessageCenter_Message
        /// </summary>
        public async Task<DataSet> GetMessageByIdAsync(int emailId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetMessageCenter_Message", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 30,
                };

                command.Parameters.Add(new SqlParameter("@EmailID", SqlDbType.Int) { Value = emailId });

                var dataTable = new DataTable();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    dataTable.Load(reader);
                }

                var dataSet = new DataSet();
                dataSet.Tables.Add(dataTable);
                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting message by ID: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Send a new message or reply using AMC_spAddEmailTracking
        /// </summary>
        public async Task<DataSet> SendMessageAsync(string sendTo, string sendFrom, string subject, string message,
            string sendBy, int id, string mode, string chapterId)
        {
            try
            {
                sendFrom = await PortalUsernameResolver.ResolveAsync(_context, sendFrom);

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddEmailTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                if (!int.TryParse(chapterId, out var chapterIdValue))
                {
                    chapterIdValue = 1;
                }

                command.Parameters.Add(new SqlParameter("@SendTo", sendTo));
                command.Parameters.Add(new SqlParameter("@SendFrom", sendFrom));
                command.Parameters.Add(new SqlParameter("@Subject", subject));
                command.Parameters.Add(new SqlParameter("@Message", message));
                command.Parameters.Add(new SqlParameter("@SendBy", sendBy));
                command.Parameters.Add(new SqlParameter("@ID", id));
                command.Parameters.Add(new SqlParameter("@Mode", mode));
                command.Parameters.Add(new SqlParameter("@ChapterID", chapterIdValue));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error sending message: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Update message status using AMC_spUpdateAddEmailTracking
        /// </summary>
        public async Task<DataSet> UpdateMessageStatusAsync(string mode, string trackingId, string sendTo)
        {
            try
            {
                sendTo = await PortalUsernameResolver.ResolveAsync(_context, sendTo);

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Legacy AMC_spUpdateAddEmailTracking mode "T" incorrectly sets Status='V'.
                // Inbox lists exclude Status='A', so soft-delete must archive as 'A'.
                if (string.Equals(mode, "T", StringComparison.OrdinalIgnoreCase))
                {
                    if (!int.TryParse(trackingId, out var id) || id <= 0)
                    {
                        throw new Exception("A valid tracking ID is required to delete a message.");
                    }

                    using var deleteCommand = new SqlCommand(
                        "UPDATE [dbo].[AMC_tblEmailTracking] SET [Status] = 'A' WHERE [ID] = @TrackingID",
                        connection);

                    deleteCommand.Parameters.Add(new SqlParameter("@TrackingID", SqlDbType.Int) { Value = id });

                    var rowsAffected = await deleteCommand.ExecuteNonQueryAsync();
                    if (rowsAffected == 0)
                    {
                        throw new Exception("Message not found or could not be deleted.");
                    }

                    return new DataSet();
                }

                using var command = new SqlCommand("AMC_spUpdateAddEmailTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Mode", mode));
                command.Parameters.Add(new SqlParameter("@TrackingID", SqlDbType.Int)
                {
                    Value = int.TryParse(trackingId, out var trackingIdValue) ? trackingIdValue : 0
                });
                command.Parameters.Add(new SqlParameter("@SendTo", sendTo));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating message status: {ex.Message}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<HashSet<int>> GetArchivedTrackingIdsAsync(IReadOnlyCollection<int> trackingIds)
        {
            var archivedIds = new HashSet<int>();
            var ids = trackingIds.Where(id => id > 0).Distinct().ToList();
            if (ids.Count == 0)
            {
                return archivedIds;
            }

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand { Connection = connection };
                var parameterNames = new List<string>(ids.Count);

                for (var i = 0; i < ids.Count; i++)
                {
                    var parameterName = $"@id{i}";
                    parameterNames.Add(parameterName);
                    command.Parameters.Add(new SqlParameter(parameterName, SqlDbType.Int) { Value = ids[i] });
                }

                command.CommandText =
                    $"SELECT ID FROM [dbo].[AMC_tblEmailTracking] WITH (NOLOCK) WHERE [Status] = 'A' AND ID IN ({string.Join(", ", parameterNames)})";

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    if (reader[0] != DBNull.Value && int.TryParse(reader[0].ToString(), out var archivedId))
                    {
                        archivedIds.Add(archivedId);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error loading archived message IDs: {ex.Message}", ex);
            }

            return archivedIds;
        }

        /// <summary>
        /// Get instructor email groups using AMC_spSelectEmailGroupbyUserName
        /// </summary>
        public async Task<DataSet> GetInstructorEmailGroupsAsync(string username)
        {
            try
            {
                username = await PortalUsernameResolver.ResolveAsync(_context, username);

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectEmailGroupbyUserName", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting instructor email groups: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get student list for email using AMC_spSelectStudentListbyUserName
        /// </summary>
        public async Task<DataSet> GetStudentListForEmailAsync(string username, string mode)
        {
            try
            {
                username = await PortalUsernameResolver.ResolveAsync(_context, username);

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentListbyUserName", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));
                command.Parameters.Add(new SqlParameter("@EmailMode", mode));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting student list for email: {ex.Message}", ex);
            }
        }

    }
}

