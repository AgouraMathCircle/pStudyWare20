using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for registered student list data access operations
    /// </summary>
    public class RegisteredStudentListRepository : IRegisteredStudentListRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public RegisteredStudentListRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get registered student list
        /// </summary>
        public async Task<object> GetRegisteredStudentListAsync(string username, string mode)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));
                if (!string.IsNullOrEmpty(mode))
                {
                    command.Parameters.Add(new SqlParameter("@Mode", mode));
                }

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting registered student list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Update student class information
        /// </summary>
        public async Task<object> UpdateStudentClassAsync(string studentId, string @class, string section, string chapterId, string location, string session)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateStudentClass", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", studentId));
                command.Parameters.Add(new SqlParameter("@Class", @class));
                command.Parameters.Add(new SqlParameter("@Section", section));
                command.Parameters.Add(new SqlParameter("@ChapterID", chapterId));
                command.Parameters.Add(new SqlParameter("@Location", location));
                command.Parameters.Add(new SqlParameter("@Session", session));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating student class: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete student registration
        /// </summary>
        public async Task<object> DeleteStudentAsync(string studentId)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteRegisterednfo", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", studentId));

                var dataSet = new DataSet();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting student: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get chapter locations
        /// </summary>
        public async Task<object> GetChapterLocationsAsync(string activeOnly)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectChapter", connection)
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
                throw new Exception($"Error getting chapter locations: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get student list for Excel export
        /// </summary>
        public async Task<object> GetStudentListForExportAsync(string username, string mode)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectStudentList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", username));
                command.Parameters.Add(new SqlParameter("@Mode", mode));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return dataTable;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting student list for export: {ex.Message}", ex);
            }
        }
    }
}