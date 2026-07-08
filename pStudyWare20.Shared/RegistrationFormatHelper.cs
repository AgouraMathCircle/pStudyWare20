namespace pStudyWare20.Shared
{
    /// <summary>
    /// Formats AMC_ChapterMaster rows for registration dropdowns and emails.
    /// </summary>
    public static class RegistrationFormatHelper
    {
        public static string FormatLocationDropdownLabel(
            int chapterId,
            string? name,
            string? location,
            string? city)
        {
            var parts = new List<string>();
            if (chapterId > 0)
            {
                parts.Add(chapterId.ToString());
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                parts.Add(name.Trim());
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                parts.Add(location.Trim());
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                parts.Add(city.Trim());
            }

            return string.Join(" - ", parts);
        }

        /// <summary>
        /// Email text: Course Name [Name] - Location
        /// </summary>
        public static string FormatLocationEmailText(string? name, string? location)
        {
            var trimmedName = name?.Trim() ?? string.Empty;
            var trimmedLocation = location?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(trimmedName))
            {
                return trimmedLocation;
            }

            if (string.IsNullOrWhiteSpace(trimmedLocation))
            {
                return trimmedName;
            }

            return $"{trimmedName} - {trimmedLocation}";
        }
    }
}
