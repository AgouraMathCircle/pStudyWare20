using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for Student Dashboard data access
    /// </summary>
    public class StudentDashboardRepository : IStudentDashboardRepository
    {
        private readonly string _connectionString;

        public StudentDashboardRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "Connection string not found");
        }

        public async Task<DataTable> GetDashboardMessageAsync(string username, int chapterID)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spSelectPostMessage", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Mode", "D"));
            command.Parameters.Add(new SqlParameter("@Username", username));
            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataTable);
            return dataTable;
        }

        public async Task<DataTable> GetStudentProfileAsync(string username, int chapterID)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spSelectStudentList", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username));
            command.Parameters.Add(new SqlParameter("@ChapterID", chapterID));
            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataTable);
            return dataTable;
        }

        public async Task<DataTable> GetStudentProfileByIdAsync(int studentID)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spSelectStudentProfile", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@StudentID", studentID));
            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataTable);
            return dataTable;
        }

        public async Task<DataTable> GetReportCardAsync(string username)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spReportCard_StudentDashboard", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username));
            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataTable);
            return dataTable;
        }

        public async Task<DataSet> GetRegistrationStatusAsync(string username)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spRegisterExistingUserCheck", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username));
            var dataSet = new DataSet();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataSet);
            return dataSet;
        }

        public async Task<bool> SubmitRegistrationAsync(int studentID)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spRegisterExistingUser", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@StudentID", studentID);
            await connection.OpenAsync();
            var result = await command.ExecuteNonQueryAsync();
            return result > 0;
        }

        public async Task<DataSet> GetRegistrationInfoAsync(int studentID)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spRegisterednfo", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@StudentID", studentID));
            var dataSet = new DataSet();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataSet);
            return dataSet;
        }

        public async Task<DataSet> CheckRegistrationEligibilityAsync(string username)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spRegisterExistingUserCheck", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Username", username));
            var dataSet = new DataSet();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataSet);
            return dataSet;
        }

        public async Task<DataTable> GetStudentDashnoardMessageAsync(string username)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spSelectPostMessage", connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.Add(new SqlParameter("@Mode", "D"));
            command.Parameters.Add(new SqlParameter("@Username", username));
            var dataTable = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            await connection.OpenAsync();
            adapter.Fill(dataTable);
            return dataTable;
        }

        /// <inheritdoc />
        public async Task UpdateStudentProfileAsync(UpdateStudentProfileRequest request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spUpdateStudentProfile", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@StudentID", request.StudentID);
            command.Parameters.AddWithValue("@StudentFName", request.StudentFName ?? "");
            command.Parameters.AddWithValue("@StudentLName", request.StudentLName ?? "");
            command.Parameters.AddWithValue("@StudentEmail", request.StudentEmail ?? "");
            command.Parameters.AddWithValue("@School", request.School ?? "");
            command.Parameters.AddWithValue("@Grade", request.Grade ?? "");
            command.Parameters.AddWithValue("@City", request.City ?? "");
            command.Parameters.AddWithValue("@State", request.State ?? "");
            command.Parameters.AddWithValue("@Country", request.Country ?? "");
            command.Parameters.AddWithValue("@PhoneNumber", request.PhoneNumber ?? "");
            command.Parameters.AddWithValue("@Class", request.Class ?? "");
            command.Parameters.AddWithValue("@MemberType", request.MemberType ?? "");

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }
    }
}
