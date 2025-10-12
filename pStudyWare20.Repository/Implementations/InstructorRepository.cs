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

                using var command = new SqlCommand("AMC_spGetInstructorList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
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
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddOrUpdateInstructor", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@InstructorID", request.InstructorID));
                command.Parameters.Add(new SqlParameter("@FirstName", request.FirstName ?? ""));
                command.Parameters.Add(new SqlParameter("@LastName", request.LastName ?? ""));
                command.Parameters.Add(new SqlParameter("@EmailID", request.EmailID ?? ""));
                command.Parameters.Add(new SqlParameter("@ContactPhone", request.ContactPhone ?? ""));
                command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID ?? ""));
                command.Parameters.Add(new SqlParameter("@InstructorType", request.InstructorType ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@Section", request.Section ?? ""));

                var result = await command.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding or updating instructor: {ex.Message}", ex);
            }
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

                using var command = new SqlCommand("AMC_spExportInstructorListToExcel", connection)
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