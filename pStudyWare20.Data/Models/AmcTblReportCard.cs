using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcTblReportCard
{
    public int MReportCardId { get; set; }

    public int MStudentId { get; set; }

    public string? MType { get; set; }

    public int MTotalPoints { get; set; }

    public double MReceivedPoints { get; set; }

    public string? MGroup { get; set; }

    public DateTime? MExamDate { get; set; }

    public string? MComments { get; set; }

    public DateTime? InsertDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public string? MSemster { get; set; }

    public string? MClass { get; set; }

    public string? MSection { get; set; }

    public int? ChapterId { get; set; }
}
