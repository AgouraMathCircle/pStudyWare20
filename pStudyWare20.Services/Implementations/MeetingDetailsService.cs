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
        /// Get meeting schedule list. When request.UserName is set (student dashboard), uses AMC_spMeetingSchedule_Select
        /// to return only meetings for that user (matches legacy pStudyware_DashboardMessage.ascx.cs). Otherwise returns all.
        /// </summary>
        public async Task<MeetingScheduleListResponse> GetMeetingScheduleListAsync(MeetingScheduleListRequest request)
        {
            try
            {
                object meetingSchedulesData;
                if (!string.IsNullOrWhiteSpace(request.UserName))
                {
                    // Student/instructor/volunteer dashboard: only meetings for this user (legacy BingMeetingSchedule)
                    meetingSchedulesData = await _meetingDetailsRepository.GetMeetingScheduleListByUserAsync(request.UserName.Trim());
                }
                else
                {
                    // Admin: all meeting schedules (AMC_tblMeetingSchedule_Select)
                    meetingSchedulesData = await _meetingDetailsRepository.GetMeetingScheduleListAsync(request.RowId);
                }

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
                    IncludeSection = dataTable.Columns.Contains("IncludeSection") && (row["IncludeSection"]?.ToString() == "True" || row["IncludeSection"]?.ToString() == "1"),
                    Active = dataTable.Columns.Contains("Active") && (row["Active"]?.ToString() == "True" || row["Active"]?.ToString() == "1"),
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
                        Class = row["Class"].ToString() ?? "",
                        Section = row["Section"].ToString() ?? "",
                        MeetingProviderUrl = row["MeetingProviderURL"].ToString() ?? "",
                        MeetingUrl = row["MeetingURL"].ToString() ?? "",
                        MeetingId = row["MeetingID"].ToString() ?? "",
                        Passcode = row["Passcode"].ToString() ?? "",
                        AdminLogin = row["AdminLogin"].ToString() ?? "",
                        AdminPassCode = row["AdminPassCode"].ToString() ?? "",
                        IncludeSection = row["IncludeSection"].ToString() == "True",
                        Active = row["Active"].ToString() == "True",
                        MeetingTime = row["MeetingTime"].ToString() ?? "",
                        MeetingDate = row["MeetingDate"].ToString() ?? ""
                    };
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
                var meetingSchedule = new MeetingSchedule
                {
                    RowId = Convert.ToInt32(request.RowId),
                    ChapterId = request.ChapterId,
                    Class = request.Class,
                    Section = request.Section,
                    MeetingProviderUrl = request.MeetingProviderUrl,
                    MeetingUrl = request.MeetingUrl,
                    MeetingId = request.MeetingId,
                    Passcode = request.Passcode,
                    AdminLogin = request.AdminLogin,
                    AdminPassCode = request.AdminPassCode,
                    IncludeSection = request.IncludeSection == "1",
                    Active = request.Active == "1",
                    MeetingTime = request.MeetingTime,
                    MeetingDate = request.MeetingDate
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
