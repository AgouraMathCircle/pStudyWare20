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

        /// <summary>
        /// Gets dashboard messages for student (Important Notice, Announcement, Competitions, Todo List)
        /// </summary>
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

        /// <summary>
        /// Gets student profile information
        /// </summary>
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

        /// <summary>
        /// Gets student profile information by StudentID
        /// </summary>
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

        /// <summary>
        /// Gets student report card/grades
        /// </summary>
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

        /// <summary>
        /// Gets registration status for student
        /// </summary>
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

        /// <summary>
        /// Submits student registration
        /// </summary>
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

        /// <summary>
        /// Gets registration information for email notifications
        /// </summary>
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

        /// <summary>
        /// Checks if student is eligible for registration
        /// </summary>
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

        /// <summary>
        /// Gets dashboard messages for student (Important Notice, Announcement, Competitions, Todo List)
        /// Based on the legacy GetDashboardMessage method from pStudyware_DashboardMessage.ascx.cs
        /// This method calls AMC_spSelectPostMessage with @Mode = "D" and @Username parameters
        /// </summary>
        /// <param name="username">Student username</param>
        /// <returns>DataTable containing dashboard messages with 4 rows:
        /// Row 0: Important Notice
        /// Row 1: Announcement
        /// Row 2: Competitions
        /// Row 3: Todo List
        /// </returns>
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
    }
}
