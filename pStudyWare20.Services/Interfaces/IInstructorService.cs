using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for instructor business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IInstructorService
    {
        /// <summary>
        /// Get instructor list
        /// </summary>
        /// <param name="request">Instructor list request</param>
        /// <returns>Instructor list result</returns>
        InstructorListResponse GetInstructorList(InstructorListRequest request);

        /// <summary>
        /// Add or update instructor
        /// </summary>
        /// <param name="request">Instructor request</param>
        /// <returns>Operation result</returns>
        InstructorOperationResponse AddOrUpdateInstructor(InstructorRequest request);

        /// <summary>
        /// Delete instructor
        /// </summary>
        /// <param name="request">Instructor delete request</param>
        /// <returns>Operation result</returns>
        InstructorOperationResponse DeleteInstructor(InstructorDeleteRequest request);

        /// <summary>
        /// Export instructor list to Excel
        /// </summary>
        /// <param name="request">Instructor list request</param>
        /// <returns>Export Excel result</returns>
        ExportExcelResponse ExportInstructorListToExcel(InstructorListRequest request);
    }
}
