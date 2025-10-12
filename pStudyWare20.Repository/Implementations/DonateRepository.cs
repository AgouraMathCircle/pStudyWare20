using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for Donate operations
    /// </summary>
    public class DonateRepository : IDonateRepository
    {
        private readonly string _connectionString;

        public DonateRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "Connection string not found");
        }

        /// <summary>
        /// Gets all donors data from the database
        /// </summary>
        /// <returns>DataSet containing donor information</returns>
        public async Task<DataSet> GetDonorsAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("AMC_spGetDonors", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            var dataSet = new DataSet();
            using var adapter = new SqlDataAdapter(command);

            try
            {
                await connection.OpenAsync();
                await Task.Run(() => adapter.Fill(dataSet));
                return dataSet;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving donors data: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Gets donors by specific year
        /// </summary>
        /// <param name="year">Year to filter by</param>
        /// <returns>List of donor entries for the specified year</returns>
        public async Task<List<DonorEntry>> GetDonorsByYearAsync(int year)
        {
            var dataSet = await GetDonorsAsync();
            var donors = new List<DonorEntry>();

            if (dataSet?.Tables?.Count > 0)
            {
                // Process all tables to find donors for the specified year
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
            }

            return donors;
        }

        /// <summary>
        /// Gets donors by specific level
        /// </summary>
        /// <param name="level">Donor level to filter by</param>
        /// <param name="year">Optional year filter</param>
        /// <returns>List of donor entries for the specified level</returns>
        public async Task<List<DonorEntry>> GetDonorsByLevelAsync(string level, int? year = null)
        {
            var dataSet = await GetDonorsAsync();
            var donors = new List<DonorEntry>();

            if (dataSet?.Tables?.Count > 0)
            {
                // Process all tables to find donors for the specified level
                foreach (DataTable table in dataSet.Tables)
                {
                    if (table.Rows.Count > 0)
                    {
                        var levelRows = table.Select($"DonorLevel = '{level}'");
                        foreach (DataRow row in levelRows)
                        {
                            // Apply year filter if specified
                            if (year == null || Convert.ToInt32(row["Year"]) == year)
                            {
                                donors.Add(MapDataRowToDonorEntry(row));
                            }
                        }
                    }
                }
            }

            return donors;
        }

        /// <summary>
        /// Gets donor statistics
        /// </summary>
        /// <param name="year">Optional year filter for statistics</param>
        /// <returns>Donor statistics data</returns>
        public async Task<DonateStatsResponse> GetDonorStatisticsAsync(int? year = null)
        {
            try
            {
                var dataSet = await GetDonorsAsync();
                var response = new DonateStatsResponse { IsSuccess = true };

                if (dataSet?.Tables?.Count > 0)
                {
                    var allDonors = new List<DonorEntry>();
                    var levelBreakdown = new Dictionary<string, int>();
                    var yearBreakdown = new Dictionary<int, int>();

                    // Process all tables to collect donor data
                    foreach (DataTable table in dataSet.Tables)
                    {
                        if (table.Rows.Count > 0)
                        {
                            foreach (DataRow row in table.Rows)
                            {
                                var donor = MapDataRowToDonorEntry(row);

                                // Apply year filter if specified
                                if (year == null || donor.Year == year)
                                {
                                    allDonors.Add(donor);

                                    // Count by level
                                    if (!string.IsNullOrEmpty(donor.DonorLevel))
                                    {
                                        if (levelBreakdown.ContainsKey(donor.DonorLevel))
                                            levelBreakdown[donor.DonorLevel]++;
                                        else
                                            levelBreakdown[donor.DonorLevel] = 1;
                                    }

                                    // Count by year
                                    if (yearBreakdown.ContainsKey(donor.Year))
                                        yearBreakdown[donor.Year]++;
                                    else
                                        yearBreakdown[donor.Year] = 1;
                                }
                            }
                        }
                    }

                    response.TotalDonors = allDonors.Count;
                    response.CurrentYearDonors = allDonors.Count(d => d.Year == DateTime.Now.Year);
                    response.DonorLevels = levelBreakdown.Count;
                    response.YearsActive = yearBreakdown.Count;
                    response.LevelBreakdown = levelBreakdown;
                    response.YearBreakdown = yearBreakdown;
                }

                return response;
            }
            catch (Exception ex)
            {
                return new DonateStatsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error retrieving donor statistics: {ex.Message}"
                };
            }
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
