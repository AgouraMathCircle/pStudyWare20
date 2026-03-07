using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class VolunteersRequestService : IVolunteersRequestService
    {
        private readonly IVolunteersRequestRepository _repository;

        public VolunteersRequestService(IVolunteersRequestRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetVolunteersRequestResponse> GetVolunteersRequestAsync(GetVolunteersRequestRequest request)
        {
            return await _repository.GetVolunteersRequestAsync(request);
        }

        public async Task<OperationResponse> UpdateVolunteerStatusAsync(UpdateVolunteerStatusRequest request)
        {
            return await _repository.UpdateVolunteerStatusAsync(request);
        }

        public async Task<OperationResponse> DeleteVolunteerRequestAsync(DeleteVolunteerRequestRequest request)
        {
            return await _repository.DeleteVolunteerRequestAsync(request);
        }

        public async Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request)
        {
            return await _repository.ExportToExcelAsync(request);
        }
    }
}
