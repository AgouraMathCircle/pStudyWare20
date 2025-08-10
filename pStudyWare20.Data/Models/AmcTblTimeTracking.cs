using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblTimeTracking
{
    public int LogId { get; set; }

    public int? MemberId { get; set; }

    public string? TaskName { get; set; }

    public DateTime? DateVolunteer { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public string? TaskDescription { get; set; }

    public bool? Approved { get; set; }

    public string? Comments { get; set; }
}
