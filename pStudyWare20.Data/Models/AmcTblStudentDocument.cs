using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblStudentDocument
{
    public int MDocId { get; set; }

    public int MStudentId { get; set; }

    public string MDocName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Type { get; set; }

    public DateTime? InsertDate { get; set; }
}
