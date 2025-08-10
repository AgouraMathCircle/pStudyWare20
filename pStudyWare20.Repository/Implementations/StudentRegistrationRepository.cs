using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Entity;
using pStudyWare20.Repository.Interfaces;

namespace pStudyWare20.Repository.Implementations
{
    public class StudentRegistrationRepository : IStudentRegistrationRepository
    {
        private readonly string? _connectionString;

        public StudentRegistrationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "DefaultConnection not found in configuration");
        }

        public async Task<StudentRegistration> CreateAsync(StudentRegistration registration)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using (var command = new SqlCommand("AMC_spRegisterStudent", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                // Parent Information
                command.Parameters.AddWithValue("@pFirstName", registration.ParentFirstName);
                command.Parameters.AddWithValue("@pLastName", registration.ParentLastName);
                command.Parameters.AddWithValue("@pAddress", "");
                command.Parameters.AddWithValue("@pCity", registration.City);
                command.Parameters.AddWithValue("@pState", registration.State);
                command.Parameters.AddWithValue("@pZip", "");
                command.Parameters.AddWithValue("@pPhno", registration.ParentPhone);
                command.Parameters.AddWithValue("@pEmail", registration.ParentEmail);
                command.Parameters.AddWithValue("@pCountry", registration.Country);

                // User Name
                string userName = registration.UserNameType == "P" ? registration.ParentEmail : (registration.StudentEmail ?? registration.ParentEmail);
                command.Parameters.AddWithValue("@UserName", userName);

                // Student Information
                command.Parameters.AddWithValue("@sFirstName", registration.StudentFirstName);
                command.Parameters.AddWithValue("@sLastName", registration.StudentLastName);
                command.Parameters.AddWithValue("@sEmail", registration.StudentEmail);
                command.Parameters.AddWithValue("@sSchool", registration.School);
                command.Parameters.AddWithValue("@sGrade", registration.Grade);
                command.Parameters.AddWithValue("@sdrLocation", registration.Location);
                command.Parameters.AddWithValue("@sSessionID", registration.Session);
                command.Parameters.AddWithValue("@sLiabilitySignature", registration.WaiverSignature);
                command.Parameters.AddWithValue("@sRuleSignature", registration.RuleSignature);
                command.Parameters.AddWithValue("@sPicPermission", registration.PicturePermission ? "Y" : "N");

                // Add output parameter for ID
                var idParameter = new SqlParameter("@Id", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                command.Parameters.Add(idParameter);

                await command.ExecuteNonQueryAsync();

                registration.Id = (int)idParameter.Value;
                return registration;
            }
        }

        public async Task<StudentRegistration?> GetByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT * FROM StudentRegistrations WHERE Id = @Id AND IsActive = 1", connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return MapToStudentRegistration(reader);
                        }
                        return null;
                    }
                }
            }
        }

        public async Task<IEnumerable<StudentRegistration>> GetAllAsync()
        {
            var registrations = new List<StudentRegistration>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT * FROM StudentRegistrations WHERE IsActive = 1 ORDER BY CreatedAt DESC", connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            registrations.Add(MapToStudentRegistration(reader));
                        }
                    }
                }
            }
            return registrations;
        }

        public async Task<StudentRegistration?> UpdateAsync(StudentRegistration registration)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(@"
                    UPDATE StudentRegistrations 
                    SET ParentFirstName = @ParentFirstName, ParentLastName = @ParentLastName,
                        ParentEmail = @ParentEmail, ParentPhone = @ParentPhone,
                        City = @City, State = @State, Country = @Country,
                        StudentFirstName = @StudentFirstName, StudentLastName = @StudentLastName,
                        StudentEmail = @StudentEmail, School = @School, Grade = @Grade,
                        Session = @Session, Location = @Location, UserNameType = @UserNameType,
                        WaiverSignature = @WaiverSignature, RuleSignature = @RuleSignature,
                        PicturePermission = @PicturePermission, UpdatedAt = @UpdatedAt
                    WHERE Id = @Id", connection))
                {
                    command.Parameters.AddWithValue("@Id", registration.Id);
                    command.Parameters.AddWithValue("@ParentFirstName", registration.ParentFirstName);
                    command.Parameters.AddWithValue("@ParentLastName", registration.ParentLastName);
                    command.Parameters.AddWithValue("@ParentEmail", registration.ParentEmail);
                    command.Parameters.AddWithValue("@ParentPhone", registration.ParentPhone);
                    command.Parameters.AddWithValue("@City", registration.City);
                    command.Parameters.AddWithValue("@State", registration.State);
                    command.Parameters.AddWithValue("@Country", registration.Country);
                    command.Parameters.AddWithValue("@StudentFirstName", registration.StudentFirstName);
                    command.Parameters.AddWithValue("@StudentLastName", registration.StudentLastName);
                    command.Parameters.AddWithValue("@StudentEmail", registration.StudentEmail);
                    command.Parameters.AddWithValue("@School", registration.School);
                    command.Parameters.AddWithValue("@Grade", registration.Grade);
                    command.Parameters.AddWithValue("@Session", registration.Session);
                    command.Parameters.AddWithValue("@Location", registration.Location);
                    command.Parameters.AddWithValue("@UserNameType", registration.UserNameType);
                    command.Parameters.AddWithValue("@WaiverSignature", registration.WaiverSignature);
                    command.Parameters.AddWithValue("@RuleSignature", registration.RuleSignature);
                    command.Parameters.AddWithValue("@PicturePermission", registration.PicturePermission);
                    command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    if (rowsAffected > 0)
                    {
                        registration.UpdatedAt = DateTime.UtcNow;
                        return registration;
                    }
                    return null;
                }
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("UPDATE StudentRegistrations SET IsActive = 0 WHERE Id = @Id", connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT COUNT(1) FROM StudentRegistrations WHERE Id = @Id AND IsActive = 1", connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    var count = await command.ExecuteScalarAsync();
                    return Convert.ToInt32(count) > 0;
                }
            }
        }

        public async Task<IEnumerable<StudentRegistration>> GetByParentEmailAsync(string email)
        {
            var registrations = new List<StudentRegistration>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT * FROM StudentRegistrations WHERE ParentEmail = @Email AND IsActive = 1 ORDER BY CreatedAt DESC", connection))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            registrations.Add(MapToStudentRegistration(reader));
                        }
                    }
                }
            }
            return registrations;
        }

        public async Task<IEnumerable<StudentRegistration>> GetByStudentEmailAsync(string email)
        {
            var registrations = new List<StudentRegistration>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT * FROM StudentRegistrations WHERE StudentEmail = @Email AND IsActive = 1 ORDER BY CreatedAt DESC", connection))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            registrations.Add(MapToStudentRegistration(reader));
                        }
                    }
                }
            }
            return registrations;
        }

        public async Task<IEnumerable<StudentRegistration>> GetBySessionAsync(string session)
        {
            var registrations = new List<StudentRegistration>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT * FROM StudentRegistrations WHERE Session = @Session AND IsActive = 1 ORDER BY CreatedAt DESC", connection))
                {
                    command.Parameters.AddWithValue("@Session", session);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            registrations.Add(MapToStudentRegistration(reader));
                        }
                    }
                }
            }
            return registrations;
        }

        public async Task<IEnumerable<StudentRegistration>> GetByLocationAsync(int location)
        {
            var registrations = new List<StudentRegistration>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand("SELECT * FROM StudentRegistrations WHERE Location = @Location AND IsActive = 1 ORDER BY CreatedAt DESC", connection))
                {
                    command.Parameters.AddWithValue("@Location", location);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            registrations.Add(MapToStudentRegistration(reader));
                        }
                    }
                }
            }
            return registrations;
        }

        private StudentRegistration MapToStudentRegistration(SqlDataReader reader)
        {
            return new StudentRegistration
            {
                Id = reader.GetInt32("Id"),
                ParentFirstName = reader.GetString("ParentFirstName"),
                ParentLastName = reader.GetString("ParentLastName"),
                ParentEmail = reader.GetString("ParentEmail"),
                ParentPhone = reader.GetString("ParentPhone"),
                City = reader.GetString("City"),
                State = reader.GetString("State"),
                Country = reader.GetString("Country"),
                StudentFirstName = reader.GetString("StudentFirstName"),
                StudentLastName = reader.GetString("StudentLastName"),
                StudentEmail = reader.IsDBNull("StudentEmail") ? null : reader.GetString("StudentEmail"),
                School = reader.GetString("School"),
                Grade = reader.GetInt32("Grade"),
                Session = reader.GetString("Session"),
                Location = reader.GetInt32("Location"),
                UserNameType = reader.GetString("UserNameType"),
                WaiverSignature = reader.GetString("WaiverSignature"),
                RuleSignature = reader.GetString("RuleSignature"),
                PicturePermission = reader.GetBoolean("PicturePermission"),
                CreatedAt = reader.GetDateTime("CreatedAt"),
                UpdatedAt = reader.IsDBNull("UpdatedAt") ? (DateTime?)null : reader.GetDateTime("UpdatedAt"),
                IsActive = reader.GetBoolean("IsActive")
            };
        }
    }
}