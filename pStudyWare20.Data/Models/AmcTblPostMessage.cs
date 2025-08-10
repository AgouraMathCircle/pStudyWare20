using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblPostMessage
{
    public int MessageId { get; set; }

    public string Type { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string? PostedBy { get; set; }

    public DateTime? PostedDate { get; set; }

    public bool SendEmail { get; set; }

    public bool Active { get; set; }

    public int? ChapterId { get; set; }
}
