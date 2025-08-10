using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblUserTracking
{
    public int RowId { get; set; }

    public int UserId { get; set; }

    public string? UserName { get; set; }

    public string? UserType { get; set; }

    public DateTime? LoginDate { get; set; }

    public string? Ipaddress { get; set; }
}
