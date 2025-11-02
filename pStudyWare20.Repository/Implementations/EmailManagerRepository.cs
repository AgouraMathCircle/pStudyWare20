using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
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
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetMessageCenter", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));

                if (!string.IsNullOrEmpty(mode))
                {
                    command.Parameters.Add(new SqlParameter("@Mode", mode));
                }

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

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
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@EmailID", emailId));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

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
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddEmailTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@SendTo", sendTo));
                command.Parameters.Add(new SqlParameter("@SendFrom", sendFrom));
                command.Parameters.Add(new SqlParameter("@Subject", subject));
                command.Parameters.Add(new SqlParameter("@Message", message));
                command.Parameters.Add(new SqlParameter("@SendBy", sendBy));
                command.Parameters.Add(new SqlParameter("@ID", id));
                command.Parameters.Add(new SqlParameter("@Mode", mode));
                command.Parameters.Add(new SqlParameter("@ChapterID", chapterId));

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
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateAddEmailTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Mode", mode));
                command.Parameters.Add(new SqlParameter("@TrackingID", trackingId));
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

        /// <summary>
        /// Get instructor email groups using AMC_spSelectEmailGroupbyUserName
        /// </summary>
        public async Task<DataSet> GetInstructorEmailGroupsAsync(string username)
        {
            try
            {
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

