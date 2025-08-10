using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblUser
{
    public int ColuserId { get; set; }

    public string ColuserfName { get; set; } = null!;

    public string? ColuserlName { get; set; }

    public string? ColuserAddress { get; set; }

    public string? ColuserCity { get; set; }

    public string? ColuserState { get; set; }

    public string? ColuserZip { get; set; }

    public string? ColuserPhNo { get; set; }

    public string? ColuserEmail { get; set; }

    public string? ColuserStatus { get; set; }

    public string? ColSecurelvl { get; set; }

    public DateTime? RegisteredDate { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public string? ColuserCountry { get; set; }

    public string? ColParentEmail { get; set; }

    public virtual ICollection<AmcTblStudent> AmcTblStudents { get; set; } = new List<AmcTblStudent>();
}
