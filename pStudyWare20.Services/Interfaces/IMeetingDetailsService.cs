using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for meeting details business logic
    /// </summary>
    public interface IMeetingDetailsService
    {
        /// <summary>
        /// Get meeting schedule list
        /// </summary>
        /// <param name="request">Meeting schedule list request</param>
        /// <returns>Meeting schedule list response</returns>
        Task<MeetingScheduleListResponse> GetMeetingScheduleListAsync(MeetingScheduleListRequest request);

        /// <summary>
        /// Get specific meeting schedule by ID
        /// </summary>
        /// <param name="request">Get meeting schedule request</param>
        /// <returns>Get meeting schedule response</returns>
        Task<GetMeetingScheduleResponse> GetMeetingScheduleByIdAsync(GetMeetingScheduleRequest request);

        /// <summary>
        /// Insert or update meeting schedule
        /// </summary>
        /// <param name="request">Upsert meeting schedule request</param>
        /// <returns>Upsert meeting schedule response</returns>
        Task<UpsertMeetingScheduleResponse> UpsertMeetingScheduleAsync(UpsertMeetingScheduleRequest request);

        /// <summary>
        /// Get chapter locations
        /// </summary>
        /// <param name="request">Chapter location request</param>
        /// <returns>Chapter location response</returns>
        Task<ChapterLocationResponse> GetChapterLocationsAsync(GetChapterLocationRequest request);

        /// <summary>
        /// Prepare new meeting form data
        /// </summary>
        /// <param name="request">Prepare new meeting request</param>
        /// <returns>Prepare new meeting response</returns>
        Task<PrepareNewMeetingResponse> PrepareNewMeetingAsync(PrepareNewMeetingRequest request);
    }
}
