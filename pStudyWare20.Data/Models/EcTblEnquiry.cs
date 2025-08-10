using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class EcTblEnquiry
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime? InsertDate { get; set; }
}
