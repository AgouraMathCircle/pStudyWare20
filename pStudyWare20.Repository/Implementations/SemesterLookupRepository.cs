using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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
                command.Parameters.Add(new SqlParameter("@StartingDate", request.StartingDate ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@RegStartDate", request.RegStartDate ?? (object)DBNull.Value));
                // Legacy .aspx.cs used "@RegCloseDate " with trailing space; most DBs use @RegCloseDate.
                command.Parameters.Add(new SqlParameter("@RegCloseDate", request.RegCloseDate ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@RegistrationStatus", request.RegistrationStatus ?? "O"));
                command.Parameters.Add(new SqlParameter("@DisplayDocumentsFrom", request.DisplayDocumentsFrom ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@JBTotalSpace", request.JbTotalSpace ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@JITotalSpace", request.JiTotalSpace ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@JATotalSpace", request.JaTotalSpace ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@SBTotalSpace", request.SbTotalSpace ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@SITotalSpace", request.SiTotalSpace ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@SATotalSpace", request.SaTotalSpace ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@CurrentExamDate", request.CurrentExamDate ?? (object)DBNull.Value));
                command.Parameters.Add(new SqlParameter("@CurrentExamDueTime", request.CurrentExamDueTime ?? (object)DBNull.Value));

                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating semester lookup: {ex.Message}", ex);
            }
        }
    }
}
