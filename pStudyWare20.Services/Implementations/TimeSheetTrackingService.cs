using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

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

        /// <summary>
        /// Delete timesheet tracking entry
        /// </summary>
        public async Task<DeleteTimeSheetTrackingResponse> DeleteTimeSheetTrackingAsync(DeleteTimeSheetTrackingRequest request)
        {
            try
            {
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

        /// <summary>
        /// Convert DataTable to TimeSheetTrackingEntry list
        /// </summary>
        private List<TimeSheetTrackingEntry> ConvertDataTableToTimeSheetEntries(DataTable dataTable)
        {
            var entries = new List<TimeSheetTrackingEntry>();

            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    var entry = new TimeSheetTrackingEntry
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
                    entries.Add(entry);
                }
            }

            return entries;
        }
    }
}
