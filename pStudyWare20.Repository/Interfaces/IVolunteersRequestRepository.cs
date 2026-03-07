using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IVolunteersRequestRepository
    {
        Task<GetVolunteersRequestResponse> GetVolunteersRequestAsync(GetVolunteersRequestRequest request);
        Task<OperationResponse> UpdateVolunteerStatusAsync(UpdateVolunteerStatusRequest request);
        Task<OperationResponse> DeleteVolunteerRequestAsync(DeleteVolunteerRequestRequest request);
        Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request);
    }
}
