namespace pStudyWare20.Shared
{
    /// <summary>
    /// Matches admin AMC_tblLookupSemester.OnlineExamDisplayChapter (comma-separated chapter IDs).
    /// Used for Update Score ↔ Online Exam routing.
    /// </summary>
    public static class OnlineExamDisplayHelper
    {
        /// <summary>
        /// True when the chapter is listed in OnlineExamDisplayChapter (e.g. "3,5,6,").
        /// Empty list means no chapters use online exam — stay on manual Update Score.
        /// </summary>
        public static bool ShouldRedirectToOnlineExam(
            string? chapterId,
            string? onlineExamDisplayChapter)
        {
            return IsChapterInDisplayList(chapterId, onlineExamDisplayChapter);
        }

        /// <summary>
        /// True when the chapter is not configured for online exam (redirect to manual Update Score).
        /// </summary>
        public static bool ShouldRedirectToManualScoreUpdate(
            string? chapterId,
            string? onlineExamDisplayChapter)
        {
            var chapterList = (onlineExamDisplayChapter ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(chapterList))
            {
                return true;
            }

            return !IsChapterInDisplayList(chapterId, onlineExamDisplayChapter);
        }

        public static bool IsChapterInDisplayList(
            string? chapterId,
            string? onlineExamDisplayChapter)
        {
            var chapterList = (onlineExamDisplayChapter ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(chapterList))
            {
                return false;
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

        public static string NormalizeChapterId(string? chapterId)
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
