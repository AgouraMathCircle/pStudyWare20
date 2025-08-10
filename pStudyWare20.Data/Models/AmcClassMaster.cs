using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcClassMaster
{
    public int StudentId { get; set; }

    public string Semester { get; set; } = null!;

    public string Class { get; set; } = null!;

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? ChangeBy { get; set; }

    public DateTime? ChangeDate { get; set; }

    public string? Section { get; set; }
}
