using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IRegistrationLookupRepository
    {
        /// <summary>
        /// Active AMC_tblLookupSemester row: Semester and LastSemester for registration.
        /// </summary>
        Task<List<RegistrationSemesterOption>> GetRegistrationSemesterOptionsAsync();

    /// <summary>
    /// Active course/location rows from AMC_ChapterMaster for registration.
    /// </summary>
    Task<List<RegistrationLocationOption>> GetRegistrationLocationOptionsAsync();
    }
}
