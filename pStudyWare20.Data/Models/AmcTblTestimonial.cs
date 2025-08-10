using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblTestimonial
{
    public int ColTestId { get; set; }

    public string? ColTestUser { get; set; }

    public string? ColTestEmail { get; set; }

    public string? ColTestMessage { get; set; }

    public DateOnly? ColTestDate { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
