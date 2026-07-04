namespace pStudyWare20.Shared
{
    /// <summary>
    /// Matches admin FinalExamDisplay / FinalExamDisplayChapter semester lookup rules.
    /// </summary>
    public static class FinalExamDisplayHelper
    {
        /// <summary>
        /// Legacy dropdown value: Class~StudentID~ChapterID.
        /// </summary>
        public static string? ParseChapterIdFromStudentListValue(string? studentListValue)
        {
            if (string.IsNullOrWhiteSpace(studentListValue))
            {
                return null;
            }

            var parts = studentListValue.Split('~');
            if (parts.Length < 3)
            {
                return null;
            }

            var chapterId = NormalizeChapterId(parts[2]);
            return string.IsNullOrEmpty(chapterId) ? null : chapterId;
        }

        public static bool IsChapterEligible(
            string? chapterId,
            bool finalExamDisplayEnabled,
            string? finalExamDisplayChapter)
        {
            if (!finalExamDisplayEnabled)
            {
                return false;
            }

            var chapterList = (finalExamDisplayChapter ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(chapterList))
            {
                return true;
            }

            var normalizedChapter = NormalizeChapterId(chapterId);
            if (string.IsNullOrEmpty(normalizedChapter))
            {
                return false;
            }

            return chapterList
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Any(chapter => string.Equals(
                    NormalizeChapterId(chapter),
                    normalizedChapter,
                    StringComparison.OrdinalIgnoreCase));
        }

        public static bool IsStudentEligibleForFinalExam(
            string? studentListValue,
            bool finalExamDisplayEnabled,
            string? finalExamDisplayChapter)
        {
            if (!finalExamDisplayEnabled)
            {
                return false;
            }

            var chapterList = (finalExamDisplayChapter ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(chapterList))
            {
                return true;
            }

            var studentChapter = ParseChapterIdFromStudentListValue(studentListValue);
            return IsChapterEligible(studentChapter, true, finalExamDisplayChapter);
        }

        public static List<StudentListItem> FilterEligibleStudents(
            IEnumerable<StudentListItem> students,
            bool finalExamDisplayEnabled,
            string? finalExamDisplayChapter)
        {
            return students
                .Where(student => IsStudentEligibleForFinalExam(
                    student.Value,
                    finalExamDisplayEnabled,
                    finalExamDisplayChapter))
                .ToList();
        }

        public static bool ShouldShowFinalExam(
            bool finalExamDisplayEnabled,
            string? finalExamDisplayChapter,
            string? userChapterId)
        {
            return IsChapterEligible(userChapterId, finalExamDisplayEnabled, finalExamDisplayChapter);
        }

        private static string NormalizeChapterId(string? chapterId)
        {
            var trimmed = (chapterId ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(trimmed))
            {
                return string.Empty;
            }

            return int.TryParse(trimmed, out var parsed)
                ? parsed.ToString()
                : trimmed;
        }
    }
}
