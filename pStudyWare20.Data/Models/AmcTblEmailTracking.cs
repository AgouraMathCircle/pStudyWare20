using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblEmailTracking
{
    public int Id { get; set; }

    public string SendFrom { get; set; } = null!;

    public string SendTo { get; set; } = null!;

    public string Subject { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string? SendBy { get; set; }

    public DateTime? SendDate { get; set; }

    public string Status { get; set; } = null!;

    public int? ChapterId { get; set; }

    public string? UserType { get; set; }
}
