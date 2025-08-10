using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblRegistration
{
    public int Id { get; set; }

    public string Semester { get; set; } = null!;

    public int? StudentId { get; set; }

    public DateTime? InsertDate { get; set; }

    public string? Status { get; set; }
}
