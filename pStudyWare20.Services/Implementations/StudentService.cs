using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of student business logic operations (matches legacy controller)
    /// </summary>
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public StudentService(IStudentRepository studentRepository, IEmailUtility emailUtility, IConfiguration configuration)
        {
            _studentRepository = studentRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
        }

        /// <summary>
        /// Register a new student (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails StudentRegistration(RegistrationStudentModel studentDetails)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                // Register student using stored procedure
                var result = _studentRepository.RegisterStudentAsync(studentDetails).Result;

                if (result)
                {
                    // Send email notification to admin
                    _emailUtility.SendEmailtoAdminForStudentRegistration(studentDetails);

                    responseDetails.isSuccess = true;
                    responseDetails.ErrorMessage = "";
                    responseDetails.Message = "Registered";
                }
                else
                {
                    responseDetails.isSuccess = false;
                    responseDetails.ErrorMessage = "Failed to register student";
                    responseDetails.Message = "";
                }
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get students list (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails GetStudentsList(Studentlist studentlist)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _studentRepository.GetStudentsListAsync(studentlist).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get student report card (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails GetStudentsReportCard(UserName userName)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _studentRepository.GetStudentsReportCardAsync(userName).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Update student report card (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails UpdateStudentsReportCard(StudentsReportCard studentsReportCard)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _studentRepository.UpdateStudentsReportCardAsync(studentsReportCard).Result;

                if (result)
                {
                    responseDetails.isSuccess = true;
                    responseDetails.ErrorMessage = "";
                    responseDetails.Message = "success";
                }
                else
                {
                    responseDetails.isSuccess = false;
                    responseDetails.ErrorMessage = "Failed to update report card";
                    responseDetails.Message = "";
                }
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get meeting schedule (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails GetMeetingSchedule(UserName userName)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _studentRepository.GetMeetingScheduleAsync(userName).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get dashboard message (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails GetDashboardMessage(Chapter chapterID)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _studentRepository.GetDashboardMessageAsync(chapterID).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get student detail (matches legacy controller exactly)
        /// </summary>
        public StudentDetailResponse GetStudentDetail(StudentID studentID)
        {
            StudentDetailResponse studentDetail = new StudentDetailResponse();
            try
            {
                var result = _studentRepository.GetStudentDetailAsync(studentID).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<JsonElement>(result);

                    if (dataTable.ValueKind == JsonValueKind.Array && dataTable.GetArrayLength() > 0)
                    {
                        var firstRow = dataTable[0];

                        studentDetail.StudentFirstName = firstRow.GetProperty("StudentFName").GetString() ?? "";
                        studentDetail.StudentLastName = firstRow.GetProperty("StudentLName").GetString() ?? "";
                        studentDetail.StudentEmailID = firstRow.GetProperty("StudentEmail").GetString() ?? "";
                        studentDetail.StudentPhone = firstRow.GetProperty("PhoneNumber").GetString() ?? "";
                        studentDetail.State = firstRow.GetProperty("State").GetString() ?? "";
                        studentDetail.City = firstRow.GetProperty("City").GetString() ?? "";
                        studentDetail.StudentId = firstRow.GetProperty("StudentID").GetInt32();
                        studentDetail.GradeLevel = firstRow.GetProperty("Grade").GetString() ?? "";
                        studentDetail.Country = firstRow.GetProperty("Country").GetString() ?? "";
                        studentDetail.isSuccess = true;
                        studentDetail.ErrorMessage = "";
                    }
                    else
                    {
                        studentDetail.isSuccess = false;
                        studentDetail.ErrorMessage = "Student not available.";
                    }
                }
                else
                {
                    studentDetail.isSuccess = false;
                    studentDetail.ErrorMessage = "Student not available.";
                }
            }
            catch (Exception ex)
            {
                studentDetail.isSuccess = false;
                studentDetail.ErrorMessage = "Server error";
            }

            return studentDetail;
        }

        /// <summary>
        /// Update student detail (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails UpdateStudentDetail(StudentDetail studentDetail)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _studentRepository.UpdateStudentDetailAsync(studentDetail).Result;

                if (result)
                {
                    // Send email for existing student registration if needed
                    if (studentDetail.RegistrationUpdate == "Not Registered")
                    {
                        _emailUtility.SendEmailForExistingStudentRegistration(studentDetail);
                    }

                    responseDetails.isSuccess = true;
                    responseDetails.ErrorMessage = "";
                    responseDetails.Message = "Updated";
                }
                else
                {
                    responseDetails.isSuccess = false;
                    responseDetails.ErrorMessage = "Failed to update student detail";
                    responseDetails.Message = "";
                }
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = "Server error";
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get report card with additional details (matches legacy controller exactly)
        /// </summary>
        public ResponseReportCardDetails GetReportcard(StudentlistDropdown studentlist)
        {
            ResponseReportCardDetails responseDetails = new ResponseReportCardDetails();
            try
            {
                var result = _studentRepository.GetReportcardAsync(studentlist).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Reportcard = result;

                // Note: StudentDetailUtillity and Session would need to be implemented
                // based on the legacy UtilityManagement class
                responseDetails.StudentDetailUtillity = "";
                responseDetails.Session = "";
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Reportcard = "";
                responseDetails.StudentDetailUtillity = "";
                responseDetails.Session = "";
            }

            return responseDetails;
        }
    }
}
