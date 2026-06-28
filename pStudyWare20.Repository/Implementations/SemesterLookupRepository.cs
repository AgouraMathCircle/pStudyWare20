using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Globalization;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Semester lookup — legacy UpdateLookupSemester.aspx (AMC_spSelectSemesterLookup / AMC_spUpdateSemesterLookup).
    /// </summary>
    public class SemesterLookupRepository : ISemesterLookupRepository
    {
        private readonly string _connectionString;

        public SemesterLookupRepository(IConfiguration configuration)
        {
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<DataTable> SelectSemesterLookupAsync()
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectSemesterLookup", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error loading semester lookup: {ex.Message}", ex);
            }
        }

        public async Task UpdateSemesterLookupAsync(UpdateSemesterLookupRequest request)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateSemesterLookup", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@semester", request.Semester ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@LastSemester", request.LastSemester ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@StartingDate", ToDbDateTime(request.StartingDate)));
                command.Parameters.Add(new SqlParameter("@RegStartDate", ToDbDateTime(request.RegStartDate)));
                command.Parameters.Add(new SqlParameter("@RegCloseDate", ToDbDateTime(request.RegCloseDate)));
                command.Parameters.Add(new SqlParameter("@RegistrationStatus", request.RegistrationStatus ?? "O"));
                command.Parameters.Add(new SqlParameter("@DisplayDocumentsFrom", ToDbInt(request.DisplayDocumentsFrom)));
                command.Parameters.Add(new SqlParameter("@JBTotalSpace", ToDbInt(request.JbTotalSpace)));
                command.Parameters.Add(new SqlParameter("@JITotalSpace", ToDbInt(request.JiTotalSpace)));
                command.Parameters.Add(new SqlParameter("@JATotalSpace", ToDbInt(request.JaTotalSpace)));
                command.Parameters.Add(new SqlParameter("@SBTotalSpace", ToDbInt(request.SbTotalSpace)));
                command.Parameters.Add(new SqlParameter("@SITotalSpace", ToDbInt(request.SiTotalSpace)));
                command.Parameters.Add(new SqlParameter("@SATotalSpace", ToDbInt(request.SaTotalSpace)));
                command.Parameters.Add(new SqlParameter("@CurrentExamDate", ToDbDate(request.CurrentExamDate)));
                command.Parameters.Add(new SqlParameter("@CurrentExamDueTime", ToDbDateTime(request.CurrentExamDueTime)));
                command.Parameters.Add(new SqlParameter("@VolunteerAvailability", ToYnFlag(request.VolunteerAvailability)));

                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating semester lookup: {ex.Message}", ex);
            }
        }

        private static string? CleanInput(string? input)
        {
            if (input == null) return null;
            return input.Replace('\u202F', ' ').Replace('\u00A0', ' ').Trim();
        }

        private static object ToYnFlag(string? value)
        {
            var cleaned = CleanInput(value)?.ToUpperInvariant();
            return cleaned == "Y" ? "Y" : "N";
        }

        private static object ToDbInt(string? value)
        {
            var cleaned = CleanInput(value);
            if (string.IsNullOrEmpty(cleaned)) return DBNull.Value;
            return int.TryParse(cleaned, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n)
                ? n
                : DBNull.Value;
        }

        private static object ToDbDate(string? value)
        {
            var cleaned = CleanInput(value);
            if (string.IsNullOrEmpty(cleaned)) return DBNull.Value;
            if (DateTime.TryParse(cleaned, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt)
                || DateTime.TryParse(cleaned, CultureInfo.CurrentCulture, DateTimeStyles.None, out dt))
            {
                return dt.Date;
            }

            return cleaned;
        }

        private static object ToDbDateTime(string? value)
        {
            var cleaned = CleanInput(value);
            if (string.IsNullOrEmpty(cleaned)) return DBNull.Value;
            if (DateTime.TryParse(cleaned, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt)
                || DateTime.TryParse(cleaned, CultureInfo.CurrentCulture, DateTimeStyles.None, out dt))
            {
                return dt;
            }

            return cleaned;
        }
    }
}
