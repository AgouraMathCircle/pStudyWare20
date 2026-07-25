using Microsoft.AspNetCore.Http;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Security.Claims;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for managing volunteer availability business logic
    /// </summary>
    public class VolunteerAvailabilityService : IVolunteerAvailabilityService
    {
        private readonly IVolunteerAvailabilityRepository _volunteerAvailabilityRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VolunteerAvailabilityService(
            IVolunteerAvailabilityRepository volunteerAvailabilityRepository,
            IMemberRepository memberRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _volunteerAvailabilityRepository = volunteerAvailabilityRepository;
            _memberRepository = memberRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Updates the volunteer availability using the repository
        /// </summary>
        public async Task<VolunteerAvailabilityResponse> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request)
        {
            try
            {
                var chapterId = GetChapterIdFromContext();
                var (currentSession, currentSemester, _) =
                    await _memberRepository.GetCurrentSessionAndSemesterAsync(chapterId);
                request.Session = VolunteerAvailabilitySessionHelper.NormalizeSubmittedSession(
                    request.Session,
                    currentSession);
                request.Semester = VolunteerAvailabilitySessionHelper.FormatSemesterForDb(currentSemester);

                var validationMessage = await ValidateTargetSessionAsync(request.Session, currentSession);
                if (validationMessage != null)
                {
                    return new VolunteerAvailabilityResponse
                    {
                        IsSuccess = false,
                        Message = validationMessage,
                    };
                }

                var success = await _volunteerAvailabilityRepository.UpdateVolunteerAvailabilityAsync(request);
                
                if (success)
                {
                    var summaryRows = await GetSummaryRowsAfterSaveAsync(request);

                    return new VolunteerAvailabilityResponse
                    {
                        IsSuccess = true,
                        Message = "Volunteer availability updated successfully.",
                        Session = request.Session,
                        SummaryData = summaryRows,
                    };
                }
                else
                {
                    return new VolunteerAvailabilityResponse
                    {
                        IsSuccess = false,
                        Message = "Failed to update volunteer availability."
                    };
                }
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilityResponse
                {
                    IsSuccess = false,
                    Message = $"An error occurred while updating volunteer availability: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets the volunteer availability using the repository
        /// </summary>
        public async Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request)
        {
            try
            {
                var chapterId = GetChapterIdFromContext();
                var (currentSession, currentSemester, _) =
                    await _memberRepository.GetCurrentSessionAndSemesterAsync(chapterId);
                request.Session = VolunteerAvailabilitySessionHelper.NormalizeSubmittedSession(
                    request.Session,
                    currentSession);
                request.Semester = VolunteerAvailabilitySessionHelper.FormatSemesterForDb(currentSemester);

                return await _volunteerAvailabilityRepository.GetVolunteerAvailabilityAsync(request);
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilitySelectResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"An error occurred while getting volunteer availability: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets the volunteer availability summary using the repository
        /// </summary>
        public async Task<VolunteerAvailabilitySummaryResponse> GetVolunteerAvailabilitySummaryAsync(VolunteerAvailabilitySummaryRequest request)
        {
            try
            {
                var username = (request.Username ?? string.Empty).Trim();
                if (string.IsNullOrEmpty(username))
                {
                    username = GetPortalUsernameFromContext();
                }

                if (string.IsNullOrEmpty(username))
                {
                    return new VolunteerAvailabilitySummaryResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Username is required.",
                    };
                }

                var summaryData = await _volunteerAvailabilityRepository.GetVolunteerAvailabilitySummaryAsync(username);
                var rows = NormalizeSummaryData(summaryData);

                return new VolunteerAvailabilitySummaryResponse
                {
                    IsSuccess = true,
                    SummaryData = rows
                };
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilitySummaryResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"An error occurred while getting volunteer availability summary: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets target session and prompt for the volunteer availability form.
        /// </summary>
        public async Task<VolunteerAvailabilityFormContextResponse> GetVolunteerAvailabilityFormContextAsync(string chapterId)
        {
            try
            {
                var (currentSession, currentSemester, _) =
                    await _memberRepository.GetCurrentSessionAndSemesterAsync(chapterId);

                var targetSession = VolunteerAvailabilitySessionHelper.GetTargetSession(currentSession);

                return new VolunteerAvailabilityFormContextResponse
                {
                    IsSuccess = true,
                    CurrentSession = currentSession,
                    TargetSession = targetSession,
                    VolunteeringPrompt =
                        VolunteerAvailabilitySessionHelper.BuildVolunteeringPrompt(targetSession),
                    Semester = VolunteerAvailabilitySessionHelper.FormatSemesterForDb(currentSemester),
                };
            }
            catch (Exception ex)
            {
                return new VolunteerAvailabilityFormContextResponse
                {
                    IsSuccess = false,
                    ErrorMessage =
                        $"An error occurred while getting volunteer availability form context: {ex.Message}",
                };
            }
        }

        private string GetChapterIdFromContext()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            return httpContext?.User?.FindFirst("ChapterID")?.Value
                   ?? httpContext?.User?.FindFirst("chapterId")?.Value
                   ?? string.Empty;
        }

        private string GetPortalUsernameFromContext()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            return httpContext?.User?.FindFirst("Username")?.Value
                   ?? httpContext?.User?.FindFirst(ClaimTypes.Name)?.Value
                   ?? httpContext?.User?.FindFirst(ClaimTypes.Email)?.Value
                   ?? string.Empty;
        }

        private async Task<List<Dictionary<string, object?>>> GetSummaryRowsAfterSaveAsync(
            VolunteerAvailabilityRequest request)
        {
            var summaryRows = await LoadSummaryRowsAsync();
            var savedRow = await BuildSavedGridRowAsync(request, summaryRows);
            return UpsertSummaryRow(summaryRows, savedRow, request.UserID);
        }

        private async Task<Dictionary<string, object?>> BuildSavedGridRowAsync(
            VolunteerAvailabilityRequest request,
            IReadOnlyList<Dictionary<string, object?>> existingSummaryRows)
        {
            var userId = (request.UserID ?? string.Empty).Trim();
            var existingRow = existingSummaryRows.FirstOrDefault(row => RowMatchesInstructor(row, userId));

            MemberMaster? member = null;
            if (int.TryParse(userId, out var memberId))
            {
                member = await _memberRepository.GetMemberByIdAsync(memberId);
            }

            var firstName = member?.FirstName
                            ?? GetRowString(existingRow, "FirstName")
                            ?? string.Empty;
            var lastName = member?.LastName
                           ?? GetRowString(existingRow, "LastName")
                           ?? string.Empty;
            var instructorType = MapInstructorTypeLabel(
                member?.MemberType,
                GetRowString(existingRow, "InstructorType"));
            var className = GetRowString(existingRow, "Class") ?? string.Empty;
            var chapterName = GetRowString(existingRow, "ChapterName") ?? string.Empty;
            var response = (request.Response ?? string.Empty).Trim().ToUpperInvariant();
            var availability = response == "Y" ? "Yes" : response == "N" ? "No" : response;

            return new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
            {
                ["InstructorID"] = userId,
                ["FirstName"] = firstName,
                ["LastName"] = lastName,
                ["ChapterName"] = chapterName,
                ["Session"] = request.Session,
                ["Class"] = className,
                ["InstructorType"] = instructorType,
                ["Availability"] = availability,
                ["Comments"] = request.Comment ?? string.Empty,
                ["ResponseDate"] = DateTime.Now,
            };
        }

        private static List<Dictionary<string, object?>> UpsertSummaryRow(
            List<Dictionary<string, object?>> rows,
            Dictionary<string, object?> savedRow,
            string userId)
        {
            var list = rows ?? new List<Dictionary<string, object?>>();
            var index = list.FindIndex(row => RowMatchesInstructor(row, userId));

            if (index >= 0)
            {
                foreach (var entry in savedRow)
                {
                    if (entry.Key.Equals("Class", StringComparison.OrdinalIgnoreCase)
                        && string.IsNullOrWhiteSpace(Convert.ToString(entry.Value)))
                    {
                        continue;
                    }

                    list[index][entry.Key] = entry.Value;
                }

                return list;
            }

            list.Insert(0, savedRow);
            return list;
        }

        private static bool RowMatchesInstructor(Dictionary<string, object?> row, string userId)
        {
            var left = GetRowString(row, "InstructorID") ?? string.Empty;
            return !string.IsNullOrWhiteSpace(left)
                   && string.Equals(left.Trim(), userId.Trim(), StringComparison.OrdinalIgnoreCase);
        }

        private static string? GetRowString(Dictionary<string, object?>? row, string key)
        {
            if (row == null)
            {
                return null;
            }

            foreach (var entry in row)
            {
                if (!entry.Key.Equals(key, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                return entry.Value == null ? null : Convert.ToString(entry.Value)?.Trim();
            }

            return null;
        }

        private static string MapInstructorTypeLabel(string? memberType, string? existingLabel)
        {
            if (!string.IsNullOrWhiteSpace(existingLabel)
                && existingLabel.Length > 1
                && !existingLabel.Equals("A", StringComparison.OrdinalIgnoreCase)
                && !existingLabel.Equals("I", StringComparison.OrdinalIgnoreCase)
                && !existingLabel.Equals("V", StringComparison.OrdinalIgnoreCase)
                && !existingLabel.Equals("C", StringComparison.OrdinalIgnoreCase)
                && !existingLabel.Equals("P", StringComparison.OrdinalIgnoreCase)
                && !existingLabel.Equals("S", StringComparison.OrdinalIgnoreCase))
            {
                return existingLabel.Trim();
            }

            return (memberType ?? existingLabel ?? string.Empty).Trim().ToUpperInvariant() switch
            {
                "P" => "Primary Instructor",
                "I" => "Primary Instructor",
                "S" => "Secondary Instructor",
                "C" => "Coordinator",
                "V" => "Volunteers",
                "A" => "Administrator",
                _ => existingLabel?.Trim() ?? memberType?.Trim() ?? string.Empty,
            };
        }

        private async Task<List<Dictionary<string, object?>>> LoadSummaryRowsAsync()
        {
            var portalUsername = GetPortalUsernameFromContext();
            if (string.IsNullOrWhiteSpace(portalUsername))
            {
                return new List<Dictionary<string, object?>>();
            }

            var summaryData =
                await _volunteerAvailabilityRepository.GetVolunteerAvailabilitySummaryAsync(portalUsername);
            return NormalizeSummaryData(summaryData);
        }

        private static Task<string?> ValidateTargetSessionAsync(string session, string currentSession)
        {
            var submittedSession = (session ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(submittedSession))
            {
                return Task.FromResult<string?>("Session is required.");
            }

            var expectedSession = VolunteerAvailabilitySessionHelper.GetTargetSession(currentSession);
            if (string.IsNullOrWhiteSpace(expectedSession))
            {
                return Task.FromResult<string?>(null);
            }

            if (!string.Equals(submittedSession, expectedSession, StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult<string?>(
                    $"Session must be {expectedSession} for volunteer availability.");
            }

            return Task.FromResult<string?>(null);
        }

        /// <summary>
        /// Convert DataTable from AMC_spVolunteerAvailability_Summary to JSON-friendly row dictionaries
        /// </summary>
        private static List<Dictionary<string, object?>> NormalizeSummaryData(object summaryData)
        {
            if (summaryData is DataTable dt)
                return DataTableToRows(dt);
            if (summaryData is List<Dictionary<string, object?>> already)
                return already;
            return new List<Dictionary<string, object?>>();
        }

        private static List<Dictionary<string, object?>> DataTableToRows(DataTable dt)
        {
            var list = new List<Dictionary<string, object?>>(dt.Rows.Count);
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
                foreach (DataColumn col in dt.Columns)
                {
                    var val = row[col];
                    dict[col.ColumnName] = val == DBNull.Value ? null : val;
                }
                list.Add(dict);
            }
            return list;
        }
    }
}
