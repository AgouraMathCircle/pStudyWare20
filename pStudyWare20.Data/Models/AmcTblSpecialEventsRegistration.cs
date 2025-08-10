using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblSpecialEventsRegistration
{
    public int RequestId { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string? City { get; set; }

    public string? School { get; set; }

    public string? Grade { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? EventName { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public int? ChapterId { get; set; }

    public string? State { get; set; }

    public string? Country { get; set; }

    public string? ApprovalStatus { get; set; }
}
