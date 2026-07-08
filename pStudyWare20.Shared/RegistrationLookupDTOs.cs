namespace pStudyWare20.Shared
{
    /// <summary>
    /// Semester option for public registration forms (Register For dropdown).
    /// </summary>
    public class RegistrationSemesterOption
    {
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }

    public class RegistrationSemesterOptionsResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public List<RegistrationSemesterOption> Semesters { get; set; } = new();
    }

/// <summary>
/// Course/location option for public registration forms.
/// Backed by AMC_ChapterMaster active rows.
/// </summary>
public class RegistrationLocationOption
{
    public int ChapterId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string EmailLabel { get; set; } = string.Empty;
}

public class RegistrationLocationOptionsResponse
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<RegistrationLocationOption> Locations { get; set; } = new();
}
}
