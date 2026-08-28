using System.Data;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class VolunteersRequestService : IVolunteersRequestService
    {
        private readonly IVolunteersRequestRepository _repository;
        private readonly IGoogleWorkspaceService _googleWorkspaceService;

        public VolunteersRequestService(IVolunteersRequestRepository repository, IGoogleWorkspaceService googleWorkspaceService)
        {
            _repository = repository;
            _googleWorkspaceService = googleWorkspaceService;
        }

        public async Task<GetVolunteersRequestResponse> GetVolunteersRequestAsync(GetVolunteersRequestRequest request)
        {
            return await _repository.GetVolunteersRequestAsync(request);
        }

        public async Task<OperationResponse> UpdateVolunteerStatusAsync(UpdateVolunteerStatusRequest request)
        {        
            var email = await _repository.GetVolunteerEmailAsync(request.VolundeerID);
            var oldGroupEmail = !string.IsNullOrWhiteSpace(email)
                ? await _repository.GetExistingMemberVolunteerEmailGroupAsync(email)
                : null;

            var response = await _repository.UpdateVolunteerStatusAsync(request);

            if (response.IsSuccess)
            {
                try
                {
                    var newGroupEmail = await _repository.GetChapterVolunteerEmailGroupAsync(request.ChapterID);

                    if (!string.IsNullOrWhiteSpace(email))
                    {
                        if (!string.IsNullOrWhiteSpace(oldGroupEmail)
                            && !string.Equals(oldGroupEmail, newGroupEmail, StringComparison.OrdinalIgnoreCase))
                        {
                            await _googleWorkspaceService.RemoveMemberFromGroupAsync(oldGroupEmail, email);
                        }

                        if (!string.IsNullOrWhiteSpace(newGroupEmail))
                        {
                            await _googleWorkspaceService.AddMemberToGroupAsync(newGroupEmail, email);
                        }
                    }
                }
                catch (Exception syncEx)
                {
                    // Don't fail the approval over a directory sync issue.
                    Console.WriteLine($"Google Workspace sync failed: {syncEx.Message}");
                }
            }

            return response;
        }

        public async Task<OperationResponse> DeleteVolunteerRequestAsync(DeleteVolunteerRequestRequest request)
        {
            // AMC_tblVolunteersRequest.ChapterID is never updated by approval (it stays at
            // whatever chapter was originally requested), so it can't be trusted for "which
            // group are they actually in" if an admin approved into a different chapter — look
            // up their real current chapter via MemberMaster instead (same as the edit flow).
            var email = await _repository.GetVolunteerEmailAsync(request.RequestID);
            var groupEmail = !string.IsNullOrWhiteSpace(email)
                ? await _repository.GetExistingMemberVolunteerEmailGroupAsync(email)
                : null;

            var response = await _repository.DeleteVolunteerRequestAsync(request);

            if (response.IsSuccess && !string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(groupEmail))
            {
                try
                {
                    await _googleWorkspaceService.RemoveMemberFromGroupAsync(groupEmail, email);
                }
                catch (Exception syncEx)
                {
                    Console.WriteLine($"Google Workspace sync failed: {syncEx.Message}");
                }
            }

            return response;
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
