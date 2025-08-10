using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblMeetingSchedule
{
    public int RowId { get; set; }

    public int? ChapterId { get; set; }

    public string? Class { get; set; }

    public string? Section { get; set; }

    public string? MeetingProviderUrl { get; set; }

    public string? MeetingUrl { get; set; }

    public string MeetingId { get; set; } = null!;

    public string? Passcode { get; set; }

    public string? AdminLogin { get; set; }

    public string? AdminPassCode { get; set; }

    public bool IncludeSection { get; set; }

    public bool Active { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? UpdatedtDate { get; set; }

    public TimeOnly? MeetingTime { get; set; }

    public DateOnly? MeetingDate { get; set; }
}
