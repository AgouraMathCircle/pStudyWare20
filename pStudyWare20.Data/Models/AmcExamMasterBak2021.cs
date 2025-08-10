using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcExamMasterBak2021
{
    public string? Semester { get; set; }

    public string Class { get; set; } = null!;

    public string? ExamType { get; set; }

    public int Question { get; set; }

    public string AnswerKey { get; set; } = null!;

    public int Points { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int RowId { get; set; }

    public string? AnswerType { get; set; }

    public string? Category { get; set; }

    public string? AnswerDescription { get; set; }

    public string? MSession { get; set; }
}
