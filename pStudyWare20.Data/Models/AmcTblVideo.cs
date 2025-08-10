using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblVideo
{
    public int MvideoId { get; set; }

    public string? MBatch { get; set; }

    public string? MTopics { get; set; }

    public string? MDescription { get; set; }

    public string? MUrlname { get; set; }

    public string? MSession { get; set; }

    public bool Active { get; set; }

    public DateTime? InsertDate { get; set; }

    public int? MDocId { get; set; }

    public string? MSemester { get; set; }
}
