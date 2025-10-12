using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for Donate operations
    /// </summary>
    public class DonateService : IDonateService
    {
        private readonly IDonateRepository _donateRepository;

        public DonateService(IDonateRepository donateRepository)
        {
            _donateRepository = donateRepository ?? throw new ArgumentNullException(nameof(donateRepository));
        }

        /// <summary>
        /// Gets all donors data
        /// </summary>
        /// <returns>GetDonorsResponse containing donor information</returns>
        public async Task<GetDonorsResponse> GetDonorsAsync()
        {
            try
            {
                var dataSet = await _donateRepository.GetDonorsAsync();
                var response = new GetDonorsResponse { IsSuccess = true };

                if (dataSet?.Tables?.Count > 0)
                {
                    // Get current year from the first table
                    var currentYear = DateTime.Now.Year;
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        currentYear = Convert.ToInt32(dataSet.Tables[0].Rows[0]["Year"]);
                    }

                    response.CurrentYear = currentYear;

                    // Process current year donors
                    response.CurrentYearDonors = await ProcessDonorsForYear(dataSet, currentYear);

                    // Process past year donors
                    response.PastYearDonors = await ProcessPastYearDonors(dataSet, currentYear);
                }

                return response;
            }
            catch (Exception ex)
            {
                return new GetDonorsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error retrieving donors: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets donors by specific year
        /// </summary>
        /// <param name="request">Request containing year filter</param>
        /// <returns>GetDonorsByYearResponse containing donors for the year</returns>
        public async Task<GetDonorsByYearResponse> GetDonorsByYearAsync(GetDonorsByYearRequest request)
        {
            try
            {
                var donors = await _donateRepository.GetDonorsByYearAsync(request.Year);

                return new GetDonorsByYearResponse
                {
                    IsSuccess = true,
                    Donors = donors,
                    Year = request.Year
                };
            }
            catch (Exception ex)
            {
                return new GetDonorsByYearResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error retrieving donors for year {request.Year}: {ex.Message}",
                    Year = request.Year
                };
            }
        }

        /// <summary>
        /// Gets donors by specific level
        /// </summary>
        /// <param name="request">Request containing level and optional year filter</param>
        /// <returns>GetDonorsByLevelResponse containing donors for the level</returns>
        public async Task<GetDonorsByLevelResponse> GetDonorsByLevelAsync(GetDonorsByLevelRequest request)
        {
            try
            {
                var donors = await _donateRepository.GetDonorsByLevelAsync(request.Level, request.Year);

                return new GetDonorsByLevelResponse
                {
                    IsSuccess = true,
                    Donors = donors,
                    Level = request.Level,
                    Year = request.Year
                };
            }
            catch (Exception ex)
            {
                return new GetDonorsByLevelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error retrieving donors for level {request.Level}: {ex.Message}",
                    Level = request.Level,
                    Year = request.Year
                };
            }
        }

        /// <summary>
        /// Gets donate dashboard data
        /// </summary>
        /// <param name="request">Request for dashboard data</param>
        /// <returns>DonateDashboardResponse containing dashboard information</returns>
        public async Task<DonateDashboardResponse> GetDashboardDataAsync(DonateDashboardRequest request)
        {
            try
            {
                var donorsResponse = await GetDonorsAsync();
                var response = new DonateDashboardResponse
                {
                    IsSuccess = donorsResponse.IsSuccess,
                    ErrorMessage = donorsResponse.ErrorMessage,
                    CurrentYearDonors = donorsResponse.CurrentYearDonors,
                    PastYearDonors = donorsResponse.PastYearDonors,
                    CurrentYear = donorsResponse.CurrentYear
                };

                if (request.IncludeStatistics && donorsResponse.IsSuccess)
                {
                    var statsRequest = new DonateStatsRequest();
                    response.Statistics = await GetDonateStatsAsync(statsRequest);
                }

                return response;
            }
            catch (Exception ex)
            {
                return new DonateDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error retrieving dashboard data: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Gets donate statistics
        /// </summary>
        /// <param name="request">Request for statistics data</param>
        /// <returns>DonateStatsResponse containing statistics</returns>
        public async Task<DonateStatsResponse> GetDonateStatsAsync(DonateStatsRequest request)
        {
            try
            {
                return await _donateRepository.GetDonorStatisticsAsync(request.Year);
            }
            catch (Exception ex)
            {
                return new DonateStatsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error retrieving statistics: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Checks donate privileges for the current user
        /// </summary>
        /// <returns>DonatePrivilegesResponse containing privilege information</returns>
        public async Task<DonatePrivilegesResponse> CheckDonatePrivilegesAsync()
        {
            try
            {
                // For now, all users can view donors and statistics
                // This can be enhanced with proper authentication/authorization
                return new DonatePrivilegesResponse
                {
                    IsSuccess = true,
                    CanViewDonors = true,
                    CanViewStatistics = true,
                    CanAddDonors = false // Only admins should be able to add donors
                };
            }
            catch (Exception ex)
            {
                return new DonatePrivilegesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error checking privileges: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Processes donors for a specific year
        /// </summary>
        /// <param name="dataSet">DataSet containing donor data</param>
        /// <param name="year">Year to process</param>
        /// <returns>List of donor entries for the year</returns>
        private async Task<List<DonorEntry>> ProcessDonorsForYear(DataSet dataSet, int year)
        {
            var donors = new List<DonorEntry>();

            foreach (DataTable table in dataSet.Tables)
            {
                if (table.Rows.Count > 0)
                {
                    var yearRows = table.Select($"Year = {year}");
                    foreach (DataRow row in yearRows)
                    {
                        donors.Add(MapDataRowToDonorEntry(row));
                    }
                }
            }

            return await Task.FromResult(donors);
        }

        /// <summary>
        /// Processes past year donors
        /// </summary>
        /// <param name="dataSet">DataSet containing donor data</param>
        /// <param name="currentYear">Current year to exclude</param>
        /// <returns>Dictionary of past year donors</returns>
        private async Task<Dictionary<int, List<DonorEntry>>> ProcessPastYearDonors(DataSet dataSet, int currentYear)
        {
            var pastYearDonors = new Dictionary<int, List<DonorEntry>>();

            foreach (DataTable table in dataSet.Tables)
            {
                if (table.Rows.Count > 0)
                {
                    var pastYearRows = table.Select($"Year <> {currentYear}");
                    foreach (DataRow row in pastYearRows)
                    {
                        var year = Convert.ToInt32(row["Year"]);
                        if (!pastYearDonors.ContainsKey(year))
                        {
                            pastYearDonors[year] = new List<DonorEntry>();
                        }
                        pastYearDonors[year].Add(MapDataRowToDonorEntry(row));
                    }
                }
            }

            return await Task.FromResult(pastYearDonors);
        }

        /// <summary>
        /// Maps a DataRow to DonorEntry
        /// </summary>
        /// <param name="row">DataRow to map</param>
        /// <returns>DonorEntry object</returns>
        private static DonorEntry MapDataRowToDonorEntry(DataRow row)
        {
            return new DonorEntry
            {
                RowID = row.Table.Columns.Contains("RowID") ? Convert.ToInt32(row["RowID"]) : 0,
                DonorName = row.Table.Columns.Contains("DonorName") ? row["DonorName"]?.ToString() ?? string.Empty : string.Empty,
                DonorLevel = row.Table.Columns.Contains("DonorLevel") ? row["DonorLevel"]?.ToString() ?? string.Empty : string.Empty,
                Year = row.Table.Columns.Contains("Year") ? Convert.ToInt32(row["Year"]) : DateTime.Now.Year,
                Semester = row.Table.Columns.Contains("Semester") ? row["Semester"]?.ToString() ?? string.Empty : string.Empty,
                Amount = row.Table.Columns.Contains("Amount") && row["Amount"] != DBNull.Value ? Convert.ToDecimal(row["Amount"]) : null,
                DateAdded = row.Table.Columns.Contains("DateAdded") && row["DateAdded"] != DBNull.Value ? Convert.ToDateTime(row["DateAdded"]) : null
            };
        }
    }
}
