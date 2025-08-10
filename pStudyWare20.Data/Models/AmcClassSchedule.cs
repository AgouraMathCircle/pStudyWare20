using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcClassSchedule
{
    public string Semester { get; set; } = null!;

    public string? Session { get; set; }

    public DateTime ClassDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? ChangeBy { get; set; }

    public DateTime? ChangeDate { get; set; }

    public bool? Active { get; set; }

    public int RowId { get; set; }

    public int? ChapterId { get; set; }
}
