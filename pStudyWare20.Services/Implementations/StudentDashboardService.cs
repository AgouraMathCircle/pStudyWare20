using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for Student Dashboard business logic
    /// </summary>
    public class StudentDashboardService : IStudentDashboardService
    {
        private readonly IStudentDashboardRepository _repository;
        private readonly IEmailUtility _emailUtility;

        public StudentDashboardService(IStudentDashboardRepository repository, IEmailUtility emailUtility)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _emailUtility = emailUtility ?? throw new ArgumentNullException(nameof(emailUtility));
        }

        /// <summary>
        /// Gets dashboard messages for student (Important Notice, Announcement, Competitions, Todo List)
        /// </summary>
        public async Task<GetDashboardMessageResponse> GetDashboardMessageAsync(GetDashboardMessageRequest request)
        {
            try
            {
                var dataTable = await _repository.GetDashboardMessageAsync(request.Username, request.ChapterID);

                var importantNotice = string.Empty;
                var announcement = string.Empty;
                var competitions = string.Empty;
                var todoList = string.Empty;

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    importantNotice = dataTable.Rows.Count > 0 ? dataTable.Rows[0]["Message"]?.ToString() ?? string.Empty : string.Empty;
                    announcement = dataTable.Rows.Count > 1 ? dataTable.Rows[1]["Message"]?.ToString() ?? string.Empty : string.Empty;
                    competitions = dataTable.Rows.Count > 2 ? dataTable.Rows[2]["Message"]?.ToString() ?? string.Empty : string.Empty;
                    todoList = dataTable.Rows.Count > 3 ? dataTable.Rows[3]["Message"]?.ToString() ?? string.Empty : string.Empty;
                }

                return new GetDashboardMessageResponse
                {
                    IsSuccess = true,
                    Message = "Dashboard messages retrieved successfully",
                    ImportantNotice = importantNotice,
                    Announcement = announcement,
                    Competitions = competitions,
                    TodoList = todoList
                };
            }
            catch (Exception ex)
            {
                return new GetDashboardMessageResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving dashboard messages: {ex.Message}"
                };
            }
        }


        /// <summary>
        /// Gets student profile information
        /// </summary>
        public async Task<GetStudentProfileResponse> GetStudentProfileAsync(GetStudentProfileRequest request)
        {
            try
            {
                var dataTable = await _repository.GetStudentProfileAsync(request.Username, request.ChapterID);

                if (dataTable.Rows.Count == 0)
                {
                    return new GetStudentProfileResponse
                    {
                        IsSuccess = false,
                        Message = "Student profile not found"
                    };
                }

                var studentProfile = MapDataRowToStudentProfile(dataTable.Rows[0]);

                return new GetStudentProfileResponse
                {
                    IsSuccess = true,
                    Message = "Student profile retrieved successfully",
                    StudentProfile = studentProfile
                };
            }
            catch (Exception ex)
            {
                return new GetStudentProfileResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving student profile: {ex.Message}"
                };
            }
        }


        /// <summary>
        /// Gets student profile information by StudentID
        /// </summary>
        public async Task<GetStudentProfileResponse> GetStudentProfileByIdAsync(int studentID)
        {
            try
            {
                var dataTable = await _repository.GetStudentProfileByIdAsync(studentID);

                if (dataTable.Rows.Count == 0)
                {
                    return new GetStudentProfileResponse
                    {
                        IsSuccess = false,
                        Message = "Student profile not found"
                    };
                }

                var studentProfile = MapDataRowToStudentProfile(dataTable.Rows[0]);

                return new GetStudentProfileResponse
                {
                    IsSuccess = true,
                    Message = "Student profile retrieved successfully",
                    StudentProfile = studentProfile
                };
            }
            catch (Exception ex)
            {
                return new GetStudentProfileResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving student profile: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets multiple student profiles for a given username and chapter
        /// </summary>
        public async Task<GetStudentProfilesResponse> GetStudentProfilesAsync(GetStudentProfilesRequest request)
        {
            try
            {
                var dataTable = await _repository.GetStudentProfileAsync(request.Username, request.ChapterID);

                Console.WriteLine($"GetStudentProfilesAsync: Retrieved {dataTable.Rows.Count} rows for username={request.Username}, chapterID={request.ChapterID}");

                if (dataTable.Rows.Count == 0)
                {
                    return new GetStudentProfilesResponse
                    {
                        IsSuccess = false,
                        Message = "No student profiles found"
                    };
                }

                var studentProfiles = new List<StudentProfile>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var profile = MapDataRowToStudentProfile(row);
                    Console.WriteLine($"Mapped profile: ID={profile.StudentID}, Name={profile.StudentName}, Program={profile.Program}, Email={profile.Email}");
                    studentProfiles.Add(profile);
                }

                Console.WriteLine($"Returning {studentProfiles.Count} student profiles");

                return new GetStudentProfilesResponse
                {
                    IsSuccess = true,
                    Message = "Student profiles retrieved successfully",
                    StudentProfiles = studentProfiles
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentProfilesAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return new GetStudentProfilesResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving student profiles: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets student report card/grades
        /// </summary>
        public async Task<GetReportCardResponse> GetReportCardAsync(GetReportCardRequest request)
        {
            try
            {
                var dataTable = await _repository.GetReportCardAsync(request.Username);
                var reportCardEntries = new List<ReportCardEntry>();

                foreach (DataRow row in dataTable.Rows)
                {
                    reportCardEntries.Add(MapDataRowToReportCardEntry(row));
                }

                return new GetReportCardResponse
                {
                    IsSuccess = true,
                    Message = "Report card retrieved successfully",
                    ReportCardEntries = reportCardEntries
                };
            }
            catch (Exception ex)
            {
                return new GetReportCardResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving report card: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets registration status for student
        /// </summary>
        public async Task<GetRegistrationStatusResponse> GetRegistrationStatusAsync(GetRegistrationStatusRequest request)
        {
            try
            {
                var dataSet = await _repository.GetRegistrationStatusAsync(request.Username);
                var registrationStatuses = new List<RegistrationStatus>();
                var showRegistrationWindow = false;

                if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                {
                    showRegistrationWindow = true;

                    foreach (DataRow row in dataSet.Tables[0].Rows)
                    {
                        registrationStatuses.Add(MapDataRowToRegistrationStatus(row));
                    }
                }

                return new GetRegistrationStatusResponse
                {
                    IsSuccess = true,
                    Message = "Registration status retrieved successfully",
                    RegistrationStatuses = registrationStatuses,
                    ShowRegistrationWindow = showRegistrationWindow
                };
            }
            catch (Exception ex)
            {
                return new GetRegistrationStatusResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving registration status: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Submits student registration
        /// </summary>
        public async Task<SubmitRegistrationResponse> SubmitRegistrationAsync(SubmitRegistrationRequest request)
        {
            try
            {
                var registrationSuccess = await _repository.SubmitRegistrationAsync(request.StudentID);

                if (!registrationSuccess)
                {
                    return new SubmitRegistrationResponse
                    {
                        IsSuccess = false,
                        Message = "Failed to submit registration"
                    };
                }

                // Get registration info for email notifications
                var registrationInfoResponse = await GetRegistrationInfoAsync(new GetRegistrationInfoRequest
                {
                    StudentID = request.StudentID
                });

                bool emailSentToAdmin = false;
                bool emailSentToParent = false;

                if (registrationInfoResponse.IsSuccess && registrationInfoResponse.RegistrationInfo != null)
                {
                    var registrationInfo = registrationInfoResponse.RegistrationInfo;

                    // Send email to admin
                    emailSentToAdmin = await SendAdminNotificationEmail(registrationInfo);

                    // Send email to parent
                    emailSentToParent = await SendParentConfirmationEmail(registrationInfo, request.Username);
                }

                return new SubmitRegistrationResponse
                {
                    IsSuccess = true,
                    Message = "Registration submitted successfully",
                    EmailSentToAdmin = emailSentToAdmin,
                    EmailSentToParent = emailSentToParent
                };
            }
            catch (Exception ex)
            {
                return new SubmitRegistrationResponse
                {
                    IsSuccess = false,
                    Message = $"Error submitting registration: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets registration information for email notifications
        /// </summary>
        public async Task<GetRegistrationInfoResponse> GetRegistrationInfoAsync(GetRegistrationInfoRequest request)
        {
            try
            {
                var dataSet = await _repository.GetRegistrationInfoAsync(request.StudentID);

                if (dataSet.Tables.Count == 0 || dataSet.Tables[0].Rows.Count == 0)
                {
                    return new GetRegistrationInfoResponse
                    {
                        IsSuccess = false,
                        Message = "Registration information not found"
                    };
                }

                var registrationInfo = MapDataRowToRegistrationInfo(dataSet.Tables[0].Rows[0]);

                return new GetRegistrationInfoResponse
                {
                    IsSuccess = true,
                    Message = "Registration information retrieved successfully",
                    RegistrationInfo = registrationInfo
                };
            }
            catch (Exception ex)
            {
                return new GetRegistrationInfoResponse
                {
                    IsSuccess = false,
                    Message = $"Error retrieving registration information: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Checks if student is eligible for registration
        /// </summary>
        public async Task<CheckRegistrationEligibilityResponse> CheckRegistrationEligibilityAsync(CheckRegistrationEligibilityRequest request)
        {
            try
            {
                var dataSet = await _repository.CheckRegistrationEligibilityAsync(request.Username);
                var availableRegistrations = new List<RegistrationStatus>();
                var showRegistrationWindow = false;

                if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                {
                    showRegistrationWindow = true;

                    foreach (DataRow row in dataSet.Tables[0].Rows)
                    {
                        availableRegistrations.Add(MapDataRowToRegistrationStatus(row));
                    }
                }

                return new CheckRegistrationEligibilityResponse
                {
                    IsSuccess = true,
                    Message = "Registration eligibility checked successfully",
                    IsEligible = showRegistrationWindow,
                    ShowRegistrationWindow = showRegistrationWindow,
                    AvailableRegistrations = availableRegistrations
                };
            }
            catch (Exception ex)
            {
                return new CheckRegistrationEligibilityResponse
                {
                    IsSuccess = false,
                    Message = $"Error checking registration eligibility: {ex.Message}"
                };
            }
        }

        /// <inheritdoc />
        public async Task<UpdateStudentProfileResponse> UpdateStudentProfileAsync(UpdateStudentProfileRequest request)
        {
            try
            {
                await _repository.UpdateStudentProfileAsync(request);
                return new UpdateStudentProfileResponse
                {
                    IsSuccess = true,
                    Message = "You have updated your profile successfully"
                };
            }
            catch (Exception ex)
            {
                return new UpdateStudentProfileResponse
                {
                    IsSuccess = false,
                    Message = $"Error updating profile: {ex.Message}"
                };
            }
        }

        ///// <summary>
        ///// Gets complete dashboard data for student
        ///// </summary>
        //public async Task<GetDashboardMessageResponse> GetDashboardDataAsync(GetDashboardMessageRequest request)
        //{
        //    try
        //    {
        //        var messagesTask = GetMessagesAsync(new GetMessagesRequest
        //        {
        //            Username = request.Username,
        //            ChapterID = request.ChapterID
        //        });
        //        // Get all dashboard data in parallel
        //        var profileTask = GetStudentProfileAsync(new GetStudentProfileRequest
        //        {
        //            Username = request.Username,
        //            ChapterID = request.ChapterID
        //        });
        //        var reportCardTask = GetReportCardAsync(new GetReportCardRequest
        //        {
        //            Username = request.Username
        //        });
        //        var registrationStatusTask = GetRegistrationStatusAsync(new GetRegistrationStatusRequest
        //        {
        //            Username = request.Username
        //        });

        //        await Task.WhenAll(profileTask, reportCardTask, registrationStatusTask);

        //        return new GetDashboardDataResponse
        //        {
        //            IsSuccess = true,
        //            Message = "Dashboard data retrieved successfully",
        //            MessagesList = messagesTask.Result.MessagesList,                    
        //            StudentProfile = profileTask.Result.StudentProfile,
        //            ReportCardEntries = reportCardTask.Result.ReportCardEntries,
        //            RegistrationStatuses = registrationStatusTask.Result.RegistrationStatuses,
        //            ShowRegistrationWindow = registrationStatusTask.Result.ShowRegistrationWindow,
        //            ShowExamButton = true // Based on original logic
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new GetDashboardDataResponse
        //        {
        //            IsSuccess = false,
        //            Message = $"Error retrieving dashboard data: {ex.Message}"
        //        };
        //    }
        //}


        #region Private Helper Methods

        private static StudentProfile MapDataRowToStudentProfile(DataRow row)
        {
            // Debug: Log available columns
            var availableColumns = new List<string>();
            foreach (System.Data.DataColumn column in row.Table.Columns)
            {
                availableColumns.Add(column.ColumnName);
            }
            Console.WriteLine($"Available columns in DataTable: {string.Join(", ", availableColumns)}");

            // Try multiple possible email column names
            string email = string.Empty;
            string parentEmail = string.Empty;
            string studentEmail = string.Empty;

            // Check various possible email column names
            if (row.Table.Columns.Contains("EmailAddress"))
                email = row["EmailAddress"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("Email"))
                email = row["Email"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("EmailID"))
                email = row["EmailID"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("email"))
                email = row["email"]?.ToString() ?? string.Empty;

            if (row.Table.Columns.Contains("ParentEmailAddress"))
                parentEmail = row["ParentEmailAddress"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("ParentEmail"))
                parentEmail = row["ParentEmail"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("ParentEmailID"))
                parentEmail = row["ParentEmailID"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("Parent_Email"))
                parentEmail = row["Parent_Email"]?.ToString() ?? string.Empty;

            if (row.Table.Columns.Contains("StudentEmailAddress"))
                studentEmail = row["StudentEmailAddress"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("StudentEmail"))
                studentEmail = row["StudentEmail"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("StudentEmailID"))
                studentEmail = row["StudentEmailID"]?.ToString() ?? string.Empty;
            else if (row.Table.Columns.Contains("Student_Email"))
                studentEmail = row["Student_Email"]?.ToString() ?? string.Empty;

            Console.WriteLine($"Email fields found - Email: '{email}', ParentEmail: '{parentEmail}', StudentEmail: '{studentEmail}'");

            return new StudentProfile
            {
                StudentID = row.Table.Columns.Contains("StudentID") ? Convert.ToInt32(row["StudentID"]) : 0,
                StudentFName = row.Table.Columns.Contains("StudentFName") ? row["StudentFName"]?.ToString() ?? string.Empty : string.Empty,
                StudentLName = row.Table.Columns.Contains("StudentLName") ? row["StudentLName"]?.ToString() ?? string.Empty : string.Empty,
                StudentName = row.Table.Columns.Contains("StudentName") ? row["StudentName"]?.ToString() ?? string.Empty : string.Empty,
                StudentEmail = studentEmail,
                Grade = row.Table.Columns.Contains("Grade") ? row["Grade"]?.ToString() ?? string.Empty : string.Empty,
                School = row.Table.Columns.Contains("School") ? row["School"]?.ToString() ?? string.Empty : string.Empty,
                Email = email,
                Phone = row.Table.Columns.Contains("Phone") ? row["Phone"]?.ToString() ?? string.Empty : string.Empty,
                PhoneNumber = row.Table.Columns.Contains("PhoneNumber") ? row["PhoneNumber"]?.ToString() ?? string.Empty : string.Empty,
                Address = row.Table.Columns.Contains("Address") ? row["Address"]?.ToString() ?? string.Empty : string.Empty,
                City = row.Table.Columns.Contains("City") ? row["City"]?.ToString() ?? string.Empty : string.Empty,
                State = row.Table.Columns.Contains("State") ? row["State"]?.ToString() ?? string.Empty : string.Empty,
                Country = row.Table.Columns.Contains("Country") ? row["Country"]?.ToString() ?? string.Empty : string.Empty,
                ZipCode = row.Table.Columns.Contains("ZipCode") ? row["ZipCode"]?.ToString() ?? string.Empty : string.Empty,
                DateOfBirth = row.Table.Columns.Contains("DateOfBirth") && row["DateOfBirth"] != DBNull.Value ? Convert.ToDateTime(row["DateOfBirth"]) : null,
                ParentName = row.Table.Columns.Contains("ParentName") ? row["ParentName"]?.ToString() ?? string.Empty : string.Empty,
                ParentEmail = parentEmail,
                ParentPhone = row.Table.Columns.Contains("ParentPhone") ? row["ParentPhone"]?.ToString() ?? string.Empty : string.Empty,
                DateCreated = row.Table.Columns.Contains("DateCreated") && row["DateCreated"] != DBNull.Value ? Convert.ToDateTime(row["DateCreated"]) : null,
                LastUpdated = row.Table.Columns.Contains("LastUpdated") && row["LastUpdated"] != DBNull.Value ? Convert.ToDateTime(row["LastUpdated"]) : null,
                IsActive = row.Table.Columns.Contains("IsActive") ? Convert.ToBoolean(row["IsActive"]) : true,
                // Additional fields for dashboard display
                Program = row.Table.Columns.Contains("Program") ? row["Program"]?.ToString() ?? string.Empty : string.Empty,
                Class = row.Table.Columns.Contains("Class") ? row["Class"]?.ToString() ?? string.Empty : string.Empty,
                EventSession = row.Table.Columns.Contains("EventSession") ? row["EventSession"]?.ToString() ?? string.Empty : string.Empty,
                EventLocation = row.Table.Columns.Contains("EventLocation") ? row["EventLocation"]?.ToString() ?? string.Empty : string.Empty
            };
        }

        private static ReportCardEntry MapDataRowToReportCardEntry(DataRow row)
        {
            return new ReportCardEntry
            {
                ReportCardID = row.Table.Columns.Contains("ReportCardID") ? Convert.ToInt32(row["ReportCardID"]) : 0,
                StudentID = row.Table.Columns.Contains("StudentID") ? Convert.ToInt32(row["StudentID"]) : 0,
                StudentName = row.Table.Columns.Contains("StudentName") ? row["StudentName"]?.ToString() ?? string.Empty : string.Empty,
                Group = row.Table.Columns.Contains("Group") ? row["Group"]?.ToString() ?? string.Empty : string.Empty,
                Subject = row.Table.Columns.Contains("Subject") ? row["Subject"]?.ToString() ?? string.Empty : string.Empty,
                Grade = row.Table.Columns.Contains("Grade") ? row["Grade"]?.ToString() ?? string.Empty : string.Empty,
                Score = row.Table.Columns.Contains("Score") && row["Score"] != DBNull.Value ? Convert.ToDecimal(row["Score"]) : null,
                Semester = row.Table.Columns.Contains("Semester") ? row["Semester"]?.ToString() ?? string.Empty : string.Empty,
                Year = row.Table.Columns.Contains("Year") ? Convert.ToInt32(row["Year"]) : DateTime.Now.Year,
                Comments = row.Table.Columns.Contains("Comments") ? row["Comments"]?.ToString() ?? string.Empty : string.Empty,
                ExamDate = row.Table.Columns.Contains("ExamDate") && row["ExamDate"] != DBNull.Value ? Convert.ToDateTime(row["ExamDate"]) : null,
                ExamType = row.Table.Columns.Contains("ExamType") ? row["ExamType"]?.ToString() ?? string.Empty : string.Empty,
                TotalCredit = row.Table.Columns.Contains("TotalCredit") && row["TotalCredit"] != DBNull.Value ? Convert.ToDecimal(row["TotalCredit"]) : null,
                HighestScore = row.Table.Columns.Contains("HighestScore") && row["HighestScore"] != DBNull.Value ? Convert.ToDecimal(row["HighestScore"]) : null,
                ClassAverage = row.Table.Columns.Contains("ClassAverage") && row["ClassAverage"] != DBNull.Value ? Convert.ToDecimal(row["ClassAverage"]) : null,
                ReceivedCredit = row.Table.Columns.Contains("ReceivedCredit") && row["ReceivedCredit"] != DBNull.Value ? Convert.ToDecimal(row["ReceivedCredit"]) : null,
                DateCreated = row.Table.Columns.Contains("DateCreated") && row["DateCreated"] != DBNull.Value ? Convert.ToDateTime(row["DateCreated"]) : null
            };
        }

        private static RegistrationStatus MapDataRowToRegistrationStatus(DataRow row)
        {
            var status = row.Table.Columns.Contains("Status") ? row["Status"]?.ToString() ?? "Unknown" : "Unknown";

            return new RegistrationStatus
            {
                RegistrationID = row.Table.Columns.Contains("RegistrationID") ? Convert.ToInt32(row["RegistrationID"]) : 0,
                StudentID = row.Table.Columns.Contains("StudentID") ? Convert.ToInt32(row["StudentID"]) : 0,
                StudentName = row.Table.Columns.Contains("StudentName") ? row["StudentName"]?.ToString() ?? string.Empty : string.Empty,
                Grade = row.Table.Columns.Contains("Grade") ? row["Grade"]?.ToString() ?? string.Empty : string.Empty,
                School = row.Table.Columns.Contains("School") ? row["School"]?.ToString() ?? string.Empty : string.Empty,
                Semester = row.Table.Columns.Contains("Semester") ? row["Semester"]?.ToString() ?? string.Empty : string.Empty,
                SemesterName = row.Table.Columns.Contains("SemesterName") ? row["SemesterName"]?.ToString() ?? string.Empty : string.Empty,
                EventLocation = row.Table.Columns.Contains("EventLocation") ? row["EventLocation"]?.ToString() ?? string.Empty : string.Empty,
                Status = status,
                RegistrationDate = row.Table.Columns.Contains("RegistrationDate") && row["RegistrationDate"] != DBNull.Value ? Convert.ToDateTime(row["RegistrationDate"]) : null,
                IsRegistered = status == "Registered",
                CanRegister = status == "Open",
                IsWaitingList = status == "Waiting List"
            };
        }

        private static RegistrationInfo MapDataRowToRegistrationInfo(DataRow row)
        {
            return new RegistrationInfo
            {
                StudentID = row.Table.Columns.Contains("StudentID") ? Convert.ToInt32(row["StudentID"]) : 0,
                StudentName = row.Table.Columns.Contains("StudentName") ? row["StudentName"]?.ToString() ?? string.Empty : string.Empty,
                Grade = row.Table.Columns.Contains("Grade") ? row["Grade"]?.ToString() ?? string.Empty : string.Empty,
                School = row.Table.Columns.Contains("School") ? row["School"]?.ToString() ?? string.Empty : string.Empty,
                Semester = row.Table.Columns.Contains("Semester") ? row["Semester"]?.ToString() ?? string.Empty : string.Empty,
                SemesterName = row.Table.Columns.Contains("SemesterName") ? row["SemesterName"]?.ToString() ?? string.Empty : string.Empty,
                EventLocation = row.Table.Columns.Contains("EventLocation") ? row["EventLocation"]?.ToString() ?? string.Empty : string.Empty,
                ParentEmail = row.Table.Columns.Contains("ParentEmail") ? row["ParentEmail"]?.ToString() ?? string.Empty : string.Empty
            };
        }

        private async Task<bool> SendAdminNotificationEmail(RegistrationInfo registrationInfo)
        {
            try
            {
                var subject = $"Agoura Math Circle : Registration request from: {registrationInfo.StudentName}.";
                var body = $"Just Received registration from {registrationInfo.StudentName}<br/>" +
                          $"Student Name: {registrationInfo.StudentName}<br/>" +
                          $"Session: {registrationInfo.Semester}<br/>" +
                          $"Student Level: {registrationInfo.Grade}<br/>" +
                          $"Location: {registrationInfo.EventLocation}<br/>" +
                          $"Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                // Note: You'll need to configure these email addresses in your app settings
                var adminEmail = "admin@agouramathcircle.org"; // Should come from configuration
                var fromEmail = "noreply@agouramathcircle.org"; // Should come from configuration

                var result = await _emailUtility.SendEmailAsync(adminEmail, fromEmail, subject, body);
                return !string.IsNullOrEmpty(result) && result.Contains("success");
            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> SendParentConfirmationEmail(RegistrationInfo registrationInfo, string parentEmail)
        {
            try
            {
                var subject = $"Agoura Math Circle : Registration Confirmation {registrationInfo.SemesterName} for: {registrationInfo.StudentName}.";
                var body = $"You have successfully registered {registrationInfo.StudentName}<br/>" +
                          $"Student Name: {registrationInfo.StudentName}<br/>" +
                          $"Session: {registrationInfo.SemesterName}<br/>" +
                          $"Student Level: {registrationInfo.Grade}<br/>" +
                          $"Location: {registrationInfo.EventLocation}<br/>" +
                          $"Regards <br> Agoura Math Circle<br/> <br/>www.agouramathcircle.org";

                var fromEmail = "noreply@agouramathcircle.org"; // Should come from configuration

                var result = await _emailUtility.SendEmailAsync(parentEmail, fromEmail, subject, body);
                return !string.IsNullOrEmpty(result) && result.Contains("success");
            }
            catch
            {
                return false;
            }
        }

        #endregion
    }
}