using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcInstructorMaster
{
    public int InstructorId { get; set; }

    public string Type { get; set; } = null!;

    public string Class { get; set; } = null!;

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? ChangeBy { get; set; }

    public DateTime? ChangeDate { get; set; }

    public string? ContactPhone { get; set; }

    public string? Section { get; set; }

    public int? ChapterId { get; set; }
}
