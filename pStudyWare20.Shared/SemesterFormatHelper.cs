using System.Text.RegularExpressions;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Formats AMC semester codes (e.g. F2026, S2026) for registration dropdowns.
    /// </summary>
    public static class SemesterFormatHelper
    {
        private static readonly Regex SemesterCodePattern = new(@"^[SFsf]\d{4}$", RegexOptions.Compiled);

        public static string FormatSemesterDisplayName(string? semesterCode, string? semesterName = null)
        {
            if (!string.IsNullOrWhiteSpace(semesterName))
            {
                var trimmedName = semesterName.Trim();
                if (!IsRawSemesterCode(trimmedName))
                {
                    return trimmedName;
                }
            }

            return FormatFromCode(semesterCode);
        }

        public static bool IsRawSemesterCode(string? value) =>
            !string.IsNullOrWhiteSpace(value) && SemesterCodePattern.IsMatch(value.Trim());

        private static string FormatFromCode(string? semesterCode)
        {
            if (string.IsNullOrWhiteSpace(semesterCode))
            {
                return string.Empty;
            }

            var code = semesterCode.Trim();
            if (code.Length < 2)
            {
                return code;
            }

            var term = char.ToUpperInvariant(code[0]) switch
            {
                'F' => "Fall Semester",
                'S' => "Spring Semester",
                _ => code[..1],
            };

            var year = code[1..].Trim();
            return string.IsNullOrWhiteSpace(year) ? term : $"{term} {year}";
        }
    }
}
