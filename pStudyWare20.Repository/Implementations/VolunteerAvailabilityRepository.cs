using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for volunteer availability database operations
    /// </summary>
    public class VolunteerAvailabilityRepository : IVolunteerAvailabilityRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public VolunteerAvailabilityRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Update volunteer availability in the database using stored procedure AMC_spUpdateVolunteerAvailability
        /// </summary>
        public async Task<bool> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                int.TryParse(request.UserID, out var parsedUserId);

                using var command = new SqlCommand("AMC_spVolunteerAvailability_Update", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@UserID", parsedUserId));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Semester", request.Semester ?? ""));
                command.Parameters.Add(new SqlParameter("@Response", request.Response ?? ""));
                command.Parameters.Add(new SqlParameter("@Comments", (object?)request.Comment ?? DBNull.Value));

                // Execute the stored procedure
                await command.ExecuteNonQueryAsync();
                
                // Return true since no exception was thrown and the query executed successfully
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating volunteer availability: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get volunteer availability from the database using AMC_spVolunteerAvailability_Select
        /// </summary>
        public async Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request)
        {
            try
            {
                int.TryParse(request.UserID, out var parsedUserId);

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spVolunteerAvailability_Select", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@UserID", parsedUserId));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Semester", request.Semester ?? ""));

                using var reader = await command.ExecuteReaderAsync();
                
                var response = new VolunteerAvailabilitySelectResponse();
                
                if (await reader.ReadAsync())
                {
                    // Check if it returned a single column with '0'
                    if (reader.FieldCount == 1)
                    {
                        var firstVal = reader.GetValue(0)?.ToString();
                        if (firstVal == "0")
                        {
                            response.IsSuccess = true;
                            response.HasValue = false;
                            return response;
                        }
                    }

                    // Otherwise, extract Response and Comments
                    response.IsSuccess = true;
                    response.HasValue = true;
                    
                    var responseIndex = reader.GetOrdinal("Response");
                    response.Response = reader.IsDBNull(responseIndex) ? "" : reader.GetValue(responseIndex)?.ToString()?.Trim() ?? "";

                    var commentsIndex = reader.GetOrdinal("Comments");
                    response.Comments = reader.IsDBNull(commentsIndex) ? "" : reader.GetValue(commentsIndex)?.ToString()?.Trim() ?? "";
                    
                    return response;
                }

                // Default empty response
                response.IsSuccess = true;
                response.HasValue = false;
                return response;
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilitySelectResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error selecting volunteer availability: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Get volunteer availability summary from the database using AMC_spVolunteerAvailability_Summary
        /// </summary>
        public async Task<object> GetVolunteerAvailabilitySummaryAsync(string username)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spVolunteerAvailability_Summary", connection)
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
                throw new Exception($"Error getting volunteer availability summary: {ex.Message}", ex);
            }
        }
    }
}
