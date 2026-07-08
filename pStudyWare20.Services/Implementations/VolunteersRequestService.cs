using System.Data;
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

        public async Task<GetVolunteerChapterLocationsResponse> GetChapterLocationsAsync()
        {
            return await _repository.GetChapterLocationsAsync();
        }

        public async Task<ExportExcelResponse> ExportToExcelAsync(ExportExcelRequest request)
        {
            try
            {
                var listResponse = await _repository.GetVolunteersRequestAsync(new GetVolunteersRequestRequest
                {
                    Username = request.Username ?? ""
                });

                if (!listResponse.IsSuccess || listResponse.VolunteersRequest == null || listResponse.VolunteersRequest.Count == 0)
                {
                    return new ExportExcelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = listResponse.ErrorMessage ?? "No data available for export.",
                        FileContent = Array.Empty<byte>(),
                        FileName = "",
                        ContentType = ""
                    };
                }

                var dt = new DataTable();
                dt.Columns.Add("VolunteerID", typeof(int));
                dt.Columns.Add("VolunteerName", typeof(string));
                dt.Columns.Add("Grade", typeof(string));
                dt.Columns.Add("Location", typeof(string));
                dt.Columns.Add("School", typeof(string));
                dt.Columns.Add("Phone", typeof(string));
                dt.Columns.Add("Email", typeof(string));
                dt.Columns.Add("City", typeof(string));
                dt.Columns.Add("EnrolledSession", typeof(string));
                dt.Columns.Add("Interest", typeof(string));
                dt.Columns.Add("Status", typeof(string));
                dt.Columns.Add("InsertDate", typeof(DateTime));
                dt.Columns.Add("Comments", typeof(string));

                foreach (var r in listResponse.VolunteersRequest)
                {
                    dt.Rows.Add(
                        r.VolunteerID,
                        r.VolunteerName,
                        r.Grade,
                        r.Location,
                        r.School,
                        r.Phone,
                        r.Email,
                        r.City,
                        r.EnrolledSession,
                        r.Interest,
                        r.Status,
                        r.InsertDate,
                        r.Comments ?? "");
                }

                return new ExportExcelResponse
                {
                    IsSuccess = true,
                    FileName = "VolunteersRequest.xlsx",
                    FileContent = DataTableExcelExporter.ToXlsxBytes(dt, "VolunteersRequest"),
                    ContentType = DataTableExcelExporter.XlsxContentType,
                    ErrorMessage = ""
                };
            }
            catch (Exception ex)
            {
                return new ExportExcelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    FileContent = Array.Empty<byte>(),
                    FileName = "",
                    ContentType = ""
                };
            }
        }
    }
}
