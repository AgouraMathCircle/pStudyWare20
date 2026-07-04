using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Final exam question (matches legacy FinalExam.aspx question rows).
    /// </summary>
    public class ExamQuestion
    {
        [Display(Name = "Question Number")]
        public int Question { get; set; }

        [Display(Name = "Answer Key")]
        public string AnswerKey { get; set; } = string.Empty;

        [Display(Name = "Points")]
        public int Points { get; set; }

        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }
    }

    /// <summary>
    /// Student answer row for final exam submit TVP.
    /// </summary>
    public class StudentExamAnswer
    {
        [Display(Name = "Question")]
        public int Question { get; set; }

        [Display(Name = "Answer Key")]
        public string AnswerKey { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }

    public class StudentListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = "E";
    }

    public class ExamQuestionsRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public int StudentID { get; set; }

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        [Required(ErrorMessage = "Exam Type is required")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        /// <summary>Set by API from JWT for chapter eligibility enforcement.</summary>
        public string PortalUsername { get; set; } = string.Empty;
    }

    public class ScoreValidationRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public int StudentID { get; set; }

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        [Required(ErrorMessage = "Exam Type is required")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Source")]
        public string Source { get; set; } = "OnlineExam";

        /// <summary>Set by API from JWT for chapter eligibility enforcement.</summary>
        public string PortalUsername { get; set; } = string.Empty;
    }

    public class CurrentSessionRequest
    {
        [Display(Name = "Chapter ID")]
        [Required(ErrorMessage = "Chapter ID is required")]
        public string ChapterID { get; set; } = string.Empty;
    }

    public class StudentScoresRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    public class SubmitExamRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public string StudentID { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        [Required(ErrorMessage = "Exam Type is required")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Answers")]
        [Required(ErrorMessage = "Answers are required")]
        public List<StudentExamAnswer> Answers { get; set; } = new List<StudentExamAnswer>();

        [Display(Name = "Score ID")]
        public string ScoreID { get; set; } = "0";

        /// <summary>Set by API from JWT; used for score email and ownership validation.</summary>
        public string PortalUsername { get; set; } = string.Empty;
    }

    public class FinalExamAvailabilityResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public bool ShowFinalExam { get; set; }
        public int EligibleStudentCount { get; set; }
    }

    public class StudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Students")]
        public List<StudentListItem> Students { get; set; } = new List<StudentListItem>();
    }

    public class ExamQuestionsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Questions")]
        public List<ExamQuestion> Questions { get; set; } = new List<ExamQuestion>();
    }

    public class StudentScoresResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Scores")]
        public List<StudentScore> Scores { get; set; } = new List<StudentScore>();
    }

    public class SubmitExamResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Total Score")]
        public string TotalScore { get; set; } = string.Empty;

        [Display(Name = "Received Score")]
        public string ReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }
}
