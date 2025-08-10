using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblLookupSemester
{
    public int Id { get; set; }

    public string Semester { get; set; } = null!;

    public bool? Active { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateOnly? StartingDate { get; set; }

    public string? RegistrationStatus { get; set; }

    public DateTime? RegStartDate { get; set; }

    public DateTime? RegCloseDate { get; set; }

    public int? DisplayDocumentsFrom { get; set; }

    public string? LastSemester { get; set; }

    public int? JbtotalSpace { get; set; }

    public int? JitotalSpace { get; set; }

    public int? JatotalSpace { get; set; }

    public int? SbtotalSpace { get; set; }

    public int? SitotalSpace { get; set; }

    public int? SatotalSpace { get; set; }

    public int? ChapterId { get; set; }

    public DateOnly? CurrentExamDate { get; set; }

    public DateTime? CurrentExamDueTime { get; set; }

    public string? SemesterName { get; set; }

    public string? NextSemester { get; set; }

    public int? AitotalSpace { get; set; }

    public int? AttotalSpace { get; set; }

    public int? SttotalSpace { get; set; }

    public int? DstotalSpace { get; set; }

    public int? MktotalSpace { get; set; }

    public int? Amc8totalSpace { get; set; }

    public int? Amc10totalSpace { get; set; }

    public int? Amc12totalSpace { get; set; }
}
