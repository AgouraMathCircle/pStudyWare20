using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for meeting details business logic
    /// </summary>
    public class MeetingDetailsService : IMeetingDetailsService
    {
        private readonly IMeetingDetailsRepository _meetingDetailsRepository;

        public MeetingDetailsService(IMeetingDetailsRepository meetingDetailsRepository)
        {
            _meetingDetailsRepository = meetingDetailsRepository;
        }

        /// <summary>
        /// Dashboard meeting schedules for the signed-in user via AMC_spMeetingSchedule_Select
        /// (legacy BingMeetingSchedule — student, instructor, volunteer, chapter admin).
        /// </summary>
        public async Task<MeetingScheduleListResponse> GetMeetingScheduleListAsync(MeetingScheduleListRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.UserName))
                {
                    return new MeetingScheduleListResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Username is required."
                    };
                }

                var meetingSchedulesData = await _meetingDetailsRepository
                    .GetMeetingScheduleListByUserAsync(request.UserName.Trim());

                var meetingSchedulesList = MapDataTableToMeetingScheduleList(meetingSchedulesData);

                return new MeetingScheduleListResponse
                {
                    IsSuccess = true,
                    MeetingSchedules = meetingSchedulesList
                };
            }
            catch (Exception ex)
            {
                return new MeetingScheduleListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// SystemAdmin Meeting Details grid — all rows via AMC_tblMeetingSchedule_Select.
        /// </summary>
        public async Task<MeetingScheduleListResponse> GetMeetingScheduleGridListAsync(MeetingScheduleListRequest request)
        {
            try
            {
                var meetingSchedulesData = await _meetingDetailsRepository
                    .GetMeetingScheduleListAsync(request.RowId ?? "0");

                var meetingSchedulesList = MapDataTableToMeetingScheduleList(meetingSchedulesData);

                return new MeetingScheduleListResponse
                {
                    IsSuccess = true,
                    MeetingSchedules = meetingSchedulesList
                };
            }
            catch (Exception ex)
            {
                return new MeetingScheduleListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private static List<MeetingSchedule> MapDataTableToMeetingScheduleList(object meetingSchedulesData)
        {
            var meetingSchedulesList = new List<MeetingSchedule>();
            if (meetingSchedulesData is not DataTable dataTable || dataTable.Rows.Count == 0)
                return meetingSchedulesList;

            foreach (DataRow row in dataTable.Rows)
            {
                var meetingSchedule = new MeetingSchedule
                {
                    RowId = dataTable.Columns.Contains("RowID") && row["RowID"] != DBNull.Value ? Convert.ToInt32(row["RowID"]) : 0,
                    ChapterId = dataTable.Columns.Contains("ChapterID") ? row["ChapterID"]?.ToString() ?? "" : "",
                    ChapterName = dataTable.Columns.Contains("ChapterName") ? row["ChapterName"]?.ToString() ?? "" : "",
                    Class = dataTable.Columns.Contains("Class") ? row["Class"]?.ToString() ?? "" : "",
                    Section = dataTable.Columns.Contains("Section") ? row["Section"]?.ToString() ?? "" : "",
                    MeetingProviderUrl = dataTable.Columns.Contains("MeetingProviderURL") ? row["MeetingProviderURL"]?.ToString() ?? "" : "",
                    MeetingUrl = dataTable.Columns.Contains("MeetingURL") ? row["MeetingURL"]?.ToString() ?? "" : "",
                    MeetingId = dataTable.Columns.Contains("MeetingID") ? row["MeetingID"]?.ToString() ?? "" : "",
                    Passcode = dataTable.Columns.Contains("Passcode") ? row["Passcode"]?.ToString() ?? "" : "",
                    AdminLogin = dataTable.Columns.Contains("AdminLogin") ? row["AdminLogin"]?.ToString() ?? "" : "",
                    AdminPassCode = dataTable.Columns.Contains("AdminPassCode") ? row["AdminPassCode"]?.ToString() ?? "" : "",
                    IncludeSection = dataTable.Columns.Contains("IncludeSection") && ParseLegacyBool(row["IncludeSection"]),
                    Active = dataTable.Columns.Contains("Active") && ParseLegacyBool(row["Active"]),
                    MeetingTime = dataTable.Columns.Contains("MeetingTime") ? row["MeetingTime"]?.ToString() ?? "" : "",
                    MeetingDate = dataTable.Columns.Contains("MeetingDate") ? row["MeetingDate"]?.ToString() ?? "" : ""
                };
                meetingSchedulesList.Add(meetingSchedule);
            }
            return meetingSchedulesList;
        }

        /// <summary>
        /// Get specific meeting schedule by ID
        /// </summary>
        public async Task<GetMeetingScheduleResponse> GetMeetingScheduleByIdAsync(GetMeetingScheduleRequest request)
        {
            try
            {
                var meetingScheduleData = await _meetingDetailsRepository.GetMeetingScheduleByIdAsync(request.RowId);
                MeetingSchedule? meetingSchedule = null;

                if (meetingScheduleData is DataTable dataTable && dataTable.Rows.Count > 0)
                {
                    var row = dataTable.Rows[0];
                    meetingSchedule = new MeetingSchedule
                    {
                        RowId = Convert.ToInt32(row["RowID"]),
                        ChapterId = row["ChapterID"].ToString() ?? "",
                        ChapterName = dataTable.Columns.Contains("ChapterName")
                            ? row["ChapterName"]?.ToString() ?? ""
                            : "",
                        Class = row["Class"].ToString() ?? "",
                        Section = row["Section"].ToString() ?? "",
                        MeetingProviderUrl = row["MeetingProviderURL"].ToString() ?? "",
                        MeetingUrl = row["MeetingURL"].ToString() ?? "",
                        MeetingId = row["MeetingID"].ToString() ?? "",
                        Passcode = row["Passcode"].ToString() ?? "",
                        AdminLogin = row["AdminLogin"].ToString() ?? "",
                        AdminPassCode = row["AdminPassCode"].ToString() ?? "",
                        IncludeSection = ParseLegacyBool(row["IncludeSection"]),
                        Active = ParseLegacyBool(row["Active"]),
                        MeetingTime = row["MeetingTime"].ToString() ?? "",
                        MeetingDate = row["MeetingDate"].ToString() ?? ""
                    };
                }

                if (meetingSchedule != null
                    && string.IsNullOrWhiteSpace(meetingSchedule.ChapterName)
                    && !string.IsNullOrWhiteSpace(meetingSchedule.ChapterId))
                {
                    var chapterLocationsData = await _meetingDetailsRepository.GetChapterLocationsAsync("Y");
                    if (chapterLocationsData is List<ChapterLocation> chapterLocations)
                    {
                        var match = chapterLocations.FirstOrDefault(c =>
                            string.Equals(c.ChapterID, meetingSchedule.ChapterId, StringComparison.OrdinalIgnoreCase));
                        if (match != null && !string.IsNullOrWhiteSpace(match.ChapterName))
                        {
                            meetingSchedule.ChapterName = match.ChapterName;
                        }
                    }
                }

                return new GetMeetingScheduleResponse
                {
                    IsSuccess = true,
                    MeetingSchedule = meetingSchedule
                };
            }
            catch (Exception ex)
            {
                return new GetMeetingScheduleResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Insert or update meeting schedule
        /// </summary>
        public async Task<UpsertMeetingScheduleResponse> UpsertMeetingScheduleAsync(UpsertMeetingScheduleRequest request)
        {
            try
            {
                var validationError = ValidateUpsertRequest(request);
                if (validationError != null)
                {
                    return new UpsertMeetingScheduleResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = validationError
                    };
                }

                var meetingSchedule = new MeetingSchedule
                {
                    RowId = int.TryParse(request.RowId, out var rowId) ? rowId : 0,
                    ChapterId = request.ChapterId?.Trim() ?? "",
                    Class = string.IsNullOrWhiteSpace(request.Class) ? "JB" : request.Class.Trim(),
                    Section = string.IsNullOrWhiteSpace(request.Section) ? "A" : request.Section.Trim(),
                    MeetingProviderUrl = request.MeetingProviderUrl?.Trim() ?? "",
                    MeetingUrl = request.MeetingUrl?.Trim() ?? "",
                    MeetingId = request.MeetingId?.Trim() ?? "",
                    Passcode = request.Passcode?.Trim() ?? "",
                    AdminLogin = request.AdminLogin?.Trim() ?? "",
                    AdminPassCode = request.AdminPassCode?.Trim() ?? "",
                    IncludeSection = request.IncludeSection == "1",
                    Active = request.Active == "1",
                    MeetingTime = string.IsNullOrWhiteSpace(request.MeetingTime) ? "00:00" : request.MeetingTime.Trim(),
                    MeetingDate = request.MeetingDate?.Trim() ?? ""
                };

                await _meetingDetailsRepository.UpsertMeetingScheduleAsync(meetingSchedule);

                return new UpsertMeetingScheduleResponse
                {
                    IsSuccess = true,
                    Message = "Data updated successfully."
                };
            }
            catch (Exception ex)
            {
                return new UpsertMeetingScheduleResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private static string? ValidateUpsertRequest(UpsertMeetingScheduleRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ChapterId))
            {
                return "Chapter is required.";
            }

            if (string.IsNullOrWhiteSpace(request.MeetingDate))
            {
                return "Meeting Date is required.";
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(
                    request.MeetingDate.Trim(),
                    @"^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$"))
            {
                return "Please enter (mm/dd/yyyy) format.";
            }

            if (string.IsNullOrWhiteSpace(request.MeetingProviderUrl))
            {
                return "Meeting Provider URL is required.";
            }

            if (string.IsNullOrWhiteSpace(request.MeetingUrl))
            {
                return "Meeting URL is required.";
            }

            if (string.IsNullOrWhiteSpace(request.MeetingId))
            {
                return "Meeting ID is required.";
            }

            if (string.IsNullOrWhiteSpace(request.Passcode))
            {
                return "Passcode is required.";
            }

            if (string.IsNullOrWhiteSpace(request.AdminLogin))
            {
                return "Admin Login is required.";
            }

            if (string.IsNullOrWhiteSpace(request.AdminPassCode))
            {
                return "Admin PassCode is required.";
            }

            return null;
        }

        private static bool ParseLegacyBool(object? value)
        {
            if (value == null || value == DBNull.Value)
            {
                return false;
            }

            if (value is bool boolValue)
            {
                return boolValue;
            }

            var text = value.ToString()?.Trim();
            return text == "1"
                || text?.Equals("true", StringComparison.OrdinalIgnoreCase) == true
                || text?.Equals("yes", StringComparison.OrdinalIgnoreCase) == true;
        }

        /// <summary>
        /// Get chapter locations
        /// </summary>
        public async Task<ChapterLocationResponse> GetChapterLocationsAsync(GetChapterLocationRequest request)
        {
            try
            {
                var chapterLocations = await _meetingDetailsRepository.GetChapterLocationsAsync(request.Mode);

                return new ChapterLocationResponse
                {
                    IsSuccess = true,
                    ChapterLocations = (List<ChapterLocation>)chapterLocations
                };
            }
            catch (Exception ex)
            {
                return new ChapterLocationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Prepare new meeting form data
        /// </summary>
        public async Task<PrepareNewMeetingResponse> PrepareNewMeetingAsync(PrepareNewMeetingRequest request)
        {
            try
            {
                // Create a new empty meeting schedule with default values
                var formData = new MeetingSchedule
                {
                    RowId = 0,
                    ChapterId = "",
                    ChapterName = "",
                    Class = "",
                    Section = "",
                    MeetingProviderUrl = "",
                    MeetingUrl = "",
                    MeetingId = "",
                    Passcode = "",
                    AdminLogin = "",
                    AdminPassCode = "",
                    IncludeSection = false,
                    Active = false,
                    MeetingTime = "",
                    MeetingDate = ""
                };

                return await Task.FromResult(new PrepareNewMeetingResponse
                {
                    IsSuccess = true,
                    FormData = formData
                });
            }
            catch (Exception ex)
            {
                return new PrepareNewMeetingResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }
    }
}
