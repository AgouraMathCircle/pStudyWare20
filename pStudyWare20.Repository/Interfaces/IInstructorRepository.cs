using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for instructor data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IInstructorRepository
    {
        /// <summary>
        /// Get instructor list using stored procedure
        /// </summary>
        /// <param name="request">Instructor list request</param>
        /// <returns>Instructor list data as JSON string</returns>
        Task<string> GetInstructorListAsync(InstructorListRequest request);

        /// <summary>
        /// Add or update instructor using stored procedure
        /// </summary>
        /// <param name="request">Instructor request</param>
        /// <returns>Success status</returns>
        Task<bool> AddOrUpdateInstructorAsync(InstructorRequest request);

        /// <summary>
        /// Get the volunteer email group for a chapter
        /// </summary>
        /// <param name="chapterId">Chapter ID</param>
        /// <returns>Volunteer email group</returns>
        Task<string?> GetChapterVolunteerEmailGroupAsync(string chapterId);

        /// <summary>
        /// Snapshot of an existing instructor's email/chapter-group/active-state,
        /// captured before AddOrUpdateInstructorAsync overwrites it.
        /// </summary>
        /// <param name="instructorId">Instructor ID (MemberMaster.pMemberID)</param>
        /// <returns>Prior state, or null if the instructor does not exist</returns>
        Task<InstructorGoogleSyncState?> GetInstructorPriorStateAsync(int instructorId);

        /// <summary>
        /// Delete instructor using stored procedure
        /// </summary>
        /// <param name="request">Instructor delete request</param>
        /// <returns>Success status</returns>
        Task<bool> DeleteInstructorAsync(InstructorDeleteRequest request);

        /// <summary>
        /// Export instructor list to Excel using stored procedure
        /// </summary>
        /// <param name="request">Instructor list request</param>
        /// <returns>Excel data as DataTable</returns>
        Task<System.Data.DataTable> ExportInstructorListToExcelAsync(InstructorListRequest request);
    }
}
