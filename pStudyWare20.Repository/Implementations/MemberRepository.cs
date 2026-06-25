using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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
                var normalized = (emailId ?? string.Empty).Trim();
                if (normalized.Length == 0)
                    return null;

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("pWebMemberFrm", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@emailId", normalized));
                command.Parameters.Add(new SqlParameter("@mode", "GetPassword"));

                using var reader = await command.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                    return null;

                // GetPassword often returns fewer columns than ValidateUser; avoid GetOrdinal on missing names.
                var password = GetOptionalString(reader, "Password");
                if (string.IsNullOrEmpty(password))
                    return null;

                var userName = GetOptionalString(reader, "Username", "UserName");
                var email = GetOptionalString(reader, "EmailID", "EmailId");
                var pMemberId = GetOptionalInt32(reader, "pMemberID", "PMemberID", "MemberID");
                var firstName = GetOptionalString(reader, "FirstName") ?? string.Empty;
                var lastName = GetOptionalString(reader, "LastName") ?? string.Empty;
                var memberType = GetOptionalString(reader, "MemberType") ?? string.Empty;
                var chapterId = GetOptionalInt32(reader, "ChapterID");
                var systemAdmin = GetOptionalString(reader, "systemAdmin", "SystemAdmin") ?? "N";

                if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(email))
                {
                    return new MemberMaster
                    {
                        pMemberID = pMemberId ?? 0,
                        UserName = userName,
                        EmailID = email,
                        FirstName = firstName,
                        LastName = lastName,
                        Password = password,
                        MemberType = memberType,
                        ChapterID = chapterId,
                        systemAdmin = systemAdmin
                    };
                }

                var fromDb = await _context.MemberMasters.AsNoTracking()
                    .FirstOrDefaultAsync(m => m.EmailID == normalized || m.UserName == normalized);

                if (fromDb == null)
                    return null;

                return new MemberMaster
                {
                    pMemberID = fromDb.pMemberID,
                    UserName = fromDb.UserName,
                    EmailID = fromDb.EmailID,
                    FirstName = fromDb.FirstName,
                    LastName = fromDb.LastName,
                    Password = password,
                    MemberType = fromDb.MemberType,
                    ChapterID = fromDb.ChapterID,
                    systemAdmin = fromDb.systemAdmin
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting user password by email: {ex.Message}", ex);
            }
        }

        private static string? GetOptionalString(SqlDataReader reader, params string[] names)
        {
            for (var i = 0; i < reader.FieldCount; i++)
            {
                var col = reader.GetName(i);
                foreach (var n in names)
                {
                    if (string.Equals(col, n, StringComparison.OrdinalIgnoreCase))
                    {
                        if (reader.IsDBNull(i))
                            return null;
                        var val = reader.GetValue(i);
                        return val as string ?? val.ToString();
                    }
                }
            }

            return null;
        }

        private static int? GetOptionalInt32(SqlDataReader reader, params string[] names)
        {
            for (var i = 0; i < reader.FieldCount; i++)
            {
                var col = reader.GetName(i);
                foreach (var n in names)
                {
                    if (!string.Equals(col, n, StringComparison.OrdinalIgnoreCase))
                        continue;
                    if (reader.IsDBNull(i))
                        return null;
                    return Convert.ToInt32(reader.GetValue(i), System.Globalization.CultureInfo.InvariantCulture);
                }
            }

            return null;
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

        public async Task<bool> UpdatePasswordAsync(string username, string password)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spPasswordUpdate", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@username", username));
                command.Parameters.Add(new SqlParameter("@Password", password));

                var rowsAffected = await command.ExecuteNonQueryAsync();
                // Stored procedures often report -1 when SET NOCOUNT ON; 0 means no rows updated.
                return rowsAffected != 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating password: {ex.Message}", ex);
            }
        }

        public async Task<(string currentSession, string currentSemester, string volunteerAvailability)> GetCurrentSessionAndSemesterAsync(string chapterId)
        {
            string currentSession = "";
            string currentSemester = "";
            string volunteerAvailability = "N";

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // 1. Get Current Semester from AMC_spSelectSemesterLookup
                using (var command = new SqlCommand("AMC_spSelectSemesterLookup", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        var semIndex = reader.GetOrdinal("semester");
                        currentSemester = reader.GetValue(semIndex)?.ToString()?.Trim() ?? "";

                        try
                        {
                            var volIndex = reader.GetOrdinal("VolunteerAvailability");
                            volunteerAvailability = reader.GetValue(volIndex)?.ToString()?.Trim() ?? "N";
                        }
                        catch
                        {
                            volunteerAvailability = "N";
                        }
                    }
                }

                // 2. Get Current Session from AMC_spSelectCurrentSession
                using (var command = new SqlCommand("AMC_spSelectCurrentSession", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChapterID", string.IsNullOrEmpty(chapterId) ? "3" : chapterId));
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        var sessIndex = reader.GetOrdinal("Session");
                        currentSession = reader.GetValue(sessIndex)?.ToString()?.Trim() ?? "";
                    }
                }
            }
            catch
            {
                // Fallbacks if tables are empty or error occurs
                if (string.IsNullOrEmpty(currentSession)) currentSession = "S2026";
                if (string.IsNullOrEmpty(currentSemester)) currentSemester = "Spring 2026";
            }

            return (currentSession, currentSemester, volunteerAvailability);
        }
    }
}