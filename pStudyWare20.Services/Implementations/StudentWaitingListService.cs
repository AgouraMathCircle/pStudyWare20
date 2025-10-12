using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of IStudentWaitingListService
    /// </summary>
    public class StudentWaitingListService : IStudentWaitingListService
    {
        private readonly IStudentWaitingListRepository _repository;
        private readonly IEmailUtility _emailUtility;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="repository">IStudentWaitingListRepository</param>
        /// <param name="emailUtility">IEmailUtility</param>
        public StudentWaitingListService(IStudentWaitingListRepository repository, IEmailUtility emailUtility)
        {
            _repository = repository;
            _emailUtility = emailUtility;
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
                var response = await _repository.UpdateStudentWaitingListStatusAsync(request);

                if (response.IsSuccess)
                {
                    // Send email notifications
                    await SendEmailNotificationsAsync(request);
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
                return await _repository.ExportToExcelAsync(request);
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
        /// Send email notifications
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <returns>Task</returns>
        private async Task SendEmailNotificationsAsync(UpdateStudentWaitingListStatusRequest request)
        {
            try
            {
                // Send email to admin
                await SendEmailToAdminAsync(request);

                // Send email to parent
                await SendEmailToParentAsync(request);
            }
            catch (Exception ex)
            {
                // Log error but don't fail the operation
                Console.WriteLine($"Error sending email notifications: {ex.Message}");
            }
        }

        /// <summary>
        /// Send email to admin
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <returns>Task</returns>
        private async Task SendEmailToAdminAsync(UpdateStudentWaitingListStatusRequest request)
        {
            try
            {
                var subject = $"Agoura Math Circle : New Enrollment request from: {request.FirstName} {request.LastName}.";
                var body = $@"Just Received New registration from {request.FirstName} {request.LastName}<br/>
                             Student Name: {request.FirstName} {request.LastName}<br/>
                             Session: {request.Session}<br/>
                             Student Class: {request.Class}<br/>
                             Student Section: {request.Section}<br/>
                             Location: {request.ChapterID}-{request.Location}<br/><br/>
                             Regards <br> Agoura Math Circle<b/> <br/>www.agouramathcircle.org";

                await _emailUtility.SendEmailAsync("admin@agouramathcircle.org", request.Email, subject, body);
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
        /// <returns>Task</returns>
        private async Task SendEmailToParentAsync(UpdateStudentWaitingListStatusRequest request)
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

                await _emailUtility.SendEmailAsync(request.Email, "admin@agouramathcircle.org", subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email to parent: {ex.Message}");
            }
        }
    }
}
