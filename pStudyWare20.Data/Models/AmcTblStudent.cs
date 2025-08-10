using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblStudent
{
    public int ColStudentId { get; set; }

    public string ColStudentFname { get; set; } = null!;

    public string? ColStudentLname { get; set; }

    public string? ColStudentEmail { get; set; }

    public string? ColStudentSchool { get; set; }

    public string? ColStudentGrade { get; set; }

    public string? ColStudentstatus { get; set; }

    public string? ColStudentPicPerm { get; set; }

    public int? ColParentId { get; set; }

    public string? ColStudentEnrolledSession { get; set; }

    public string? LiabilitySignature { get; set; }

    public string? RuleSignature { get; set; }

    public DateTime? RegisteredDate { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public string? ColEventLocation { get; set; }

    public string? ColStatus { get; set; }

    public string? WaitingListStatus { get; set; }

    public int? RegistrationPriority { get; set; }

    public string? RequestedLocation { get; set; }

    public int? ChapterId { get; set; }

    public DateTime? SignatureDate { get; set; }

    public virtual AmcTblUser? ColParent { get; set; }
}
