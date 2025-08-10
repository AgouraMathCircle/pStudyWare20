using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblChannel
{
    public int ChannelId { get; set; }

    public string? Image { get; set; }

    public string? Title { get; set; }

    public string? Link { get; set; }

    public string? Description { get; set; }

    public string? Createdby { get; set; }

    public DateTime? CreatedDate { get; set; }
}
