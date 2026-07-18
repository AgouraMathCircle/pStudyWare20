using System.Globalization;
using System.Text.RegularExpressions;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Legacy volunteer availability session helpers (pStudyware_DashboardMessage.ascx.cs).
    /// </summary>
    public static class VolunteerAvailabilitySessionHelper
    {
        private static readonly Regex SessionOnlyPattern =
            new(@"^Session\s+\d+$", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

        /// <summary>
        /// DB session for AMC_VolunteerAvailability — same number as AMC_spSelectCurrentSession.
        /// "Fall Session 1" -> "Session 1"; "Session 1" -> "Session 1"; "Fall 1" -> "Fall 1".
        /// </summary>
        public static string GetTargetSession(string? currentSession)
        {
            var text = (currentSession ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(text))
            {
                return string.Empty;
            }

            var sessionNumber = ExtractSessionNumber(text);
            if (sessionNumber == null)
            {
                return text;
            }

            var parts = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // Legacy two-part format: parts[1] is numeric ("Session 1", "Fall 1").
            if (parts.Length >= 2 &&
                int.TryParse(parts[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out _))
            {
                return $"{parts[0]} {sessionNumber.Value}".Trim();
            }

            // AMC_spSelectCurrentSession extended format (e.g. "Fall Session 1") -> DB "Session N".
            return $"Session {sessionNumber.Value}";
        }

        /// <summary>
        /// Extracts the session number from legacy or extended session labels.
        /// </summary>
        public static int? ExtractSessionNumber(string? sessionText)
        {
            var text = (sessionText ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(text))
            {
                return null;
            }

            var parts = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length >= 2 &&
                int.TryParse(parts[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var legacyNumber))
            {
                return legacyNumber;
            }

            if (parts.Length >= 1 &&
                int.TryParse(parts[^1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var trailingNumber))
            {
                return trailingNumber;
            }

            return null;
        }

        /// <summary>
        /// Normalizes a submitted session to the DB format expected by AMC_spVolunteerAvailability_*.
        /// Always derives from the authoritative current session (AMC_spSelectCurrentSession).
        /// </summary>
        public static string NormalizeSubmittedSession(string? submittedSession, string? currentSession)
        {
            var expected = GetTargetSession(currentSession);
            if (!string.IsNullOrEmpty(expected))
            {
                return expected;
            }

            var submitted = (submittedSession ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(submitted))
            {
                return string.Empty;
            }

            if (SessionOnlyPattern.IsMatch(submitted))
            {
                return submitted;
            }

            var submittedNumber = ExtractSessionNumber(submitted);
            if (submittedNumber != null)
            {
                return $"Session {submittedNumber.Value}";
            }

            return submitted;
        }

        public static string BuildVolunteeringPrompt(string? targetSession)
        {
            var session = (targetSession ?? string.Empty).Trim();
            return string.IsNullOrEmpty(session)
                ? "Are you Volunteering?"
                : $"Are you Volunteering {session}?";
        }

        /// <summary>
        /// Legacy semester format for AMC_spVolunteerAvailability_* (e.g. Fall 2026 -> F2026).
        /// </summary>
        public static string FormatSemesterForDb(string? semester)
        {
            var trimmed = (semester ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(trimmed))
            {
                return string.Empty;
            }

            if (trimmed.Length >= 2 && char.IsLetter(trimmed[0]) && char.IsDigit(trimmed[^1]))
            {
                var compactMatch = Regex.Match(trimmed, @"^[FSfs]\d{4}$");
                if (compactMatch.Success)
                {
                    return trimmed.ToUpperInvariant();
                }
            }

            var parts = trimmed.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length >= 2 && parts[0].Length > 0)
            {
                var firstLetter = char.ToUpperInvariant(parts[0][0]);
                var yearPart = parts[^1];
                if (yearPart.Length == 4 && int.TryParse(yearPart, NumberStyles.Integer, CultureInfo.InvariantCulture, out _))
                {
                    return $"{firstLetter}{yearPart}";
                }
            }

            return trimmed.Length <= 5 ? trimmed.ToUpperInvariant() : trimmed[..5].ToUpperInvariant();
        }
    }
}
