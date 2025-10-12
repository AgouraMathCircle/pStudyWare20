using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for registered student list business logic
    /// </summary>
    public interface IRegisteredStudentListService
    {
        /// <summary>
        /// Get registered student list
        /// </summary>
        /// <param name="request">Registered student list request</param>
        /// <returns>Registered student list response</returns>
        Task<RegisteredStudentListResponse> GetRegisteredStudentListAsync(RegisteredStudentListRequest request);

        /// <summary>
        /// Update student class information
        /// </summary>
        /// <param name="request">Update student class request</param>
        /// <returns>Update student class response</returns>
        Task<UpdateStudentClassResponse> UpdateStudentClassAsync(UpdateStudentClassRequest request);

        /// <summary>
        /// Delete student registration
        /// </summary>
        /// <param name="request">Delete student request</param>
        /// <returns>Delete student response</returns>
        Task<DeleteStudentResponse> DeleteStudentAsync(DeleteStudentRequest request);

        /// <summary>
        /// Get student details for update
        /// </summary>
        /// <param name="request">Get student for update request</param>
        /// <returns>Get student for update response</returns>
        Task<GetStudentForUpdateResponse> GetStudentForUpdateAsync(GetStudentForUpdateRequest request);

        /// <summary>
        /// Get chapter locations
        /// </summary>
        /// <param name="request">Chapter location request</param>
        /// <returns>Chapter location response</returns>
        Task<ChapterLocationResponse> GetChapterLocationsAsync(GetChapterLocationRequest request);

        /// <summary>
        /// Export student list to Excel
        /// </summary>
        /// <param name="request">Export Excel request</param>
        /// <returns>Export Excel response</returns>
        Task<ExportStudentListExcelResponse> ExportStudentListToExcelAsync(ExportStudentListExcelRequest request);

        /// <summary>
        /// Get registered student list dashboard data
        /// </summary>
        /// <param name="request">Dashboard request</param>
        /// <returns>Dashboard response</returns>
        Task<RegisteredStudentListDashboardResponse> GetDashboardDataAsync(RegisteredStudentListDashboardRequest request);

        /// <summary>
        /// Handle student action (Edit, Delete)
        /// </summary>
        /// <param name="request">Student action request</param>
        /// <returns>Student action response</returns>
        Task<StudentActionResponse> HandleStudentActionAsync(StudentActionRequest request);
    }
}
