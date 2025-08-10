using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcClassType
{
    public int RowId { get; set; }

    public string Class { get; set; } = null!;

    public string? ClassName { get; set; }

    public string? Section { get; set; }

    public string? StudentEmailGroup { get; set; }

    public string? InstructorEmailGroup { get; set; }

    public int DisplayOrder { get; set; }

    public int? ChapterId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
