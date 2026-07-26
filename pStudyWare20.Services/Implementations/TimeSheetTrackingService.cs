using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Globalization;
using System.Text.RegularExpressions;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for timesheet tracking business logic
    /// </summary>
    public class TimeSheetTrackingService : ITimeSheetTrackingService
    {
        private readonly ITimeSheetTrackingRepository _timeSheetTrackingRepository;

        public TimeSheetTrackingService(ITimeSheetTrackingRepository timeSheetTrackingRepository)
        {
            _timeSheetTrackingRepository = timeSheetTrackingRepository;
        }

        /// <summary>
        /// Get timesheet tracking list for a user
        /// </summary>
        public async Task<TimeSheetTrackingListResponse> GetTimeSheetTrackingListAsync(TimeSheetTrackingListRequest request)
        {
            try
            {
                var dataTable = await _timeSheetTrackingRepository.GetTimeSheetTrackingListAsync(request.Username);
                var timeSheetEntries = ConvertDataTableToTimeSheetEntries(dataTable);

                return new TimeSheetTrackingListResponse
                {
                    IsSuccess = true,
                    TimeSheetTrackingList = timeSheetEntries
                };
            }
            catch (Exception ex)
            {
                return new TimeSheetTrackingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Self-service list — always scoped to the member account, even for chapter admins.
        /// </summary>
        public async Task<TimeSheetTrackingListResponse> GetMyTimeSheetTrackingListAsync(TimeSheetTrackingListRequest request)
        {
            try
            {
                var dataTable = await _timeSheetTrackingRepository.GetMyTimeSheetTrackingListAsync(request.Username);
                var timeSheetEntries = ConvertDataTableToTimeSheetEntries(dataTable);

                return new TimeSheetTrackingListResponse
                {
                    IsSuccess = true,
                    TimeSheetTrackingList = timeSheetEntries
                };
            }
            catch (Exception ex)
            {
                return new TimeSheetTrackingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Update timesheet tracking entry (get data for editing)
        /// </summary>
        public async Task<UpdateTimeSheetTrackingResponse> UpdateTimeSheetTrackingAsync(UpdateTimeSheetTrackingRequest request)
        {
            try
            {
                var dataTable = await _timeSheetTrackingRepository.GetTimeSheetTrackingForEditAsync(request.Username);
                var timeSheetEntries = ConvertDataTableToTimeSheetEntries(dataTable);

                // Find the specific entry by LogID
                var targetEntry = timeSheetEntries.FirstOrDefault(e => e.LogID == request.LogID);

                if (targetEntry == null)
                {
                    return new UpdateTimeSheetTrackingResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "TimeSheet entry not found"
                    };
                }

                return new UpdateTimeSheetTrackingResponse
                {
                    IsSuccess = true,
                    TimeSheetEntry = targetEntry
                };
            }
            catch (Exception ex)
            {
                return new UpdateTimeSheetTrackingResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<UpdateTimeSheetTrackingResponse> GetMyTimeSheetTrackingForEditAsync(UpdateTimeSheetTrackingRequest request)
        {
            try
            {
                var dataTable = await _timeSheetTrackingRepository.GetMyTimeSheetTrackingListAsync(request.Username);
                var timeSheetEntries = ConvertDataTableToTimeSheetEntries(dataTable);
                var targetEntry = timeSheetEntries.FirstOrDefault(e => e.LogID == request.LogID);

                if (targetEntry == null)
                {
                    return new UpdateTimeSheetTrackingResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "TimeSheet entry not found"
                    };
                }

                return new UpdateTimeSheetTrackingResponse
                {
                    IsSuccess = true,
                    TimeSheetEntry = targetEntry
                };
            }
            catch (Exception ex)
            {
                return new UpdateTimeSheetTrackingResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Delete timesheet tracking entry
        /// </summary>
        public async Task<DeleteTimeSheetTrackingResponse> DeleteTimeSheetTrackingAsync(DeleteTimeSheetTrackingRequest request)
        {
            try
            {
                if (request.LogID <= 0)
                {
                    return new DeleteTimeSheetTrackingResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "A valid log ID is required to delete this entry."
                    };
                }

                await _timeSheetTrackingRepository.DeleteTimeSheetTrackingAsync(request.LogID);

                return new DeleteTimeSheetTrackingResponse
                {
                    IsSuccess = true,
                    Message = "Entry has been deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new DeleteTimeSheetTrackingResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Add or update timesheet tracking entry
        /// </summary>
        public async Task<UpsertTimeSheetTrackingResponse> UpsertTimeSheetTrackingAsync(UpsertTimeSheetTrackingRequest request)
        {
            try
            {
                await _timeSheetTrackingRepository.UpsertTimeSheetTrackingAsync(request);

                var message = request.LogID.HasValue ?
                    "Time Sheet Entry has been updated successfully" :
                    "Time Sheet Entry has been recorded successfully";

                return new UpsertTimeSheetTrackingResponse
                {
                    IsSuccess = true,
                    Message = message
                };
            }
            catch (Exception ex)
            {
                return new UpsertTimeSheetTrackingResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get timesheet tracking dashboard data
        /// </summary>
        public async Task<TimeSheetTrackingDashboardResponse> GetDashboardDataAsync(TimeSheetTrackingDashboardRequest request)
        {
            try
            {
                var dataTable = await _timeSheetTrackingRepository.GetTimeSheetTrackingListAsync(request.Username);
                var timeSheetEntries = ConvertDataTableToTimeSheetEntries(dataTable);

                return new TimeSheetTrackingDashboardResponse
                {
                    IsSuccess = true,
                    TimeSheetTrackingList = timeSheetEntries
                };
            }
            catch (Exception ex)
            {
                return new TimeSheetTrackingDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Handle timesheet tracking action (Edit/Delete)
        /// </summary>
        public async Task<TimeSheetTrackingActionResponse> HandleTimeSheetTrackingActionAsync(TimeSheetTrackingActionRequest request)
        {
            try
            {
                var response = new TimeSheetTrackingActionResponse { IsSuccess = true };

                switch (request.Action.ToUpper())
                {
                    case "E": // Edit
                        var updateRequest = new UpdateTimeSheetTrackingRequest
                        {
                            Username = request.Username ?? "",
                            LogID = request.LogID
                        };
                        var updateResult = await UpdateTimeSheetTrackingAsync(updateRequest);
                        if (updateResult.IsSuccess)
                        {
                            response.TimeSheetEntry = updateResult.TimeSheetEntry;
                            response.Message = "TimeSheet entry loaded for editing";
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.ErrorMessage = updateResult.ErrorMessage;
                        }
                        break;

                    case "D": // Delete
                        var deleteRequest = new DeleteTimeSheetTrackingRequest { LogID = request.LogID };
                        var deleteResult = await DeleteTimeSheetTrackingAsync(deleteRequest);
                        if (deleteResult.IsSuccess)
                        {
                            response.Message = deleteResult.Message;
                        }
                        else
                        {
                            response.IsSuccess = false;
                            response.ErrorMessage = deleteResult.ErrorMessage;
                        }
                        break;

                    default:
                        response.IsSuccess = false;
                        response.ErrorMessage = "Invalid action specified";
                        break;
                }

                return response;
            }
            catch (Exception ex)
            {
                return new TimeSheetTrackingActionResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Check if user has timesheet tracking privileges
        /// </summary>
        public async Task<TimeSheetTrackingPrivilegesResponse> CheckTimeSheetTrackingPrivilegesAsync(string username)
        {
            try
            {
                // All authenticated users can manage their own timesheet entries
                return new TimeSheetTrackingPrivilegesResponse
                {
                    IsSuccess = true,
                    CanAddTimeSheetEntry = true,
                    CanEditTimeSheetEntry = true,
                    CanDeleteTimeSheetEntry = true
                };
            }
            catch (Exception ex)
            {
                return new TimeSheetTrackingPrivilegesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public Task<bool> MemberOwnsTimeSheetEntryAsync(int logId, string username)
        {
            return _timeSheetTrackingRepository.MemberOwnsTimeSheetEntryAsync(logId, username);
        }

        /// <summary>
        /// Resolve column name case-insensitively; try preferred then alternates.
        /// </summary>
        private static string ResolveColumnName(DataTable table, string preferred, params string[] alternates)
        {
            if (table?.Columns == null) return null;
            var names = new[] { preferred }.Concat(alternates ?? Array.Empty<string>());
            foreach (var name in names)
            {
                foreach (DataColumn col in table.Columns)
                {
                    if (string.Equals(col.ColumnName, name, StringComparison.OrdinalIgnoreCase))
                        return col.ColumnName;
                }
            }
            return null;
        }

        private static object GetValue(DataRow row, DataTable table, string preferred, params string[] alternates)
        {
            var col = ResolveColumnName(table, preferred, alternates);
            if (col == null) return DBNull.Value;
            var val = row[col];
            return val ?? DBNull.Value;
        }

        /// <summary>
        /// Convert DataTable to TimeSheetTrackingEntry list (supports mLogID/LogID, DateVolunteer/VolunteerDate, etc.).
        /// </summary>
        private List<TimeSheetTrackingEntry> ConvertDataTableToTimeSheetEntries(DataTable dataTable)
        {
            var entries = new List<TimeSheetTrackingEntry>();

            if (dataTable == null || dataTable.Rows == null || dataTable.Rows.Count == 0)
                return entries;

            var table = dataTable;
            foreach (DataRow row in dataTable.Rows)
            {
                try
                {
                    // mLogID is a display row number from AMC_spSelectTimeTracking — use LogID for edit/delete.
                    var logIdVal = GetValue(row, table, "LogID", "LogId");
                    var rowNumVal = GetValue(row, table, "mLogID");
                    var dateVal = GetValue(row, table, "DateVolunteer", "VolunteerDate");
                    var createdVal = GetValue(row, table, "CreatedDate");
                    var modifiedVal = GetValue(row, table, "ModifiedDate");

                    var entry = new TimeSheetTrackingEntry
                    {
                        LogID = logIdVal != null && logIdVal != DBNull.Value ? Convert.ToInt32(logIdVal) : 0,
                        MLogID = rowNumVal != null && rowNumVal != DBNull.Value ? Convert.ToInt32(rowNumVal) : 0,
                        Username = GetValue(row, table, "Username", "UserName")?.ToString() ?? "",
                        Name = GetValue(row, table, "Name", "VolunteerName")?.ToString() ?? "",
                        TaskName = GetValue(row, table, "TaskName")?.ToString() ?? "",
                        VolunteerDate = dateVal != null && dateVal != DBNull.Value ? Convert.ToDateTime(dateVal) : default,
                        StartTime = GetValue(row, table, "StartTime")?.ToString() ?? "",
                        EndTime = GetValue(row, table, "EndTime")?.ToString() ?? "",
                        TotalHours = GetValue(row, table, "TotalHours")?.ToString() ?? "",
                        StartHour = GetValue(row, table, "StartHour")?.ToString() ?? "",
                        StartMin = GetValue(row, table, "StartMin", "Startmin")?.ToString() ?? "",
                        StartType = GetValue(row, table, "StartType")?.ToString() ?? "",
                        EndHour = GetValue(row, table, "EndHour")?.ToString() ?? "",
                        EndMin = GetValue(row, table, "EndMin", "Endmin")?.ToString() ?? "",
                        EndType = GetValue(row, table, "EndType")?.ToString() ?? "",
                        TaskDescription = GetValue(row, table, "TaskDescription")?.ToString() ?? "",
                        CreatedDate = createdVal != null && createdVal != DBNull.Value ? Convert.ToDateTime(createdVal) : null,
                        ModifiedDate = modifiedVal != null && modifiedVal != DBNull.Value ? Convert.ToDateTime(modifiedVal) : null
                    };
                    PopulateClockPartsFromFormattedStrings(entry);
                    entries.Add(entry);
                }
                catch
                {
                    // Skip malformed row
                }
            }

            return entries;
        }

        /// <summary>
        /// AMC_spSelectTimeTracking returns StartTime/EndTime as formatted strings — split for edit form dropdowns.
        /// </summary>
        private static void PopulateClockPartsFromFormattedStrings(TimeSheetTrackingEntry entry)
        {
            if (string.IsNullOrWhiteSpace(entry.StartHour))
            {
                var (hour, min, type) = ParseLegacyClockString(entry.StartTime);
                if (!string.IsNullOrEmpty(hour))
                {
                    entry.StartHour = hour;
                    entry.StartMin = min;
                    entry.StartType = type;
                }
            }

            if (string.IsNullOrWhiteSpace(entry.EndHour))
            {
                var (hour, min, type) = ParseLegacyClockString(entry.EndTime);
                if (!string.IsNullOrEmpty(hour))
                {
                    entry.EndHour = hour;
                    entry.EndMin = min;
                    entry.EndType = type;
                }
            }
        }

        private static (string Hour, string Min, string Type) ParseLegacyClockString(string? clock)
        {
            if (string.IsNullOrWhiteSpace(clock))
                return ("", "", "");

            var s = clock.Trim();

            var match = Regex.Match(s, @"^(\d{1,2}):(\d{2})\s*(AM|PM)$", RegexOptions.IgnoreCase);
            if (match.Success)
            {
                return (
                    Pad2Clock(match.Groups[1].Value),
                    SnapMinuteToLegacyOption(match.Groups[2].Value),
                    match.Groups[3].Value.ToUpperInvariant()
                );
            }

            match = Regex.Match(s, @"^(\d{1,2}):(\d{2})(?::\d{2})?$");
            if (match.Success && int.TryParse(match.Groups[1].Value, out var hour24))
            {
                var min = SnapMinuteToLegacyOption(match.Groups[2].Value);
                var type = hour24 >= 12 ? "PM" : "AM";
                if (hour24 == 0) hour24 = 12;
                else if (hour24 > 12) hour24 -= 12;
                return (Pad2Clock(hour24), min, type);
            }

            if (TimeSpan.TryParse(s, CultureInfo.InvariantCulture, out var ts))
            {
                var tsHour = ts.Hours;
                var tsType = tsHour >= 12 ? "PM" : "AM";
                var tsDisplayHour = tsHour == 0 ? 12 : tsHour > 12 ? tsHour - 12 : tsHour;
                return (Pad2Clock(tsDisplayHour), SnapMinuteToLegacyOption(ts.Minutes), tsType);
            }

            if (DateTime.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out var dt))
            {
                var dtHour = dt.Hour;
                var dtType = dtHour >= 12 ? "PM" : "AM";
                var dtDisplayHour = dtHour == 0 ? 12 : dtHour > 12 ? dtHour - 12 : dtHour;
                return (Pad2Clock(dtDisplayHour), SnapMinuteToLegacyOption(dt.Minute), dtType);
            }

            return ("", "", "");
        }

        private static string Pad2Clock(object value)
        {
            if (value == null) return "00";
            if (value is int i) return i.ToString("D2", CultureInfo.InvariantCulture);
            return int.TryParse(value.ToString(), out var n)
                ? n.ToString("D2", CultureInfo.InvariantCulture)
                : value.ToString() ?? "00";
        }

        private static string SnapMinuteToLegacyOption(object value)
        {
            if (!int.TryParse(value?.ToString(), out var minutes))
                return "00";

            int[] allowed = { 0, 15, 30, 45 };
            if (Array.IndexOf(allowed, minutes) >= 0)
                return minutes.ToString("D2", CultureInfo.InvariantCulture);

            var closest = allowed[0];
            foreach (var option in allowed)
            {
                if (Math.Abs(option - minutes) < Math.Abs(closest - minutes))
                    closest = option;
            }
            return closest.ToString("D2", CultureInfo.InvariantCulture);
        }
    }
}
