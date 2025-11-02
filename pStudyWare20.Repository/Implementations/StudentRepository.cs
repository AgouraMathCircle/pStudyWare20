using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for student data access operations
    /// </summary>
    public class StudentRepository : IStudentRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public StudentRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Register a new student using stored procedure
        /// </summary>
        public async Task<bool> RegisterStudentAsync(RegistrationStudentModel request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();
               
                using var command = new SqlCommand("AMC_spRegisterStudent", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentFirstName", request.StudentFirstName ?? ""));
                command.Parameters.Add(new SqlParameter("@StudentLastName", request.StudentLastName ?? ""));
                command.Parameters.Add(new SqlParameter("@StudentEmail", request.StudentEmail ?? ""));
                command.Parameters.Add(new SqlParameter("@StudentGrade", request.StudentGrade ?? ""));
                command.Parameters.Add(new SqlParameter("@ParentFirstName", request.ParentFirstName ?? ""));
                command.Parameters.Add(new SqlParameter("@ParentLastName", request.ParentLastName ?? ""));
                command.Parameters.Add(new SqlParameter("@ParentEmail", request.ParentEmail ?? ""));
                command.Parameters.Add(new SqlParameter("@ParentPhoneNo", request.ParentPhoneNo ?? ""));
                command.Parameters.Add(new SqlParameter("@Address", request.Address ?? ""));
                command.Parameters.Add(new SqlParameter("@City", request.City ?? ""));
                command.Parameters.Add(new SqlParameter("@State", request.State ?? ""));
                command.Parameters.Add(new SqlParameter("@LocationId", request.LocationId));

                var result = await command.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error registering student: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get students list using stored procedure
        /// </summary>
        public async Task<string> GetStudentsListAsync(Studentlist request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetStudentsList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.userName ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting students list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get student report card using stored procedure
        /// </summary>
        public async Task<string> GetStudentsReportCardAsync(UserName request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetStudentsReportCard", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.userName ?? ""));

                        var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting students report card: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Update student report card using stored procedure
        /// </summary>
        public async Task<bool> UpdateStudentsReportCardAsync(StudentsReportCard request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateStudentsReportCard", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@QuizTotalScore", request.QuizTotalScore));
                command.Parameters.Add(new SqlParameter("@QuizReceivedScore", request.QuizReceivedScore));
                command.Parameters.Add(new SqlParameter("@QuizComments", request.QuizComments ?? ""));
                command.Parameters.Add(new SqlParameter("@ClassTotalScore", request.ClassTotalScore));
                command.Parameters.Add(new SqlParameter("@ClassReceivedScore", request.ClassReceivedScore));
                command.Parameters.Add(new SqlParameter("@ClassComments", request.ClassComments ?? ""));
                command.Parameters.Add(new SqlParameter("@HomeWorkTotalScore", request.HomeWorkTotalScore));
                command.Parameters.Add(new SqlParameter("@HomeWorkReceivedScore", request.HomeWorkReceivedScore));
                command.Parameters.Add(new SqlParameter("@HomeWorkComments", request.HomeWorkComments ?? ""));

                var result = await command.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating students report card: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get meeting schedule using stored procedure
        /// </summary>
        public async Task<string> GetMeetingScheduleAsync(UserName request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetMeetingSchedule", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.userName ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting meeting schedule: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get dashboard message using stored procedure
        /// </summary>
        public async Task<string> GetDashboardMessageAsync(Chapter request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetDashboardMessage", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting dashboard message: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get student detail using stored procedure
        /// </summary>
        public async Task<string> GetStudentDetailAsync(StudentID request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetStudentDetail", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.studentID));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting student detail: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Update student detail using stored procedure
        /// </summary>
        public async Task<bool> UpdateStudentDetailAsync(StudentDetail request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spUpdateStudentDetail", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentId", request.StudentId));
                command.Parameters.Add(new SqlParameter("@StudentFirstName", request.StudentFirstName ?? ""));
                command.Parameters.Add(new SqlParameter("@StudentLastName", request.StudentLastName ?? ""));
                command.Parameters.Add(new SqlParameter("@StudentEmailID", request.StudentEmailID ?? ""));
                command.Parameters.Add(new SqlParameter("@School", request.School ?? ""));
                command.Parameters.Add(new SqlParameter("@GradeLevel", request.GradeLevel ?? ""));

                var result = await command.ExecuteNonQueryAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating student detail: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get report card with additional details using stored procedure
        /// </summary>
        public async Task<string> GetReportcardAsync(StudentlistDropdown request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetReportcard", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.userName));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting report card: {ex.Message}", ex);
            }
        }
    }
}