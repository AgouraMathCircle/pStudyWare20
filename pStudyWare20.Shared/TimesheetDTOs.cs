using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for timesheet ID request (matches TimeSheetID from reference)
    /// </summary>
    public class TimeSheetID
    {
        [Display(Name = "Log ID")]
        public int Logid { get; set; }
    }

    /// <summary>
    /// Model for timesheet entry (matches TimeSheetEntry from reference)
    /// </summary>
    public class TimeSheetEntry
    {
        [Display(Name = "Log ID")]
        public string LogID { get; set; } = string.Empty;

        [Display(Name = "Username")]
        public string UserName { get; set; } = string.Empty;

        [Display(Name = "Task Name")]
        public string TaskName { get; set; } = string.Empty;

        [Display(Name = "Volunteer Date")]
        public DateTime VolunteerDate { get; set; }

        [Display(Name = "Start Hour")]
        public string StartHour { get; set; } = string.Empty;

        [Display(Name = "Start Minute")]
        public string Startmin { get; set; } = string.Empty;

        [Display(Name = "Start Type")]
        public string StartType { get; set; } = string.Empty;

        [Display(Name = "End Hour")]
        public string EndHour { get; set; } = string.Empty;

        [Display(Name = "End Minute")]
        public string Endmin { get; set; } = string.Empty;

        [Display(Name = "End Type")]
        public string EndType { get; set; } = string.Empty;

        [Display(Name = "Task Description")]
        public string TaskDescription { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for timesheet display (matches TimeSheet from reference)
    /// </summary>
    public class TimeSheet
    {
        [Display(Name = "Row ID")]
        public string RowId { get; set; } = string.Empty;

        [Display(Name = "Username")]
        public string UserName { get; set; } = string.Empty;

        [Display(Name = "Log ID")]
        public string LogID { get; set; } = string.Empty;

        [Display(Name = "Full Name")]
        public string FullName { get; set; } = string.Empty;

        [Display(Name = "Task Name")]
        public string TaskName { get; set; } = string.Empty;

        [Display(Name = "Volunteer Date")]
        public DateTime VolunteerDate { get; set; }

        [Display(Name = "Start Time")]
        public TimeSpan StartTime { get; set; }

        [Display(Name = "Is Approved")]
        public bool isApproved { get; set; }

        [Display(Name = "Comments")]
        public string Comments { get; set; } = string.Empty;

        [Display(Name = "End Time")]
        public TimeSpan EndTime { get; set; }

        [Display(Name = "Total Hours")]
        public string TotalHours { get; set; } = string.Empty;

        [Display(Name = "Start Time to Display")]
        public string StartTimetoDisplay { get; set; } = string.Empty;

        [Display(Name = "End Time to Display")]
        public string EndTimetoDisplay { get; set; } = string.Empty;

        [Display(Name = "Task Description")]
        public string TaskDescription { get; set; } = string.Empty;
    }
}
