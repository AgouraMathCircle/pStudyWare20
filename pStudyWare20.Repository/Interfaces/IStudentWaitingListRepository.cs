using System.Data;
using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for StudentWaitingList repository operations
    /// </summary>
    public interface IStudentWaitingListRepository
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
        /// Get chapter location from AMC_ChapterMaster (Name, Location, City).
        /// </summary>
        /// <param name="request">GetChapterLocationRequest</param>
        /// <returns>Task&lt;ChapterLocationResponse&gt;</returns>
        Task<ChapterLocationResponse> GetChapterLocationAsync(GetChapterLocationRequest request);

        /// <summary>
        /// Active session options from AMC_tblLookupSemester (Semester, LastSemester, NextSemester).
        /// </summary>
        Task<StudentWaitingListSessionOptionsResponse> GetActiveSessionOptionsAsync();

        /// <summary>
        /// Get password
        /// </summary>
        /// <param name="request">GetPasswordRequest</param>
        /// <returns>Task&lt;PasswordResponse&gt;</returns>
        Task<PasswordResponse> GetPasswordAsync(GetPasswordRequest request);

        /// <summary>
        /// Export grid via legacy StudentWaitingList.aspx — AMC_spSelectStudentList @Mode E.
        /// </summary>
        Task<DataTable> GetStudentWaitingListExportTableAsync(string username, string mode = "E");
    }
}
