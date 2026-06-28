using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Admin donor details — legacy DonorDetails.aspx (AMC_spGetAllDonors / AMC_spDonors_Insert).
    /// </summary>
    public class DonorDetailsRepository : IDonorDetailsRepository
    {
        private readonly string _connectionString;

        public DonorDetailsRepository(IConfiguration configuration)
        {
            _connectionString = configuration?.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<DataTable> GetDonorsAsync(string rowId)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spGetAllDonors", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@RowID", rowId ?? "0"));

            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(dataTable);

            return dataTable;
        }

        public async Task UpsertDonorAsync(UpsertAdminDonorRequest request)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("AMC_spDonors_Insert", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@RowID", request.RowID ?? "0"));
            command.Parameters.Add(new SqlParameter("@Year", request.Year));
            command.Parameters.Add(new SqlParameter("@Semester", request.Semester ?? (object)DBNull.Value));
            command.Parameters.Add(new SqlParameter("@DonorLevel", request.DonorLevel ?? (object)DBNull.Value));
            command.Parameters.Add(new SqlParameter("@DonorName", request.DonorName ?? (object)DBNull.Value));

            await command.ExecuteNonQueryAsync();
        }
    }
}
