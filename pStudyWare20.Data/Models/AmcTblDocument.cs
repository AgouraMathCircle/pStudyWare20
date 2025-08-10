using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblDocument
{
    public int MDocId { get; set; }

    public string? MGrade { get; set; }

    public string? MBatch { get; set; }

    public string? MTopics { get; set; }

    public string? MDescription { get; set; }

    public string? MDocName { get; set; }

    public string? MSession { get; set; }

    public string MDocType { get; set; } = null!;

    public string? MDocSession { get; set; }

    public bool Active { get; set; }

    public DateTime? InsertDate { get; set; }
}
