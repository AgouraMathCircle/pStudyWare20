using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblNewsltr
{
    public int ColLtrId { get; set; }

    public string ColEmail { get; set; } = null!;

    public DateTime? RequestedDate { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
