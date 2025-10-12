using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Linq.Expressions;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for member data access operations
    /// </summary>
    public class MemberRepository : IMemberRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public MemberRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        // Stored procedure operations
        public async Task<MemberMaster?> ValidateUserWithStoredProcedureAsync(string emailId, string password)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("pWebMemberFrm", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@emailId", emailId));
                command.Parameters.Add(new SqlParameter("@password", password));
                command.Parameters.Add(new SqlParameter("@mode", "ValidateUser"));

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new MemberMaster
                    {
                        pMemberID = reader.GetInt32("pMemberID"),
                        UserName = reader.GetString("Username"),
                        EmailID = reader.GetString("EmailID"),
                        FirstName = reader.GetString("FirstName"),
                        LastName = reader.GetString("LastName"),
                        MemberType = reader.GetString("MemberType"),
                        ChapterID = reader.GetInt32("ChapterID"),
                        systemAdmin = reader.GetString("systemAdmin")
                    };
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error validating user with stored procedure: {ex.Message}", ex);
            }
        }

        public async Task<MemberMaster?> GetUserPasswordByEmailAsync(string emailId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("pWebMemberFrm", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@emailId", emailId));
                command.Parameters.Add(new SqlParameter("@mode", "GetPassword"));

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new MemberMaster
                    {
                        pMemberID = reader.GetInt32("pMemberID"),
                        UserName = reader.GetString("Username"),
                        EmailID = reader.GetString("EmailID"),
                        FirstName = reader.GetString("FirstName"),
                        LastName = reader.GetString("LastName"),
                        Password = reader.GetString("Password"),
                        MemberType = reader.GetString("MemberType"),
                        ChapterID = reader.GetInt32("ChapterID"),
                        systemAdmin = reader.GetString("systemAdmin")
                    };
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting user password by email: {ex.Message}", ex);
            }
        }

        public async Task AddUserTrackingAsync(string userId, string userName, string userType, string ipAddress)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddUserTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@UserID", userId));
                command.Parameters.Add(new SqlParameter("@UserName", userName));
                command.Parameters.Add(new SqlParameter("@UserType", userType));
                command.Parameters.Add(new SqlParameter("@IPAddress", ipAddress));

                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding user tracking: {ex.Message}", ex);
            }
        }
    }
}