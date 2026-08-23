using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for instructor data access operations
    /// </summary>
    public class InstructorRepository : IInstructorRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public InstructorRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get instructor list using stored procedure
        /// </summary>
        public async Task<string> GetInstructorListAsync(InstructorListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectInstructorList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to a list of dictionaries for proper serialization
                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return System.Text.Json.JsonSerializer.Serialize(rows);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting instructor list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Add or update instructor using stored procedure
        /// </summary>
        public async Task<bool> AddOrUpdateInstructorAsync(InstructorRequest request)
        {
            try
            {
                if (request == null)
                {
                    throw new ArgumentNullException(nameof(request));
                }

                var chapterId = ParseChapterId(request.ChapterID);
                if (chapterId <= 0)
                {
                    throw new ArgumentException("Valid ChapterID is required.");
                }

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                var memberStatus = ParseMemberStatus(request.MemberStatus);
                var isUpdate = request.InstructorID > 0;

                if (isUpdate)
                {
                    await ApplyMemberLoginStatusAsync(
                        connection,
                        request.InstructorID,
                        memberStatus,
                        request.EmailID);
                }

                using (var command = new SqlCommand("AMC_spAddInstructor", connection)
                {
                    CommandType = CommandType.StoredProcedure
                })
                {
                    command.Parameters.Add(new SqlParameter("@InstructorID", request.InstructorID));
                    command.Parameters.Add(new SqlParameter("@firstname", request.FirstName ?? ""));
                    command.Parameters.Add(new SqlParameter("@lastname", request.LastName ?? ""));
                    command.Parameters.Add(new SqlParameter("@emailId", request.EmailID ?? ""));
                    command.Parameters.Add(new SqlParameter("@Phone", request.ContactPhone ?? ""));
                    command.Parameters.Add(new SqlParameter("@ChapterID", chapterId));
                    command.Parameters.Add(new SqlParameter("@Type", request.InstructorType ?? ""));
                    command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                    command.Parameters.Add(new SqlParameter("@Section", request.Section ?? ""));
                    command.Parameters.Add(new SqlParameter("@MemberStatus", SqlDbType.Int) { Value = memberStatus });

                    await command.ExecuteNonQueryAsync();
                }

                if (isUpdate)
                {
                    await ApplyMemberLoginStatusAsync(
                        connection,
                        request.InstructorID,
                        memberStatus,
                        request.EmailID);
                }

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding or updating instructor: {ex.Message}", ex);
            }
        }
        public async Task<InstructorGoogleSyncState?> GetInstructorPriorStateAsync(int instructorId)
        {
            if (instructorId <= 0) return null;

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT
                        LTRIM(RTRIM(m.EmailID)) AS EmailID,
                        m.Active AS Active,
                        LTRIM(RTRIM(c.VolunteerEmailGroup)) AS VolunteerEmailGroup
                    FROM MemberMaster m WITH (NOLOCK)
                    LEFT JOIN dbo.AMC_ChapterMaster c WITH (NOLOCK) ON c.ChapterID = m.ChapterID
                    WHERE m.pMemberID = @InstructorID", connection);

                command.Parameters.Add(new SqlParameter("@InstructorID", instructorId));

                using var reader = await command.ExecuteReaderAsync();
                if (!await reader.ReadAsync())
                {
                    return null;
                }

                var emailOrdinal = reader.GetOrdinal("EmailID");
                var activeOrdinal = reader.GetOrdinal("Active");
                var groupOrdinal = reader.GetOrdinal("VolunteerEmailGroup");

                return new InstructorGoogleSyncState
                {
                    EmailID = reader.IsDBNull(emailOrdinal) ? "" : reader.GetString(emailOrdinal),
                    IsActive = !reader.IsDBNull(activeOrdinal) && reader.GetBoolean(activeOrdinal),
                    VolunteerEmailGroup = reader.IsDBNull(groupOrdinal) ? null : reader.GetString(groupOrdinal)
                };
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<string?> GetChapterVolunteerEmailGroupAsync(string chapterId)
        {
            var id = ParseChapterId(chapterId);
            if (id <= 0) return null;

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT LTRIM(RTRIM(VolunteerEmailGroup))
                    FROM dbo.AMC_ChapterMaster WITH (NOLOCK)
                    WHERE ChapterID = @ChapterID", connection);

                command.Parameters.Add(new SqlParameter("@ChapterID", id));

                var result = await command.ExecuteScalarAsync();
                return result as string;
            }
            catch (Exception)
            {
                return null;
            }
        }


        private static int ParseMemberStatus(string? memberStatus)
        {
            var value = (memberStatus ?? "1").Trim().ToLowerInvariant();
            return value is "0" or "inactive" or "deactive" or "false" ? 0 : 1;
        }

        /// <summary>
        /// MemberMaster is HasNoKey() in EF — must use raw SQL to persist Approved/Active.
        /// </summary>
        private static async Task ApplyMemberLoginStatusAsync(
            SqlConnection connection,
            int memberId,
            int memberStatus,
            string? emailId)
        {
            var isActive = memberStatus == 1;
            var normalizedEmail = (emailId ?? string.Empty).Trim();

            var rows = await UpdateMemberLoginStatusByIdAsync(connection, memberId, isActive);
            if (rows == 0 && normalizedEmail.Length > 0)
            {
                rows = await UpdateMemberLoginStatusByEmailAsync(connection, normalizedEmail, isActive);
            }

            if (rows == 0)
            {
                throw new InvalidOperationException(
                    $"Failed to update login status for instructor {memberId}.");
            }
        }

        private static async Task<int> UpdateMemberLoginStatusByIdAsync(
            SqlConnection connection,
            int memberId,
            bool isActive)
        {
            using var command = new SqlCommand(
                @"UPDATE MemberMaster
                  SET Approved = @approved, Active = @active
                  WHERE pMemberID = @memberId",
                connection);

            command.Parameters.Add(new SqlParameter("@approved", SqlDbType.Bit) { Value = isActive });
            command.Parameters.Add(new SqlParameter("@active", SqlDbType.Bit) { Value = isActive });
            command.Parameters.Add(new SqlParameter("@memberId", SqlDbType.Int) { Value = memberId });

            return await command.ExecuteNonQueryAsync();
        }

        private static async Task<int> UpdateMemberLoginStatusByEmailAsync(
            SqlConnection connection,
            string emailId,
            bool isActive)
        {
            using var command = new SqlCommand(
                @"UPDATE MemberMaster
                  SET Approved = @approved, Active = @active
                  WHERE UPPER(LTRIM(EmailID)) = UPPER(LTRIM(@emailId))
                    AND MemberType IN ('I', 'V', 'C', 'A')",
                connection);

            command.Parameters.Add(new SqlParameter("@approved", SqlDbType.Bit) { Value = isActive });
            command.Parameters.Add(new SqlParameter("@active", SqlDbType.Bit) { Value = isActive });
            command.Parameters.Add(new SqlParameter("@emailId", SqlDbType.VarChar, 100) { Value = emailId });

            return await command.ExecuteNonQueryAsync();
        }

        private static int ParseChapterId(string? chapterId)
        {
            return int.TryParse(chapterId, out var parsed) ? parsed : 0;
        }

        /// <summary>
        /// Delete instructor using stored procedure
        /// </summary>
        public async Task<bool> DeleteInstructorAsync(InstructorDeleteRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteInstructor", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@InstructorID", request.InstructorID));

                var result = await command.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting instructor: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Export instructor list to Excel using stored procedure
        /// </summary>
        public async Task<DataTable> ExportInstructorListToExcelAsync(InstructorListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectInstructorList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error exporting instructor list to Excel: {ex.Message}", ex);
            }
        }
    }
}