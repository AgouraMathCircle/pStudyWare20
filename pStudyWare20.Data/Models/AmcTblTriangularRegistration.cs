using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblTriangularRegistration
{
    public int RowiId { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Country { get; set; }

    public DateTime? InsertDate { get; set; }
}
