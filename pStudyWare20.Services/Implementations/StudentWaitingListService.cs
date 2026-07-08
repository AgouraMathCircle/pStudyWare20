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

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="repository">IStudentWaitingListRepository</param>
        /// <param name="serviceScopeFactory">IServiceScopeFactory</param>
        public StudentWaitingListService(
            IStudentWaitingListRepository repository,
            IServiceScopeFactory serviceScopeFactory)
        {
            _repository = repository;
            _serviceScopeFactory = serviceScopeFactory;
            
        }

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
                OperationResponse response;
                if (string.Equals(request.ApplicationStatus, "A", StringComparison.OrdinalIgnoreCase))
                {
                    UpdateClassSectionDefault(request);
                    response = await _repository.UpdateStudentWaitingListStatusAsync(request);
                }
                else
                    response = await _repository.DeleteStudentAsync(new DeleteStudentRequest
                    {
                        StudentId = request.StudentID ?? ""
                    });

                if (response.IsSuccess)
                    QueueReviewEmailNotifications(request);

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
        /// Get chapter location
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
        /// Legacy btnSubmit_Click sends email after DB update; do not block the API on SMTP.
        /// </summary>
        private void QueueReviewEmailNotifications(UpdateStudentWaitingListStatusRequest request)
        {
            var emailRequest = CloneReviewEmailRequest(request);

            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var emailUtility = scope.ServiceProvider.GetRequiredService<IEmailUtility>();
                    await SendEmailNotificationsAsync(emailRequest, emailUtility);
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
                ApplicationStatus = request.ApplicationStatus,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                Reason = request.Reason,
            };
        }

        /// <summary>
        /// Send email notifications
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <param name="emailUtility">IEmailUtility</param>
        /// <returns>Task</returns>
        private static async Task SendEmailNotificationsAsync(
            UpdateStudentWaitingListStatusRequest request,
            IEmailUtility emailUtility)
        {
            await SendEmailToAdminAsync(request, emailUtility);
            await SendEmailToParentAsync(request, emailUtility);
        }

        /// <summary>
        /// Send email to admin
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <param name="emailUtility">IEmailUtility</param>
        /// <returns>Task</returns>
        private static async Task SendEmailToAdminAsync(
            UpdateStudentWaitingListStatusRequest request,
            IEmailUtility emailUtility)
        {
            try
            {

               // string fromEmail = _configuration.GetSection("AppSettings")["Email"] ?? "info@agouramathcircle.net";

                var subject = $"Agoura Math Circle : New Enrollment request from: {request.FirstName} {request.LastName}.";
                var body = $@"Just Received New registration from {request.FirstName} {request.LastName}<br/>
                             Student Name: {request.FirstName} {request.LastName}<br/>
                             Session: {request.Session}<br/>
                             Student Class: {request.Class}<br/>
                             Student Section: {request.Section}<br/>
                             Location: {request.ChapterID}-{request.Location}<br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                await emailUtility.SendEmailAsync("info@agouramathcircle.org", request.Email, subject, body);
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
        /// <returns>Task</returns>
        private static async Task SendEmailToParentAsync(
            UpdateStudentWaitingListStatusRequest request,
            IEmailUtility emailUtility)
        {
            try
            {
                string subject;
                string body;

                if (request.ApplicationStatus == "A")
                {
                    subject = $"Agoura Math Circle : Enrollment Confirmation for {request.FirstName} {request.LastName}.";
                    body = $@"Congrats. We are happy to inform you that you are enrolled in Agoura Math Circle. We have approved your application for {request.FirstName} {request.LastName}.<br/>
                             Session: {request.Session}<br/>
                             Student Class: {request.Class}<br/>
                             Student Section: {request.Section}<br/>
                             Location: {request.ChapterID}-{request.Location}<br/><br/>
                             Your Login Information: <br/>
                             User Name: {request.Email}<br/>
                             Password: {request.Password}<br/><hr>
                             Note: please login and check your kids group and change your password ASAP. <br/><br/>
                             All the Lecture's Notes are available on our YOUTUBE Channel. Please subscribe and ask your kids watch it. It required for all students. <br/><br/>
                             If you have any issues with login, please email support@agouramathcircle.org. <br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                }
                else
                {
                    subject = $"Agoura Math Circle : Enrollment Application Status for {request.FirstName} {request.LastName}.";
                    body = $@"We can not approve your application for {request.FirstName} {request.LastName}.<br/>
                             Session: {request.Session}<br/>
                             Student Class: {request.Class}<br/>
                             Location: {request.ChapterID}-{request.Location}<br/><br/>
                             Reason: {request.Reason}<br/><br/>
                             If you have any questions, please email support@agouramathcircle.org. <br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";
                }

                await emailUtility.SendEmailAsync(request.Email, "admin@agouramathcircle.org", subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email to parent: {ex.Message}");
            }
        }
    }
}
