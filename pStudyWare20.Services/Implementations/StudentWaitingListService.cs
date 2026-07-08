using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of IStudentWaitingListService
    /// </summary>
    public class StudentWaitingListService : IStudentWaitingListService
    {
        private readonly IStudentWaitingListRepository _repository;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="repository">IStudentWaitingListRepository</param>
        /// <param name="serviceScopeFactory">IServiceScopeFactory</param>
        /// <param name="configuration">IConfiguration</param>
        public StudentWaitingListService(
            IStudentWaitingListRepository repository,
            IServiceScopeFactory serviceScopeFactory,
            IConfiguration configuration)
        {
            _repository = repository;
            _serviceScopeFactory = serviceScopeFactory;
            _configuration = configuration;
        }

        private string RegistrationNotificationEmail =>
            _configuration.GetSection("AppSettings")["RegistrationEmailGroup"]
            ?? _configuration.GetSection("AppSettings")["Email"]
            ?? "info@agouramathcircle.net";

        private string SystemEmail =>
            _configuration.GetSection("AppSettings")["Email"]
            ?? "info@agouramathcircle.net";

        private string SupportEmail =>
            _configuration.GetSection("AppSettings")["AMCEmailID"]
            ?? "support@agouramathcircle.org";

        /// <summary>
        /// Get student waiting list
        /// </summary>
        /// <param name="request">GetStudentWaitingListRequest</param>
        /// <returns>Task&lt;StudentWaitingListResponse&gt;</returns>
        public async Task<StudentWaitingListResponse> GetStudentWaitingListAsync(GetStudentWaitingListRequest request)
        {
            try
            {
                return await _repository.GetStudentWaitingListAsync(request);
            }
            catch (Exception ex)
            {
                return new StudentWaitingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Update student waiting list status
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <returns>Task&lt;OperationResponse&gt;</returns>
        public async Task<OperationResponse> UpdateStudentWaitingListStatusAsync(UpdateStudentWaitingListStatusRequest request)
        {
            try
            {
                if (request == null)
                {
                    return new OperationResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Request is required."
                    };
                }

                NormalizeUpdateRequest(request);

                OperationResponse response;
                if (string.Equals(request.ApplicationStatus, "A", StringComparison.OrdinalIgnoreCase))
                {
                    if (string.IsNullOrWhiteSpace(request.StudentID) ||
                        string.IsNullOrWhiteSpace(request.ChapterID) ||
                        string.IsNullOrWhiteSpace(request.Class) ||
                        string.IsNullOrWhiteSpace(request.Location) ||
                        string.IsNullOrWhiteSpace(request.Session))
                    {
                        return new OperationResponse
                        {
                            IsSuccess = false,
                            ErrorMessage = "Student ID, chapter, class, location, and session are required."
                        };
                    }

                    UpdateClassSectionDefault(request);
                    response = await _repository.UpdateStudentWaitingListStatusAsync(request);
                }
                else
                {
                    response = await _repository.DeleteStudentAsync(new DeleteStudentRequest
                    {
                        StudentId = request.StudentID ?? ""
                    });

                    if (response.IsSuccess)
                    {
                        response.Message = "You have declined the student successfully.";
                    }
                }

                if (response.IsSuccess)
                {
                    await EnsureReviewEmailFieldsAsync(request);
                    QueueReviewEmailNotifications(request);
                }

                return response;
            }
            catch (Exception ex)
            {
                return new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private static void NormalizeUpdateRequest(UpdateStudentWaitingListStatusRequest request)
        {
            request.StudentID = (request.StudentID ?? "").Trim();
            request.Class = (request.Class ?? "").Trim();
            request.Section = (request.Section ?? "").Trim();
            request.ChapterID = (request.ChapterID ?? "").Trim();
            request.Location = (request.Location ?? "").Trim().ToUpperInvariant();
            request.Session = (request.Session ?? "").Trim();
            request.SessionLabel = (request.SessionLabel ?? "").Trim();
            request.ClassLabel = (request.ClassLabel ?? "").Trim();
            request.LocationLabel = (request.LocationLabel ?? "").Trim();
            request.OriginalLocation = (request.OriginalLocation ?? "").Trim().ToUpperInvariant();
            request.ApplicationStatus = string.IsNullOrWhiteSpace(request.ApplicationStatus)
                ? "A"
                : request.ApplicationStatus.Trim().ToUpperInvariant();
        }

        /// <summary>
        /// Delete student
        /// </summary>
        /// <param name="request">DeleteStudentRequest</param>
        /// <returns>Task&lt;OperationResponse&gt;</returns>
        public async Task<OperationResponse> DeleteStudentAsync(DeleteStudentRequest request)
        {
            try
            {
                return await _repository.DeleteStudentAsync(request);
            }
            catch (Exception ex)
            {
                return new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get chapter location from AMC_ChapterMaster (Name, Location, City).
        /// </summary>
        /// <param name="request">GetChapterLocationRequest</param>
        /// <returns>Task&lt;ChapterLocationResponse&gt;</returns>
        public async Task<ChapterLocationResponse> GetChapterLocationAsync(GetChapterLocationRequest request)
        {
            try
            {
                return await _repository.GetChapterLocationAsync(request);
            }
            catch (Exception ex)
            {
                return new ChapterLocationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Active session options from AMC_tblLookupSemester (Semester, LastSemester, NextSemester).
        /// </summary>
        public async Task<StudentWaitingListSessionOptionsResponse> GetActiveSessionOptionsAsync()
        {
            try
            {
                return await _repository.GetActiveSessionOptionsAsync();
            }
            catch (Exception ex)
            {
                return new StudentWaitingListSessionOptionsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    SessionOptions = new List<StudentWaitingListSessionOption>()
                };
            }
        }

        /// <summary>
        /// Get password
        /// </summary>
        /// <param name="request">GetPasswordRequest</param>
        /// <returns>Task&lt;PasswordResponse&gt;</returns>
        public async Task<PasswordResponse> GetPasswordAsync(GetPasswordRequest request)
        {
            try
            {
                return await _repository.GetPasswordAsync(request);
            }
            catch (Exception ex)
            {
                return new PasswordResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Export to excel
        /// </summary>
        /// <param name="request">ExportExcelRequest</param>
        /// <returns>Task&lt;ExportExcelResponse&gt;</returns>
        public async Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request)
        {
            try
            {
                var exportTable = await GetWaitingListExportTableAsync(request);
                if (exportTable == null)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Failed to load waiting list for export"
                    };
                }

                if (exportTable.Rows.Count == 0)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "No data available for export"
                    };
                }

                return new ExportExcelResponse
                {
                    IsSuccess = true,
                    FileName = "StudentWaitingList.xlsx",
                    FileContent = DataTableExcelExporter.ToXlsxBytes(exportTable, "StudentWaitingList"),
                    ContentType = DataTableExcelExporter.XlsxContentType,
                    ErrorMessage = ""
                };
            }
            catch (Exception ex)
            {
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <inheritdoc />
        public async Task<ExportExcelResponse> ExportToCsvAsync(ExportExcelRequest request)
        {
            try
            {
                var exportTable = await GetWaitingListExportTableAsync(request);
                if (exportTable == null)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Failed to load waiting list for export"
                    };
                }

                if (exportTable.Rows.Count == 0)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "No data available for export"
                    };
                }

                return new ExportExcelResponse
                {
                    IsSuccess = true,
                    FileName = "StudentWaitingList.csv",
                    FileContent = DataTableCsvExporter.ToCsvBytes(exportTable),
                    ContentType = DataTableCsvExporter.CsvContentType,
                    ErrorMessage = ""
                };
            }
            catch (Exception ex)
            {
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Builds export rows from the waiting list grid (password and StudentClassInfo excluded).
        /// </summary>
        private async Task<DataTable?> GetWaitingListExportTableAsync(ExportExcelRequest request)
        {
            var listResponse = await GetStudentWaitingListAsync(new GetStudentWaitingListRequest
            {
                Username = request.Username ?? "",
                WaitingForOnSite = string.IsNullOrWhiteSpace(request.WaitingForOnSite) ? "N" : request.WaitingForOnSite
            });

            if (!listResponse.IsSuccess)
                return null;

            return BuildWaitingListExportTable(listResponse.StudentWaitingList);
        }

        private static DataTable BuildWaitingListExportTable(IReadOnlyList<StudentWaitingList> students)
        {
            var table = new DataTable("StudentWaitingList");
            table.Columns.Add("Status", typeof(string));
            table.Columns.Add("Student #", typeof(string));
            table.Columns.Add("Student Name", typeof(string));
            table.Columns.Add("Location", typeof(string));
            table.Columns.Add("Class", typeof(string));
            table.Columns.Add("Grade", typeof(string));
            table.Columns.Add("School", typeof(string));
            table.Columns.Add("Parent", typeof(string));
            table.Columns.Add("Phone", typeof(string));
            table.Columns.Add("Email", typeof(string));
            table.Columns.Add("Session", typeof(string));
            table.Columns.Add("Registered Date", typeof(string));
            table.Columns.Add("City", typeof(string));
            table.Columns.Add("State", typeof(string));
            table.Columns.Add("Country", typeof(string));

            foreach (var student in students)
            {
                table.Rows.Add(
                    student.ApplicationStatus ?? "",
                    student.StudentID == 0 ? "" : student.StudentID.ToString(),
                    student.StudentName ?? "",
                    student.EventLocation ?? "",
                    student.Class ?? "",
                    student.Grade ?? "",
                    student.School ?? "",
                    student.ParentName ?? "",
                    student.PhoneNumber ?? "",
                    student.EmailAddress ?? "",
                    student.EventSession ?? "",
                    student.RegisteredDate == default
                        ? ""
                        : student.RegisteredDate.ToString("MM/dd/yyyy"),
                    student.City ?? "",
                    student.State ?? "",
                    student.Country ?? "");
            }

            return table;
        }

        /// <summary>
        /// Matches StudentWaitingList.aspx.cs UpdateClass(): section A if SI/SA or ChapterID != "1", else B.
        /// Applied when the client omits section (or whitespace) so Action=E-style flows still match legacy.
        /// </summary>
        private static void UpdateClassSectionDefault(UpdateStudentWaitingListStatusRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Section))
                return;

            var cls = (request.Class ?? "").Trim();
            var ch = (request.ChapterID ?? "").Trim();
            request.Section = cls == "SI" || cls == "SA" || ch != "1" ? "A" : "B";
        }

        /// <summary>
        /// Legacy InformParent() loads password from DB when the grid/payload omits it.
        /// </summary>
        private async Task EnsureReviewEmailFieldsAsync(UpdateStudentWaitingListStatusRequest request)
        {
            request.Email = (request.Email ?? "").Trim();
            request.FirstName = (request.FirstName ?? "").Trim();
            request.LastName = (request.LastName ?? "").Trim();
            request.Password = (request.Password ?? "").Trim();
            request.Reason = (request.Reason ?? "").Trim();

            if (!string.Equals(request.ApplicationStatus, "A", StringComparison.OrdinalIgnoreCase) ||
                !string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.Email))
            {
                return;
            }

            try
            {
                var passwordResponse = await _repository.GetPasswordAsync(new GetPasswordRequest
                {
                    EmailId = request.Email
                });

                if (passwordResponse.IsSuccess &&
                    !string.IsNullOrWhiteSpace(passwordResponse.Password))
                {
                    request.Password = passwordResponse.Password.Trim();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading password for review email: {ex.Message}");
            }
        }

        /// <summary>
        /// Legacy btnSubmit_Click sends email after DB update; do not block the API on SMTP.
        /// </summary>
        private void QueueReviewEmailNotifications(UpdateStudentWaitingListStatusRequest request)
        {
            var emailRequest = CloneReviewEmailRequest(request);
            var adminNotificationEmail = RegistrationNotificationEmail;
            var systemEmail = SystemEmail;
            var supportEmail = SupportEmail;

            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var emailUtility = scope.ServiceProvider.GetRequiredService<IEmailUtility>();
                    await SendEmailNotificationsAsync(
                        emailRequest,
                        emailUtility,
                        adminNotificationEmail,
                        systemEmail,
                        supportEmail);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email notifications: {ex.Message}");
                }
            });
        }

        private static UpdateStudentWaitingListStatusRequest CloneReviewEmailRequest(
            UpdateStudentWaitingListStatusRequest request)
        {
            return new UpdateStudentWaitingListStatusRequest
            {
                StudentID = request.StudentID,
                Class = request.Class,
                Section = request.Section,
                ChapterID = request.ChapterID,
                Location = request.Location,
                Session = request.Session,
                SessionLabel = request.SessionLabel,
                ClassLabel = request.ClassLabel,
                LocationLabel = request.LocationLabel,
                OriginalLocation = request.OriginalLocation,
                ApplicationStatus = request.ApplicationStatus,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                Reason = request.Reason,
            };
        }

        private static string GetSessionDisplayLabel(UpdateStudentWaitingListStatusRequest request) =>
            !string.IsNullOrWhiteSpace(request.SessionLabel)
                ? request.SessionLabel
                : request.Session;

        private static string GetClassDisplayLabel(UpdateStudentWaitingListStatusRequest request) =>
            !string.IsNullOrWhiteSpace(request.ClassLabel)
                ? request.ClassLabel
                : GetClassDisplayLabelFromCode(request.Class);

        private static string GetLocationDisplayLabel(UpdateStudentWaitingListStatusRequest request) =>
            !string.IsNullOrWhiteSpace(request.LocationLabel)
                ? request.LocationLabel
                : $"{request.ChapterID}-{GetLocationTypeLabel(request.Location)}";

        private static string GetClassDisplayLabelFromCode(string? classCode)
        {
            return (classCode ?? string.Empty).Trim().ToUpperInvariant() switch
            {
                "JB" => "Junior Beginner",
                "JI" => "Junior Intermediate",
                "JA" => "Junior Advanced",
                "SB" => "Senior Beginner",
                "SI" => "Senior Intermediate",
                "SA" => "Senior Advanced",
                "DS" => "Data Science",
                "AI" => "Artificial Intelligence",
                "GD" => "Game Development",
                "AD" => "App Development",
                "DM" => "Data Management",
                "ST" => "PSAT",
                "AT" => "ACT",
                "ED" => "Engineering Design",
                _ => classCode ?? string.Empty
            };
        }

        private static string GetLocationTypeLabel(string? locationCode) =>
            (locationCode ?? string.Empty).Trim().ToUpperInvariant() switch
            {
                "I" => "Internet",
                _ => "OnSite"
            };

        /// <summary>
        /// Send email notifications
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <param name="emailUtility">IEmailUtility</param>
        /// <returns>Task</returns>
        private static async Task SendEmailNotificationsAsync(
            UpdateStudentWaitingListStatusRequest request,
            IEmailUtility emailUtility,
            string adminNotificationEmail,
            string systemEmail,
            string supportEmail)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                Console.WriteLine("Skipping waiting-list review emails: parent email is missing.");
                return;
            }

            await SendEmailToParentAsync(request, emailUtility, systemEmail, supportEmail);

            if (string.Equals(request.ApplicationStatus, "A", StringComparison.OrdinalIgnoreCase))
            {
                await SendEmailToAdminAsync(request, emailUtility, systemEmail, adminNotificationEmail);
            }
        }

        /// <summary>
        /// Send email to admin
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <param name="emailUtility">IEmailUtility</param>
        /// <param name="adminNotificationEmail">Configured admin/recipient address</param>
        /// <returns>Task</returns>
        private static async Task SendEmailToAdminAsync(
            UpdateStudentWaitingListStatusRequest request,
            IEmailUtility emailUtility,
            string systemEmail,
            string adminNotificationEmail)
        {
            try
            {
                var sessionLabel = GetSessionDisplayLabel(request);
                var classLabel = GetClassDisplayLabel(request);
                var locationLabel = GetLocationDisplayLabel(request);

                var subject = $"Agoura Math Circle : New Enrollment request from: {request.FirstName} {request.LastName}.";
                var body = $@"Just Received New registration from {request.FirstName} {request.LastName}<br/>
                             Student Name: {request.FirstName} {request.LastName}<br/>
                             Semester: {sessionLabel}<br/>
                             Student Class: {classLabel}<br/>
                             Student Section: {request.Section}<br/>
                             Location: {locationLabel}<br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                await emailUtility.SendEmailAsync(adminNotificationEmail, systemEmail, subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email to admin: {ex.Message}");
            }
        }

        /// <summary>
        /// Send email to parent
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <param name="emailUtility">IEmailUtility</param>
        /// <param name="systemEmail">Configured system/from address</param>
        /// <param name="supportEmail">Configured support address for body text</param>
        /// <returns>Task</returns>
        private static async Task SendEmailToParentAsync(
            UpdateStudentWaitingListStatusRequest request,
            IEmailUtility emailUtility,
            string systemEmail,
            string supportEmail)
        {
            try
            {
                string subject;
                string body;
                var sessionLabel = GetSessionDisplayLabel(request);
                var classLabel = GetClassDisplayLabel(request);
                var locationLabel = GetLocationDisplayLabel(request);
                var originalLocation = string.IsNullOrWhiteSpace(request.OriginalLocation)
                    ? request.Location
                    : request.OriginalLocation;
                var locationChanged = !string.Equals(
                    originalLocation,
                    request.Location,
                    StringComparison.OrdinalIgnoreCase);

                if (request.ApplicationStatus == "A")
                {
                    if (!locationChanged)
                    {
                        subject = $"Agoura Math Circle : Enrollment Confirmation for {request.FirstName} {request.LastName}.";
                        body = $@"Congrats. We are happy to inform you that you are enrolled in Agoura Math Circle. We have approved your application for {request.FirstName} {request.LastName}.<br/>
                             Semester: {sessionLabel}<br/>
                             Student Class: {classLabel}<br/>
                             Student Section: {request.Section}<br/>
                             Location: {locationLabel}<br/><br/>
                             Your Login Information: <br/>
                             User Name: {request.Email}<br/>
                             Password: {request.Password}<br/><hr>
                             Note: please login and check your kids group and change your password ASAP. <br/><br/>
                             All the Lecture's Notes are available on our YOUTUBE Channel. Please subscribe and ask your kids watch it. It required for all students. <br/><br/>
                             If you have any issues with login, please email {supportEmail}. <br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                    }
                    else
                    {
                        subject = $"Agoura Math Circle : Enrollment Application Status for {request.FirstName} {request.LastName}.";
                        body = $@"Currently, we don't have any open spots for the onsite prgram. You are enrolled in Agoura Math Circle's OnLine/Internet Class. If a spot opens for the onsite class, we will inform you. We have approved your application for {request.FirstName} {request.LastName}.<br/>
                             Semester: {sessionLabel}<br/>
                             Student Class: {classLabel}<br/>
                             Location: {locationLabel}<br/><br/>
                             Your Login Information: <br/>
                             User Name: {request.Email}<br/>
                             Password: {request.Password}<br/><hr>
                             Note: please login and check your kids group and change your password asap. <br/><br/>
                             All the Lecture's Notes are available on our YOUTUBE Channel. Please subscribe and ask your kids watch it. It required for all students. <br/><br/>
                             If you have any issue with login, please email {supportEmail}. <br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                    }
                }
                else
                {
                    subject = $"Agoura Math Circle : Enrollment Application Status for {request.FirstName} {request.LastName}.";
                    body = $@"We can not approve your application for {request.FirstName} {request.LastName}.<br/>
                             Semester: {sessionLabel}<br/>
                             Student Class: {classLabel}<br/>
                             Location: {locationLabel}<br/><br/>
                             Reason: {request.Reason}<br/><br/>
                             If you have any questions, please email {supportEmail}. <br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                }

                await emailUtility.SendEmailAsync(request.Email, systemEmail, subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email to parent: {ex.Message}");
            }
        }
    }
}
