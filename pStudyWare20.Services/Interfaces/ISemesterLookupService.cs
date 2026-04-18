using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface ISemesterLookupService
    {
        Task<GetSemesterLookupResponse> GetSemesterLookupAsync(string? chapterIdFromClient);
        Task<UpdateSemesterLookupResponse> UpdateSemesterLookupAsync(UpdateSemesterLookupRequest request);
    }
}
