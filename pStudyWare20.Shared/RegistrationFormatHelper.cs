namespace pStudyWare20.Shared
{
    /// <summary>
    /// Course/location display text for registration forms and emails.
    /// Format: Name - Location - City (no extra formatting).
    /// </summary>
    public static class RegistrationFormatHelper
    {
        private static string RemoveCourseIdPrefix(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            var trimmed = value.Trim();
            var dashIndex = trimmed.IndexOf(" - ", StringComparison.Ordinal);
            if (dashIndex > 0 &&
                int.TryParse(trimmed[..dashIndex].Trim(), out _))
            {
                return trimmed[(dashIndex + 3)..].Trim();
            }

            return trimmed;
        }

        public static string FormatLocationEmailText(string? name, string? location, string? city = null)
        {
            var parts = new List<string>();

            if (!string.IsNullOrWhiteSpace(name))
            {
                parts.Add(RemoveCourseIdPrefix(name));
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
    }
}
