using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of instructor business logic operations (matches legacy controller)
    /// </summary>
    public class InstructorService : IInstructorService
    {
        private readonly IInstructorRepository _instructorRepository;
        private readonly IConfiguration _configuration;
        private readonly IGoogleWorkspaceService _googleWorkspaceService;

        public InstructorService(IInstructorRepository instructorRepository, IConfiguration configuration, IGoogleWorkspaceService googleWorkspaceService)
        {
            _instructorRepository = instructorRepository;
            _configuration = configuration;
            _googleWorkspaceService = googleWorkspaceService;
        }

        /// <summary>
        /// Get instructor list (matches legacy controller exactly)
        /// </summary>
        public InstructorListResponse GetInstructorList(InstructorListRequest request)
        {
            InstructorListResponse response = new InstructorListResponse();
            try
            {
                var result = _instructorRepository.GetInstructorListAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var rows = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(result);
                    if (rows != null && rows.Count > 0)
                    {
                        foreach (var row in rows)
                        {
                            var instructor = new Instructor
                            {
                                InstructorID = GetIntValue(row, "InstructorID"),
                                FirstName = GetStringValue(row, "FirstName"),
                                LastName = GetStringValue(row, "LastName"),
                                EmailID = GetStringValue(row, "EmailID"),
                                ContactPhone = GetStringValue(row, "ContactPhone"),
                                ChapterName = GetStringValue(row, "ChapterName"),
                                ChapterID = GetStringValue(row, "ChapterID"),
                                InstructorType = GetStringValue(row, "InstructorType"),
                                Class = GetStringValue(row, "Class"),
                                Section = GetStringValue(row, "Section"),
                                UserName = GetStringValue(row, "UserName"),
                                MemberStatus = NormalizeMemberStatus(GetStringValue(row, "mStatus")),
                                LastLogin = GetDateTimeValue(row, "LastLogin")
                            };

                            // Create InstructorInfo string for legacy compatibility
                            instructor.InstructorInfo = $"{instructor.FirstName}~#{instructor.LastName}~#{instructor.EmailID}~#{instructor.ContactPhone}~#{instructor.InstructorType}~#{instructor.Class}~#{instructor.Section}~#{instructor.ChapterID}~#{instructor.MemberStatus}";

                            response.InstructorList.Add(instructor);
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Add or update instructor (matches legacy controller exactly)
        /// </summary>
        public InstructorOperationResponse AddOrUpdateInstructor(InstructorRequest request)
        {
            InstructorOperationResponse response = new InstructorOperationResponse();
            try
            {
                request.MemberStatus = NormalizeMemberStatus(request.MemberStatus);

                if (request.InstructorID > 0)
                {
                    request.InstructorType = NormalizeInstructorTypeCode(request.InstructorType);
                }

                var priorState = request.InstructorID > 0
                    ? _instructorRepository.GetInstructorPriorStateAsync(request.InstructorID).Result
                    : null;

                var result = _instructorRepository.AddOrUpdateInstructorAsync(request).Result;

                if (result)
                {
                    SyncGoogleWorkspaceGroup(request, priorState);

                    response.IsSuccess = true;
                    response.ErrorMessage = "";
                    response.Message = "User has been created/Updated successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to add or update instructor";
                    response.Message = "";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
        }
        
        private void SyncGoogleWorkspaceGroup(InstructorRequest request, InstructorGoogleSyncState? priorState)
        {
            try
            {
                var newGroupEmail = _instructorRepository.GetChapterVolunteerEmailGroupAsync(request.ChapterID).Result;
                var newUsername = (request.EmailID ?? "").Trim();

                var memberStatusValue = (request.MemberStatus ?? "1").Trim().ToLowerInvariant();
                var isActive = memberStatusValue is not ("0" or "inactive" or "deactive" or "false");

                var oldGroupEmail = priorState?.VolunteerEmailGroup;
                var oldUsername = (priorState?.EmailID ?? "").Trim();
                var wasActive = priorState?.IsActive ?? false;

                var groupUnchanged = string.Equals(oldGroupEmail, newGroupEmail, StringComparison.OrdinalIgnoreCase)
                    && string.Equals(oldUsername, newUsername, StringComparison.OrdinalIgnoreCase);

                if (wasActive && !string.IsNullOrWhiteSpace(oldGroupEmail) && !string.IsNullOrWhiteSpace(oldUsername)
                    && (!isActive || !groupUnchanged))
                {
                    _googleWorkspaceService.RemoveMemberFromGroupAsync(oldGroupEmail!, oldUsername).Wait();
                }

                if (isActive && !string.IsNullOrWhiteSpace(newGroupEmail) && !string.IsNullOrWhiteSpace(newUsername)
                    && (!wasActive || !groupUnchanged))
                {
                    _googleWorkspaceService.AddMemberToGroupAsync(newGroupEmail!, newUsername).Wait();
                }
            }
            catch (Exception syncEx)
            {
                // Don't fail the primary DB operation over a directory sync issue.
                Console.WriteLine($"Google Workspace sync failed: {syncEx.Message}");
            }
        }
        private void RemoveFromGoogleWorkspaceGroup(InstructorGoogleSyncState? priorState)
        {
            if (priorState == null || !priorState.IsActive) return;
            if (string.IsNullOrWhiteSpace(priorState.VolunteerEmailGroup) || string.IsNullOrWhiteSpace(priorState.EmailID)) return;

            try
            {
                _googleWorkspaceService.RemoveMemberFromGroupAsync(priorState.VolunteerEmailGroup, priorState.EmailID).Wait();
            }
            catch (Exception syncEx)
            {
                Console.WriteLine($"Google Workspace sync failed: {syncEx.Message}");
            }
        }

        /// <summary>
        /// Delete instructor (matches legacy controller exactly)
        /// </summary>
        public InstructorOperationResponse DeleteInstructor(InstructorDeleteRequest request)
        {
            InstructorOperationResponse response = new InstructorOperationResponse();
            try
            {      
                var priorState = _instructorRepository.GetInstructorPriorStateAsync(request.InstructorID).Result;
                var result = _instructorRepository.DeleteInstructorAsync(request).Result;

                if (result)
                {
                    RemoveFromGoogleWorkspaceGroup(priorState);
                    response.IsSuccess = true;
                    response.ErrorMessage = "";
                    response.Message = "User has been deleted successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to delete instructor";
                    response.Message = "";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
        }

        /// <summary>
        /// Export instructor list to Excel (matches legacy controller exactly)
        /// </summary>
        public ExportExcelResponse ExportInstructorListToExcel(InstructorListRequest request)
        {
            ExportExcelResponse response = new ExportExcelResponse();
            try
            {
                var dataTable = _instructorRepository.ExportInstructorListToExcelAsync(request).Result;

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    response.IsSuccess = true;
                    response.ErrorMessage = "";
                    response.FileContent = DataTableExcelExporter.ToXlsxBytes(dataTable, "InstructorList");
                    response.FileName = "InstructorList.xlsx";
                    response.ContentType = DataTableExcelExporter.XlsxContentType;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "No data found to export";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        private static string NormalizeMemberStatus(string? memberStatus)
        {
            var value = (memberStatus ?? "1").Trim().ToLowerInvariant();
            if (value is "0" or "inactive" or "deactive" or "false")
            {
                return "0";
            }

            if (value is "1" or "active")
            {
                return "1";
            }

            return "1";
        }

        private static string NormalizeInstructorTypeCode(string? instructorType)
        {
            var value = (instructorType ?? "P").Trim();
            return value.ToUpperInvariant() switch
            {
                "PRIMARY" => "P",
                "SECONDARY" => "S",
                "COORDINATOR" => "C",
                "VOLUNTEER" or "VOLUNTEERS" => "V",
                "ADMINISTRATOR" => "A",
                _ when value.Length == 1 => value.ToUpperInvariant(),
                _ => "P",
            };
        }

        /// <summary>
        /// Helper method to get string value from JsonElement
        /// </summary>
        private string GetStringValue(Dictionary<string, JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind != JsonValueKind.Null)
            {
                return row[key].GetString() ?? string.Empty;
            }
            return string.Empty;
        }

        /// <summary>
        /// Helper method to get int value from JsonElement
        /// </summary>
        private int GetIntValue(Dictionary<string, JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind != JsonValueKind.Null)
            {
                if (row[key].ValueKind == JsonValueKind.Number)
                {
                    return row[key].GetInt32();
                }
                else if (row[key].ValueKind == JsonValueKind.String)
                {
                    if (int.TryParse(row[key].GetString(), out int result))
                    {
                        return result;
                    }
                }
            }
            return 0;
        }

        /// <summary>
        /// Helper method to get DateTime value from JsonElement
        /// </summary>
        private DateTime? GetDateTimeValue(Dictionary<string, JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind != JsonValueKind.Null)
            {
                if (row[key].ValueKind == JsonValueKind.String)
                {
                    var dateString = row[key].GetString();
                    if (!string.IsNullOrEmpty(dateString) && DateTime.TryParse(dateString, out DateTime result))
                    {
                        return result;
                    }
                }
            }
            return null;
        }
    }
}
