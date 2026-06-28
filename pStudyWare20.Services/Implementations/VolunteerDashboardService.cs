using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.Globalization;
using System.Text.RegularExpressions;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for volunteer dashboard business logic
    /// </summary>
    public class VolunteerDashboardService : IVolunteerDashboardService
    {
        private readonly IVolunteerDashboardRepository _volunteerDashboardRepository;

        public VolunteerDashboardService(IVolunteerDashboardRepository volunteerDashboardRepository)
        {
            _volunteerDashboardRepository = volunteerDashboardRepository;
        }

        /// <summary>
        /// Get volunteer dashboard data (matches BindGridView method)
        /// </summary>
        public async Task<VolunteerDashboardResponse> GetVolunteerDashboardDataAsync(VolunteerDashboardRequest request)
        {
            try
            {
                var dataTable = await _volunteerDashboardRepository.GetTimeTrackingListAsync(request.Username);
                var timeTrackingEntries = ConvertDataTableToVolunteerTimeTrackingEntries(dataTable);

                // Calculate statistics
                var totalHours = CalculateTotalHours(timeTrackingEntries);
                var totalEntries = timeTrackingEntries.Count;
                var lastEntryDate = timeTrackingEntries.OrderByDescending(e => e.VolunteerDate).FirstOrDefault()?.VolunteerDate;
                var mostFrequentTask = GetMostFrequentTask(timeTrackingEntries);

                return new VolunteerDashboardResponse
                {
                    IsSuccess = true,
                    TimeTrackingEntries = timeTrackingEntries,
                    TotalVolunteerHours = totalHours,
                    TotalEntries = totalEntries,
                    LastEntryDate = lastEntryDate,
                    MostFrequentTask = mostFrequentTask
                };
            }
            catch (Exception ex)
            {
                return new VolunteerDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get volunteer dashboard summary with statistics
        /// </summary>
        public async Task<VolunteerDashboardSummaryResponse> GetVolunteerDashboardSummaryAsync(VolunteerDashboardSummaryRequest request)
        {
            try
            {
                var dataTable = await _volunteerDashboardRepository.GetTimeTrackingListWithDateRangeAsync(
                    request.Username,
                    request.StartDate,
                    request.EndDate);

                var timeTrackingEntries = ConvertDataTableToVolunteerTimeTrackingEntries(dataTable);

                // Calculate summary statistics
                var totalHours = CalculateTotalHours(timeTrackingEntries);
                var totalEntries = timeTrackingEntries.Count;
                var averageHoursPerEntry = totalEntries > 0 ? totalHours / totalEntries : 0;
                var firstEntryDate = timeTrackingEntries.OrderBy(e => e.VolunteerDate).FirstOrDefault()?.VolunteerDate;
                var lastEntryDate = timeTrackingEntries.OrderByDescending(e => e.VolunteerDate).FirstOrDefault()?.VolunteerDate;
                var recentEntries = timeTrackingEntries.OrderByDescending(e => e.VolunteerDate).Take(5).ToList();
                var taskHoursBreakdown = GetTaskHoursBreakdown(timeTrackingEntries);

                return new VolunteerDashboardSummaryResponse
                {
                    IsSuccess = true,
                    TotalHours = totalHours,
                    TotalEntries = totalEntries,
                    AverageHoursPerEntry = averageHoursPerEntry,
                    FirstEntryDate = firstEntryDate,
                    LastEntryDate = lastEntryDate,
                    RecentEntries = recentEntries,
                    TaskHoursBreakdown = taskHoursBreakdown
                };
            }
            catch (Exception ex)
            {
                return new VolunteerDashboardSummaryResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get volunteer dashboard statistics
        /// </summary>
        public async Task<VolunteerDashboardStatsResponse> GetVolunteerDashboardStatsAsync(VolunteerDashboardStatsRequest request)
        {
            try
            {
                var dataTable = await _volunteerDashboardRepository.GetTimeTrackingStatsAsync(
                    request.Username,
                    request.Year,
                    request.Month);

                var timeTrackingEntries = ConvertDataTableToVolunteerTimeTrackingEntries(dataTable);

                // Calculate detailed statistics
                var totalHours = CalculateTotalHours(timeTrackingEntries);
                var totalEntries = timeTrackingEntries.Count;
                var averageHoursPerEntry = totalEntries > 0 ? totalHours / totalEntries : 0;
                var daysWithEntries = timeTrackingEntries.Select(e => e.VolunteerDate.Date).Distinct().Count();
                var averageHoursPerDay = daysWithEntries > 0 ? totalHours / daysWithEntries : 0;
                var topTasks = GetTopTasks(timeTrackingEntries, 5);
                var monthlyBreakdown = GetMonthlyBreakdown(timeTrackingEntries);

                return new VolunteerDashboardStatsResponse
                {
                    IsSuccess = true,
                    TotalHours = totalHours,
                    TotalEntries = totalEntries,
                    AverageHoursPerEntry = averageHoursPerEntry,
                    AverageHoursPerDay = averageHoursPerDay,
                    DaysWithEntries = daysWithEntries,
                    TopTasks = topTasks,
                    MonthlyBreakdown = monthlyBreakdown
                };
            }
            catch (Exception ex)
            {
                return new VolunteerDashboardStatsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Check if user has volunteer dashboard privileges
        /// </summary>
        public async Task<VolunteerDashboardPrivilegesResponse> CheckVolunteerDashboardPrivilegesAsync(VolunteerDashboardPrivilegesRequest request)
        {
            try
            {
                // All authenticated users can view their own volunteer dashboard
                return new VolunteerDashboardPrivilegesResponse
                {
                    IsSuccess = true,
                    CanViewDashboard = true,
                    CanViewTimeTracking = true,
                    CanAddTimeEntries = true,
                    CanEditTimeEntries = true,
                    CanDeleteTimeEntries = true
                };
            }
            catch (Exception ex)
            {
                return new VolunteerDashboardPrivilegesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get time tracking entries for volunteer dashboard
        /// </summary>
        public async Task<List<VolunteerTimeTrackingEntry>> GetTimeTrackingEntriesAsync(string username)
        {
            try
            {
                var dataTable = await _volunteerDashboardRepository.GetTimeTrackingListAsync(username);
                return ConvertDataTableToVolunteerTimeTrackingEntries(dataTable);
            }
            catch (Exception ex)
            {
                return new List<VolunteerTimeTrackingEntry>();
            }
        }

        /// <summary>
        /// Resolve column name case-insensitively; try preferred then alternates (legacy SPs vary).
        /// </summary>
        private static string? ResolveColumnName(DataTable table, string preferred, params string[] alternates)
        {
            if (table?.Columns == null)
                return null;
            foreach (var name in new[] { preferred }.Concat(alternates ?? Array.Empty<string>()))
            {
                foreach (DataColumn col in table.Columns)
                {
                    if (string.Equals(col.ColumnName, name, StringComparison.OrdinalIgnoreCase))
                        return col.ColumnName;
                }
            }
            return null;
        }

        private static object GetCell(DataRow row, DataTable table, string preferred, params string[] alternates)
        {
            var col = ResolveColumnName(table, preferred, alternates);
            if (col == null)
                return DBNull.Value;
            var val = row[col];
            return val ?? DBNull.Value;
        }

        /// <summary>
        /// Convert DataTable to VolunteerTimeTrackingEntry list
        /// </summary>
        private List<VolunteerTimeTrackingEntry> ConvertDataTableToVolunteerTimeTrackingEntries(DataTable dataTable)
        {
            var entries = new List<VolunteerTimeTrackingEntry>();

            if (dataTable == null || dataTable.Rows == null || dataTable.Rows.Count == 0)
                return entries;

            var table = dataTable;
            foreach (DataRow row in dataTable.Rows)
            {
                try
                {
                    var logIdVal = GetCell(row, table, "mLogID", "LogID", "LogId");
                    var dateVal = GetCell(row, table, "DateVolunteer", "VolunteerDate");
                    var createdVal = GetCell(row, table, "CreatedDate");
                    var modifiedVal = GetCell(row, table, "ModifiedDate");

                    var entry = new VolunteerTimeTrackingEntry
                    {
                        LogID = logIdVal != null && logIdVal != DBNull.Value ? Convert.ToInt32(logIdVal) : 0,
                        Username = GetCell(row, table, "Username", "UserName", "Name")?.ToString() ?? "",
                        TaskName = GetCell(row, table, "TaskName")?.ToString() ?? "",
                        VolunteerDate = dateVal != null && dateVal != DBNull.Value ? Convert.ToDateTime(dateVal) : default,
                        StartHour = GetCell(row, table, "StartHour")?.ToString() ?? "",
                        StartMin = GetCell(row, table, "StartMin")?.ToString() ?? "",
                        StartType = GetCell(row, table, "StartType")?.ToString() ?? "",
                        EndHour = GetCell(row, table, "EndHour")?.ToString() ?? "",
                        EndMin = GetCell(row, table, "EndMin")?.ToString() ?? "",
                        EndType = GetCell(row, table, "EndType")?.ToString() ?? "",
                        TaskDescription = GetCell(row, table, "TaskDescription")?.ToString() ?? "",
                        CreatedDate = createdVal != null && createdVal != DBNull.Value ? Convert.ToDateTime(createdVal) : null,
                        ModifiedDate = modifiedVal != null && modifiedVal != DBNull.Value ? Convert.ToDateTime(modifiedVal) : null
                    };

                    var startTimeVal = GetCell(row, table, "StartTime")?.ToString();
                    var endTimeVal = GetCell(row, table, "EndTime")?.ToString();
                    var totalHoursVal = GetCell(row, table, "TotalHours");

                    if (string.IsNullOrWhiteSpace(entry.StartHour) && !string.IsNullOrWhiteSpace(startTimeVal))
                    {
                        var parsed = ParseLegacyClockString(startTimeVal);
                        if (!string.IsNullOrEmpty(parsed.Hour))
                        {
                            entry.StartHour = parsed.Hour;
                            entry.StartMin = parsed.Min;
                            entry.StartType = parsed.Type;
                        }
                    }

                    if (string.IsNullOrWhiteSpace(entry.EndHour) && !string.IsNullOrWhiteSpace(endTimeVal))
                    {
                        var parsed = ParseLegacyClockString(endTimeVal);
                        if (!string.IsNullOrEmpty(parsed.Hour))
                        {
                            entry.EndHour = parsed.Hour;
                            entry.EndMin = parsed.Min;
                            entry.EndType = parsed.Type;
                        }
                    }

                    if (totalHoursVal != null && totalHoursVal != DBNull.Value && double.TryParse(totalHoursVal.ToString(), out var parsedTotal))
                    {
                        entry.TotalHours = parsedTotal;
                    }
                    else
                    {
                        entry.TotalHours = CalculateEntryHours(entry);
                    }

                    entries.Add(entry);
                }
                catch
                {
                    // Skip malformed row
                }
            }

            return entries;
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

        /// <summary>
        /// Calculate total hours for a time tracking entry
        /// </summary>
        private double CalculateEntryHours(VolunteerTimeTrackingEntry entry)
        {
            try
            {
                var startTime = ParseTime(entry.StartHour, entry.StartMin, entry.StartType);
                var endTime = ParseTime(entry.EndHour, entry.EndMin, entry.EndType);

                if (startTime.HasValue && endTime.HasValue)
                {
                    var duration = endTime.Value - startTime.Value;
                    return Math.Max(0, duration.TotalHours);
                }

                return 0;
            }
            catch
            {
                return 0;
            }
        }

        /// <summary>
        /// Parse time from hour, minute, and AM/PM
        /// </summary>
        private DateTime? ParseTime(string hour, string minute, string type)
        {
            try
            {
                var h = int.Parse(hour);
                var m = int.Parse(minute);

                if (type.ToUpper() == "PM" && h != 12)
                {
                    h += 12;
                }
                else if (type.ToUpper() == "AM" && h == 12)
                {
                    h = 0;
                }

                return DateTime.Today.AddHours(h).AddMinutes(m);
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Calculate total hours from all entries
        /// </summary>
        private double CalculateTotalHours(List<VolunteerTimeTrackingEntry> entries)
        {
            return entries.Sum(e => e.TotalHours ?? 0);
        }

        /// <summary>
        /// Get most frequent task
        /// </summary>
        private string? GetMostFrequentTask(List<VolunteerTimeTrackingEntry> entries)
        {
            return entries
                .GroupBy(e => e.TaskName)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key;
        }

        /// <summary>
        /// Get task hours breakdown
        /// </summary>
        private Dictionary<string, double> GetTaskHoursBreakdown(List<VolunteerTimeTrackingEntry> entries)
        {
            return entries
                .GroupBy(e => e.TaskName)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.TotalHours ?? 0));
        }

        /// <summary>
        /// Get top tasks by hours
        /// </summary>
        private List<VolunteerTimeTrackingEntry> GetTopTasks(List<VolunteerTimeTrackingEntry> entries, int count)
        {
            return entries
                .OrderByDescending(e => e.TotalHours ?? 0)
                .Take(count)
                .ToList();
        }

        /// <summary>
        /// Get monthly breakdown of hours
        /// </summary>
        private Dictionary<string, double> GetMonthlyBreakdown(List<VolunteerTimeTrackingEntry> entries)
        {
            return entries
                .GroupBy(e => e.VolunteerDate.ToString("yyyy-MM"))
                .ToDictionary(g => g.Key, g => g.Sum(e => e.TotalHours ?? 0));
        }
    }
}
