using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface IVolunteersRequestService
    {
        Task<GetVolunteersRequestResponse> GetVolunteersRequestAsync(GetVolunteersRequestRequest request);
        Task<OperationResponse> UpdateVolunteerStatusAsync(UpdateVolunteerStatusRequest request);
        Task<OperationResponse> DeleteVolunteerRequestAsync(DeleteVolunteerRequestRequest request);
        Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request);
        Task<GetVolunteerChapterLocationsResponse> GetChapterLocationsAsync();
    }
}
