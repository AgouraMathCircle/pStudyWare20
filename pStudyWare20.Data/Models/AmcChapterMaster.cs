using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcChapterMaster
{
    public int ChapterId { get; set; }

    public string? Name { get; set; }

    public string? Program { get; set; }

    public string Location { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string ContactPerson { get; set; } = null!;

    public string ContactPhone { get; set; } = null!;

    public string ContactEmail { get; set; } = null!;

    public string SupportEmail { get; set; } = null!;

    public string Emailsuffix { get; set; } = null!;

    public DateTime StartingDate { get; set; }

    public bool? Active { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? IsOnlineExamActive { get; set; }
}
