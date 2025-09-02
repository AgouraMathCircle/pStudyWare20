using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace pStudyWare20.Repository.Implementations
{
    public class VolunteerRepository : IVolunteerRepository
    {
        private readonly string? _connectionString;

        public VolunteerRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection connection string not found in configuration.");
        }

        // Stored procedure operations (matches reference controller exactly)
        public async Task<int> AddVolunteerRequestAsync(RegistrationVolunteerModel request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spAddVolunteersRequest", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@FirstName", request.FirstName));
                    command.Parameters.Add(new SqlParameter("@LastName", request.LastName));
                    command.Parameters.Add(new SqlParameter("@Email", request.Email));
                    command.Parameters.Add(new SqlParameter("@Phone", request.PhoneNo));
                    command.Parameters.Add(new SqlParameter("@City", request.City));
                    command.Parameters.Add(new SqlParameter("@School", request.SchoolName));
                    command.Parameters.Add(new SqlParameter("@Grade", request.Grade));
                    command.Parameters.Add(new SqlParameter("@EnrolledSession", request.SessionId));
                    command.Parameters.Add(new SqlParameter("@drLocation", request.LocationId));
                    command.Parameters.Add(new SqlParameter("@Interest", request.InterestedFor));
                    command.Parameters.Add(new SqlParameter("@Comments", request.Aboutyourself ?? (object)DBNull.Value));

                    var result = await command.ExecuteScalarAsync();
                    return result != null ? Convert.ToInt32(result) : 0;
                }
            }
        }
    }
}
