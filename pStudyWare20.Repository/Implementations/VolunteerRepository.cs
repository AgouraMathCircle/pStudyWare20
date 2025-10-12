using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for volunteer data access operations
    /// </summary>
    public class VolunteerRepository : IVolunteerRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public VolunteerRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Add volunteer request using stored procedure
        /// </summary>
        public async Task<int> AddVolunteerRequestAsync(RegistrationVolunteerModel request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddVolunteersRequest", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@FirstName", request.FirstName ?? ""));
                command.Parameters.Add(new SqlParameter("@LastName", request.LastName ?? ""));
                command.Parameters.Add(new SqlParameter("@Email", request.Email ?? ""));
                command.Parameters.Add(new SqlParameter("@Phone", request.PhoneNo ?? ""));
                command.Parameters.Add(new SqlParameter("@City", request.City ?? ""));
                command.Parameters.Add(new SqlParameter("@School", request.SchoolName ?? ""));
                command.Parameters.Add(new SqlParameter("@Grade", request.Grade ?? ""));
                command.Parameters.Add(new SqlParameter("@EnrolledSession", request.SessionId ?? ""));
                command.Parameters.Add(new SqlParameter("@drLocation", request.LocationId));
                command.Parameters.Add(new SqlParameter("@Interest", request.InterestedFor ?? ""));
                command.Parameters.Add(new SqlParameter("@Comments", request.Aboutyourself ?? ""));

                var result = await command.ExecuteNonQueryAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding volunteer request: {ex.Message}", ex);
            }
        }
    }
}