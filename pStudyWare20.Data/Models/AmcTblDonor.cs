using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblDonor
{
    public int DonorId { get; set; }

    public string DonorName { get; set; } = null!;

    public string DonorLevel { get; set; } = null!;

    public int Year { get; set; }

    public string? PostedBy { get; set; }

    public DateTime? PostedDate { get; set; }

    public string? Semester { get; set; }
}
