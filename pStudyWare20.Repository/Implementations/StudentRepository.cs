using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Implementation of student data access operations using stored procedures (matches legacy controller)
    /// </summary>
    public class StudentRepository : IStudentRepository
    {
        private readonly string? _connectionString;

        public StudentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection connection string not found in configuration.");
        }

        /// <summary>
        /// Register a new student using AMC_spRegisterStudent stored procedure
        /// </summary>
        public async Task<bool> RegisterStudentAsync(RegistrationStudentModel request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spRegisterStudent", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    
                    // Add parameters matching the legacy controller exactly
                    command.Parameters.Add(new SqlParameter("@pFirstName", request.ParentFirstName));
                    command.Parameters.Add(new SqlParameter("@pLastName", request.ParentLastName));
                    command.Parameters.Add(new SqlParameter("@pAddress", request.Address));
                    command.Parameters.Add(new SqlParameter("@pCity", request.City));
                    command.Parameters.Add(new SqlParameter("@pState", request.State));
                    command.Parameters.Add(new SqlParameter("@pZip", ""));
                    command.Parameters.Add(new SqlParameter("@pPhno", request.ParentPhoneNo));
                    command.Parameters.Add(new SqlParameter("@pEmail", request.ParentEmail));
                    command.Parameters.Add(new SqlParameter("@pCountry", request.Country));
                    command.Parameters.Add(new SqlParameter("@sFirstName", request.StudentFirstName));
                    command.Parameters.Add(new SqlParameter("@sLastName", request.StudentLastName));
                    command.Parameters.Add(new SqlParameter("@sEmail", request.StudentEmail));
                    command.Parameters.Add(new SqlParameter("@sSchool", request.StudentSchoolName));
                    command.Parameters.Add(new SqlParameter("@sGrade", request.StudentGrade));
                    command.Parameters.Add(new SqlParameter("@sdrLocation", request.LocationId));
                    command.Parameters.Add(new SqlParameter("@sSessionID", request.SessionId));
                    command.Parameters.Add(new SqlParameter("@sPicPermission", request.PicturePermission ? "Y" : "N"));
                    command.Parameters.Add(new SqlParameter("@sLiabilitySignature", request.LiabilitySignature));
                    command.Parameters.Add(new SqlParameter("@sRuleSignature", request.RuleSignature));
                    command.Parameters.Add(new SqlParameter("@UserName", request.UserName));

                    await command.ExecuteNonQueryAsync();
                    return true;
                }
            }
        }

        /// <summary>
        /// Get students list using AMC_spSelectStudentList stored procedure
        /// </summary>
        public async Task<string> GetStudentsListAsync(Studentlist request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spSelectStudentList", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Username", request.userName));
                    command.Parameters.Add(new SqlParameter("@ChapterID", request.chapterID));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Get student report card using AMC_spReportCard stored procedure
        /// </summary>
        public async Task<string> GetStudentsReportCardAsync(UserName request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spReportCard", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Username", request.userName));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Update student report card using AMC_spAddStudentScore stored procedure
        /// </summary>
        public async Task<bool> UpdateStudentsReportCardAsync(StudentsReportCard request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spAddStudentScore", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    
                    command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID.ToString()));
                    command.Parameters.Add(new SqlParameter("@Session", request.Session));
                    command.Parameters.Add(new SqlParameter("@QuizTotalScore", request.QuizTotalScore.ToString()));
                    command.Parameters.Add(new SqlParameter("@QuizReceivedScore", request.QuizReceivedScore.ToString()));
                    command.Parameters.Add(new SqlParameter("@QuizComments", request.QuizComments));
                    command.Parameters.Add(new SqlParameter("@ClassTestTotalScore", request.ClassTotalScore.ToString()));
                    command.Parameters.Add(new SqlParameter("@ClassTestReceivedScore", request.ClassReceivedScore.ToString()));
                    command.Parameters.Add(new SqlParameter("@ClassTestComments", request.ClassComments));
                    command.Parameters.Add(new SqlParameter("@HomeWorkTotalScore", request.HomeWorkTotalScore.ToString()));
                    command.Parameters.Add(new SqlParameter("@HomeWorkReceivedScore", request.HomeWorkReceivedScore.ToString()));
                    command.Parameters.Add(new SqlParameter("@HomeWorkComments", request.HomeWorkComments));

                    await command.ExecuteNonQueryAsync();
                    return true;
                }
            }
        }

        /// <summary>
        /// Get meeting schedule using AMC_spMeetingSchedule_Select stored procedure
        /// </summary>
        public async Task<string> GetMeetingScheduleAsync(UserName request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spMeetingSchedule_Select", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Username", request.userName));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Get dashboard message using AMCAPI_spDashboardMessage_Select stored procedure
        /// </summary>
        public async Task<string> GetDashboardMessageAsync(Chapter request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMCAPI_spDashboardMessage_Select", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChapterID", 0));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Get student detail using AMC_spSelectStudentProfile stored procedure
        /// </summary>
        public async Task<string> GetStudentDetailAsync(StudentID request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spSelectStudentProfile", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@StudentID", request.studentID));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Update student detail using AMC_spUpdateStudentProfile stored procedure
        /// </summary>
        public async Task<bool> UpdateStudentDetailAsync(StudentDetail request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spUpdateStudentProfile", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    
                    command.Parameters.Add(new SqlParameter("@StudentID", request.StudentId));
                    command.Parameters.Add(new SqlParameter("@StudentFName", request.StudentFirstName));
                    command.Parameters.Add(new SqlParameter("@StudentLName", request.StudentLastName));
                    command.Parameters.Add(new SqlParameter("@StudentEmail", request.StudentEmailID));
                    command.Parameters.Add(new SqlParameter("@School", request.School));
                    command.Parameters.Add(new SqlParameter("@Grade", request.GradeLevel));
                    command.Parameters.Add(new SqlParameter("@City", request.City));
                    command.Parameters.Add(new SqlParameter("@State", request.State));
                    command.Parameters.Add(new SqlParameter("@Country", request.Country));
                    command.Parameters.Add(new SqlParameter("@PhoneNumber", request.StudentPhone));
                    command.Parameters.Add(new SqlParameter("@Class", ""));
                    command.Parameters.Add(new SqlParameter("@MemberType", request.MemberType));
                    command.Parameters.Add(new SqlParameter("@RegistrationUpdate", request.RegistrationUpdate));

                    await command.ExecuteScalarAsync();
                    return true;
                }
            }
        }

        /// <summary>
        /// Get report card using AMC_spReportCard stored procedure
        /// </summary>
        public async Task<string> GetReportcardAsync(StudentlistDropdown request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spReportCard", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Username", request.userName));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }
    }
}
