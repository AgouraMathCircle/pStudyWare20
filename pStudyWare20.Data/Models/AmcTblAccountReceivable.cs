using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblAccountReceivable
{
    public int ArId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PaymentMode { get; set; } = null!;

    public DateTime PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public string? PayerType { get; set; }

    public string? Documents { get; set; }

    public string? Comments { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? ChangeBy { get; set; }

    public DateTime? ChangeDate { get; set; }
}
