using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for meeting schedule data
    /// </summary>
    public class MeetingSchedule
    {
        [Display(Name = "Row ID")]
        public int RowId { get; set; }

        [Display(Name = "Chapter ID")]
        public string ChapterId { get; set; } = string.Empty;

        [Display(Name = "Chapter Name")]
        public string ChapterName { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Meeting Provider URL")]
        public string MeetingProviderUrl { get; set; } = string.Empty;

        [Display(Name = "Meeting URL")]
        public string MeetingUrl { get; set; } = string.Empty;

        [Display(Name = "Meeting ID")]
        public string MeetingId { get; set; } = string.Empty;

        [Display(Name = "Passcode")]
        public string Passcode { get; set; } = string.Empty;

        [Display(Name = "Admin Login")]
        public string AdminLogin { get; set; } = string.Empty;

        [Display(Name = "Admin Pass Code")]
        public string AdminPassCode { get; set; } = string.Empty;

        [Display(Name = "Include Section")]
        public bool IncludeSection { get; set; }

        [Display(Name = "Active")]
        public bool Active { get; set; }

        [Display(Name = "Meeting Time")]
        public string MeetingTime { get; set; } = string.Empty;

        [Display(Name = "Meeting Date")]
        public string MeetingDate { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting meeting schedule list request
    /// </summary>
    public class MeetingScheduleListRequest
    {
        [Display(Name = "Row ID")]
        public string RowId { get; set; } = "0";

        /// <summary>
        /// When set (e.g. student dashboard), use AMC_spMeetingSchedule_Select to return only meetings for this user.
        /// When null/empty, use AMC_tblMeetingSchedule_Select for all records (admin).
        /// </summary>
        [Display(Name = "User Name")]
        public string? UserName { get; set; }
    }

    /// <summary>
    /// Model for getting meeting schedule list response
    /// </summary>
    public class MeetingScheduleListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Meeting Schedules")]
        public object MeetingSchedules { get; set; } = new object();
    }

    /// <summary>
    /// Model for getting specific meeting schedule request
    /// </summary>
    public class GetMeetingScheduleRequest
    {
        [Display(Name = "Row ID")]
        public string RowId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for getting specific meeting schedule response
    /// </summary>
    public class GetMeetingScheduleResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Meeting Schedule")]
        public MeetingSchedule? MeetingSchedule { get; set; }
    }

    /// <summary>
    /// Model for inserting/updating meeting schedule request
    /// </summary>
    public class UpsertMeetingScheduleRequest
    {
        [Display(Name = "Row ID")]
        public string RowId { get; set; } = "0";

        [Display(Name = "Chapter ID")]
        public string ChapterId { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Section")]
        public string Section { get; set; } = string.Empty;

        [Display(Name = "Meeting Provider URL")]
        public string MeetingProviderUrl { get; set; } = string.Empty;

        [Display(Name = "Meeting URL")]
        public string MeetingUrl { get; set; } = string.Empty;

        [Display(Name = "Meeting ID")]
        public string MeetingId { get; set; } = string.Empty;

        [Display(Name = "Passcode")]
        public string Passcode { get; set; } = string.Empty;

        [Display(Name = "Admin Login")]
        public string AdminLogin { get; set; } = string.Empty;

        [Display(Name = "Admin Pass Code")]
        public string AdminPassCode { get; set; } = string.Empty;

        [Display(Name = "Include Section")]
        public string IncludeSection { get; set; } = "0";

        [Display(Name = "Active")]
        public string Active { get; set; } = "0";

        [Display(Name = "Meeting Time")]
        public string MeetingTime { get; set; } = string.Empty;

        [Display(Name = "Meeting Date")]
        public string MeetingDate { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for inserting/updating meeting schedule response
    /// </summary>
    public class UpsertMeetingScheduleResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for preparing new meeting form request
    /// </summary>
    public class PrepareNewMeetingRequest
    {
        // No specific parameters needed for this request
    }

    /// <summary>
    /// Model for preparing new meeting form response
    /// </summary>
    public class PrepareNewMeetingResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Form Data")]
        public MeetingSchedule FormData { get; set; } = new MeetingSchedule();
    }

    /// <summary>
    /// Model for meeting details privileges check response
    /// </summary>
    public class MeetingDetailsPrivilegesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Is Admin")]
        public bool IsAdmin { get; set; }

        [Display(Name = "Is System Admin")]
        public bool IsSystemAdmin { get; set; }

        [Display(Name = "Role")]
        public string Role { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "Can Add Meetings")]
        public bool CanAddMeetings { get; set; }

        [Display(Name = "Can Edit Meetings")]
        public bool CanEditMeetings { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
