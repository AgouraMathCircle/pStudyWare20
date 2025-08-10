using System;
using System.Collections.Generic;

namespace pStudyWare20.Data.Models;

public partial class AmcCountry
{
    public int CountryId { get; set; }

    public string? CountryCode { get; set; }

    public string? CountryName { get; set; }

    public int? DisplayOrder { get; set; }
}
