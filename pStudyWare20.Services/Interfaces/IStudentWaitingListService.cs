using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for StudentWaitingList service operations
    /// </summary>
    public interface IStudentWaitingListService
    {
        /// <summary>
        /// Get student waiting list
        /// </summary>
        /// <param name="request">GetStudentWaitingListRequest</param>
        /// <returns>Task&lt;StudentWaitingListResponse&gt;</returns>
        Task<StudentWaitingListResponse> GetStudentWaitingListAsync(GetStudentWaitingListRequest request);

        /// <summary>
        /// Update student waiting list status
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <returns>Task&lt;OperationResponse&gt;</returns>
        Task<OperationResponse> UpdateStudentWaitingListStatusAsync(UpdateStudentWaitingListStatusRequest request);

        /// <summary>
        /// Delete student
        /// </summary>
        /// <param name="request">DeleteStudentRequest</param>
        /// <returns>Task&lt;OperationResponse&gt;</returns>
        Task<OperationResponse> DeleteStudentAsync(DeleteStudentRequest request);

        /// <summary>
        /// Get chapter location
        /// </summary>
        /// <param name="request">GetChapterLocationRequest</param>
        /// <returns>Task&lt;ChapterLocationResponse&gt;</returns>
        Task<ChapterLocationResponse> GetChapterLocationAsync(GetChapterLocationRequest request);

        /// <summary>
        /// Get password
        /// </summary>
        /// <param name="request">GetPasswordRequest</param>
        /// <returns>Task&lt;PasswordResponse&gt;</returns>
        Task<PasswordResponse> GetPasswordAsync(GetPasswordRequest request);

        /// <summary>
        /// Export to excel
        /// </summary>
        /// <param name="request">ExportExcelRequest</param>
        /// <returns>Task&lt;ExportExcelResponse&gt;</returns>
        Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request);
    }
}
