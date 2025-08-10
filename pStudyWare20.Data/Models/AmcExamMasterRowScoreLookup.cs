using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcExamMasterRowScoreLookup
{
    public int RowId { get; set; }

    public int? ChapterId { get; set; }

    public string? Semester { get; set; }

    public string? Session { get; set; }

    public string? ExamType { get; set; }

    public string? Category { get; set; }

    public int RawScore { get; set; }

    public int ReportedScore { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
