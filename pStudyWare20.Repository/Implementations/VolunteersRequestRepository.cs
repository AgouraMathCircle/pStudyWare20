using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Text;

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

                var result = await command.ExecuteNonQueryAsync();
                return new OperationResponse
                {
                    IsSuccess = result >= 0,
                    ErrorMessage = "",
                    Message = "Volunteer status updated successfully."
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

        public async Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request)
        {
            try
            {
                var listResponse = await GetVolunteersRequestAsync(new GetVolunteersRequestRequest { Username = request.Username ?? "" });
                if (!listResponse.IsSuccess || listResponse.VolunteersRequest == null)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = listResponse.ErrorMessage ?? "Failed to get data.",
                        FileContent = Array.Empty<byte>(),
                        FileName = "",
                        ContentType = ""
                    };
                }

                var sb = new StringBuilder();
                sb.AppendLine("VolunteerID,VolunteerName,Grade,Location,School,Phone,Email,City,EnrolledSession,Interest,Status,InsertDate,Comments");
                foreach (var r in listResponse.VolunteersRequest)
                {
                    sb.AppendLine($"{r.VolunteerID},\"{r.VolunteerName}\",\"{r.Grade}\",\"{r.Location}\",\"{r.School}\",\"{r.Phone}\",\"{r.Email}\",\"{r.City}\",\"{r.EnrolledSession}\",\"{r.Interest}\",\"{r.Status}\",\"{r.InsertDate:yyyy-MM-dd}\",\"{r.Comments?.Replace("\"", "\"\"")}\"");
                }
                var bytes = Encoding.UTF8.GetBytes(sb.ToString());

                return new ExportExcelResponse
                {
                    IsSuccess = true,
                    FileName = "VolunteersRequest.csv",
                    FileContent = bytes,
                    ContentType = "text/csv",
                    ErrorMessage = ""
                };
            }
            catch (Exception ex)
            {
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    FileContent = Array.Empty<byte>(),
                    FileName = "",
                    ContentType = ""
                };
            }
        }
    }
}
