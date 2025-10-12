using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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
        /// Convert DataTable to VolunteerTimeTrackingEntry list
        /// </summary>
        private List<VolunteerTimeTrackingEntry> ConvertDataTableToVolunteerTimeTrackingEntries(DataTable dataTable)
        {
            var entries = new List<VolunteerTimeTrackingEntry>();

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    var entry = new VolunteerTimeTrackingEntry
                    {
                        LogID = Convert.ToInt32(row["mLogID"]),
                        Username = row["Username"]?.ToString() ?? "",
                        TaskName = row["TaskName"]?.ToString() ?? "",
                        VolunteerDate = Convert.ToDateTime(row["DateVolunteer"]),
                        StartHour = row["StartHour"]?.ToString() ?? "",
                        StartMin = row["StartMin"]?.ToString() ?? "",
                        StartType = row["StartType"]?.ToString() ?? "",
                        EndHour = row["EndHour"]?.ToString() ?? "",
                        EndMin = row["EndMin"]?.ToString() ?? "",
                        EndType = row["EndType"]?.ToString() ?? "",
                        TaskDescription = row["TaskDescription"]?.ToString() ?? "",
                        CreatedDate = row["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(row["CreatedDate"]) : null,
                        ModifiedDate = row["ModifiedDate"] != DBNull.Value ? Convert.ToDateTime(row["ModifiedDate"]) : null
                    };

                    // Calculate total hours for this entry
                    entry.TotalHours = CalculateEntryHours(entry);
                    entries.Add(entry);
                }
            }

            return entries;
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
