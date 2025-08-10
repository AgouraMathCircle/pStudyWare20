using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcMailMerger
{
    public int RowId { get; set; }

    public string? EmailSendTo { get; set; }

    public string? EmailSubject { get; set; }

    public string? EmailBody { get; set; }

    public string? DataValue1 { get; set; }

    public string? DataValue2 { get; set; }

    public string? DataValue3 { get; set; }

    public string? DataValue5 { get; set; }

    public string? DataValue6 { get; set; }

    public bool? EmailSendStatus { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
