using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for managing volunteer availability business logic
    /// </summary>
    public class VolunteerAvailabilityService : IVolunteerAvailabilityService
    {
        private readonly IVolunteerAvailabilityRepository _volunteerAvailabilityRepository;

        public VolunteerAvailabilityService(IVolunteerAvailabilityRepository volunteerAvailabilityRepository)
        {
            _volunteerAvailabilityRepository = volunteerAvailabilityRepository;
        }

        /// <summary>
        /// Updates the volunteer availability using the repository
        /// </summary>
        public async Task<VolunteerAvailabilityResponse> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request)
        {
            try
            {
                var success = await _volunteerAvailabilityRepository.UpdateVolunteerAvailabilityAsync(request);
                
                if (success)
                {
                    return new VolunteerAvailabilityResponse
                    {
                        IsSuccess = true,
                        Message = "Volunteer availability updated successfully."
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
                var summaryData = await _volunteerAvailabilityRepository.GetVolunteerAvailabilitySummaryAsync(request.Username);
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
