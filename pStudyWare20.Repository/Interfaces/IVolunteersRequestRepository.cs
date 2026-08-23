using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IVolunteersRequestRepository
    {
        Task<GetVolunteersRequestResponse> GetVolunteersRequestAsync(GetVolunteersRequestRequest request);
        Task<OperationResponse> UpdateVolunteerStatusAsync(UpdateVolunteerStatusRequest request);
        Task<OperationResponse> DeleteVolunteerRequestAsync(DeleteVolunteerRequestRequest request);
        Task<GetVolunteerChapterLocationsResponse> GetChapterLocationsAsync();
        Task<string?> GetVolunteerEmailAsync(string requestId);
        Task<string?> GetVolunteerChapterIdAsync(string requestId);
        Task<string?> GetChapterVolunteerEmailGroupAsync(string chapterId);
    }
}
