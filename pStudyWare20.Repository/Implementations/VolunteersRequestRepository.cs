using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    public class VolunteersRequestRepository : IVolunteersRequestRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public VolunteersRequestRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        private static string ResolveColumnName(DataTable table, string preferredName)
        {
            if (table?.Columns == null) return null;
            foreach (DataColumn col in table.Columns)
            {
                if (string.Equals(col.ColumnName, preferredName, StringComparison.OrdinalIgnoreCase))
                    return col.ColumnName;
            }
            return null;
        }

        private static string GetString(DataRow row, string columnName)
        {
            var actual = ResolveColumnName(row?.Table, columnName);
            if (actual == null) return "";
            var val = row[actual];
            return val == null || val == DBNull.Value ? "" : val.ToString() ?? "";
        }

        private static int GetInt(DataRow row, string columnName)
        {
            var actual = ResolveColumnName(row?.Table, columnName);
            if (actual == null) return 0;
            var val = row[actual];
            if (val == null || val == DBNull.Value) return 0;
            return int.TryParse(val.ToString(), out var n) ? n : 0;
        }

        private static DateTime GetDateTime(DataRow row, string columnName)
        {
            var actual = ResolveColumnName(row?.Table, columnName);
            if (actual == null) return default;
            var val = row[actual];
            if (val == null || val == DBNull.Value) return default;
            return DateTime.TryParse(val.ToString(), out var d) ? d : default;
        }

        private static string BuildVolunteerInfo(string volunteerName, string email, string chapterId)
        {
            var parts = (volunteerName ?? "").Trim().Split(new[] { ' ' }, 2, StringSplitOptions.RemoveEmptyEntries);
            var first = parts.Length > 0 ? parts[0] : "";
            var last = parts.Length > 1 ? parts[1] : "";
            return $"{first}~#{last}~#{email ?? ""}~#{chapterId ?? ""}";
        }

        public async Task<GetVolunteersRequestResponse> GetVolunteersRequestAsync(GetVolunteersRequestRequest request)
        {
            if (request == null)
            {
                return new GetVolunteersRequestResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Request is required.",
                    VolunteersRequest = new List<VolunteerRequestItem>()
                };
            }
            try
            {
                if (string.IsNullOrWhiteSpace(_connectionString))
                {
                    return new GetVolunteersRequestResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Database connection is not configured (DefaultConnection).",
                        VolunteersRequest = new List<VolunteerRequestItem>()
                    };
                }
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectVolunteersRequest", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using (var adapter = new SqlDataAdapter(command))
                {
                    adapter.Fill(dataTable);
                }

                var list = new List<VolunteerRequestItem>();
                if (dataTable.Rows != null)
                {
                    foreach (DataRow row in dataTable.Rows)
                {
                    list.Add(new VolunteerRequestItem
                    {
                        VolunteerID = GetInt(row, "VolunteerID"),
                        VolunteerName = GetString(row, "VolunteerName"),
                        Grade = GetString(row, "Grade"),
                        Location = GetString(row, "Location"),
                        School = GetString(row, "School"),
                        Phone = GetString(row, "Phone"),
                        Email = GetString(row, "Email"),
                        City = GetString(row, "City"),
                        EnrolledSession = GetString(row, "EnrolledSession"),
                        Interest = GetString(row, "Interest"),
                        Status = GetString(row, "Status"),
                        InsertDate = GetDateTime(row, "InsertDate"),
                        Comments = GetString(row, "Comments"),
                        VolunteerInfo = GetString(row, "VolunteerInfo").Length > 0
                            ? GetString(row, "VolunteerInfo")
                            : BuildVolunteerInfo(GetString(row, "VolunteerName"), GetString(row, "Email"), GetString(row, "ChapterID")),
                    });
                    }
                }

                return new GetVolunteersRequestResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    VolunteersRequest = list
                };
            }
            catch (Exception ex)
            {
                return new GetVolunteersRequestResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    VolunteersRequest = new List<VolunteerRequestItem>()
                };
            }
        }

        public async Task<OperationResponse> UpdateVolunteerStatusAsync(UpdateVolunteerStatusRequest request)
        {
            try
            {
                // Match legacy VolunteersRequest.aspx.cs → AMC_spUpdateVolunteerStatus only.
                // SP uses @ChapterID for AMC_spAddInstructor, then sets Approved=1.
                // It does not UPDATE AMC_tblVolunteersRequest.ChapterID.
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateVolunteerStatus", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.Add(new SqlParameter("@VolundeerID", request.VolundeerID ?? ""));
                command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@Section", request.Section ?? ""));
                command.Parameters.Add(new SqlParameter("@Type", request.Type ?? ""));

                await command.ExecuteNonQueryAsync();
                return new OperationResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    Message = "Volunteer has approved successfully."
                };
            }
            catch (Exception ex)
            {
                return new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    Message = ""
                };
            }
        }

        public async Task<OperationResponse> DeleteVolunteerRequestAsync(DeleteVolunteerRequestRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spVolunteersRequest_Delete", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.Add(new SqlParameter("@RequestID", request.RequestID ?? ""));

                var result = await command.ExecuteNonQueryAsync();
                return new OperationResponse
                {
                    IsSuccess = result >= 0,
                    ErrorMessage = "",
                    Message = "Volunteer request deleted successfully."
                };
            }
            catch (Exception ex)
            {
                return new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    Message = ""
                };
            }
        }

        /// <summary>
        /// Active chapters for Update Volunteer Request Status dropdown.
        /// Source: AMC_ChapterMaster (Name, Location, City) — not AMC_tblLookupSemester.
        /// </summary>
        public async Task<GetVolunteerChapterLocationsResponse> GetChapterLocationsAsync()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_connectionString))
                {
                    return new GetVolunteerChapterLocationsResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Database connection is not configured.",
                        ChapterLocations = new List<VolunteerChapterLocation>()
                    };
                }

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand(@"
                    SELECT
                        ChapterID,
                        LTRIM(RTRIM(Name)) AS Name,
                        LTRIM(RTRIM(Location)) AS Location,
                        LTRIM(RTRIM(City)) AS City,
                        LTRIM(RTRIM(VolunteerEmailGroup)) AS VolunteerEmailGroup
                    FROM dbo.AMC_ChapterMaster WITH (NOLOCK)
                    WHERE Active = 1
                    ORDER BY Name, Location, City", connection);

                using var reader = await command.ExecuteReaderAsync();
                var chapters = new List<VolunteerChapterLocation>();
                while (await reader.ReadAsync())
                {
                    var chapterId = reader.IsDBNull(reader.GetOrdinal("ChapterID"))
                        ? 0
                        : reader.GetInt32(reader.GetOrdinal("ChapterID"));
                    if (chapterId <= 0)
                    {
                        continue;
                    }

                    var name = ReadTrimmedString(reader, "Name");
                    var location = ReadTrimmedString(reader, "Location");
                    var city = ReadTrimmedString(reader, "City");
                    var volunteerEmailGroup = ReadTrimmedString(reader, "VolunteerEmailGroup");

                    chapters.Add(new VolunteerChapterLocation
                    {
                        ChapterID = chapterId.ToString(),
                        Name = name,
                        Location = location,
                        City = city,
                        Label = RegistrationFormatHelper.FormatLocationEmailText(name, location, city),
                        VolunteerEmailGroup = volunteerEmailGroup
                    });
                }

                return new GetVolunteerChapterLocationsResponse
                {
                    IsSuccess = true,
                    ErrorMessage = "",
                    ChapterLocations = chapters
                };
            }
            catch (Exception ex)
            {
                return new GetVolunteerChapterLocationsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error loading chapter locations: {ex.Message}",
                    ChapterLocations = new List<VolunteerChapterLocation>()
                };
            }
        }

        private static string ReadTrimmedString(SqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? string.Empty : reader.GetString(ordinal).Trim();
        }
    }
}
