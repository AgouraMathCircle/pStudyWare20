using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for exam question (matches FinalExam from legacy system)
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
    /// Model for student exam answer
    /// </summary>
    public class StudentExamAnswer
    {
        [Display(Name = "Student ID")]
        public int StudentID { get; set; }

        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Question")]
        public int Question { get; set; }

        [Display(Name = "Answer Key")]
        public string AnswerKey { get; set; } = string.Empty;

        [Display(Name = "Points")]
        public int Points { get; set; }

        [Display(Name = "Created Date")]
        public DateTime CreatedDate { get; set; }

        [Display(Name = "Exam Type")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for student list request
    /// </summary>
    public class StudentListRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Mode")]
        public string Mode { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for exam questions request
    /// </summary>
    public class ExamQuestionsRequest
    {
        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        [Required(ErrorMessage = "Exam Type is required")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for score validation request
    /// </summary>
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
    }

    /// <summary>
    /// Model for current session request
    /// </summary>
    public class CurrentSessionRequest
    {
        [Display(Name = "Chapter ID")]
        [Required(ErrorMessage = "Chapter ID is required")]
        public string ChapterID { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student scores request
    /// </summary>
    public class StudentScoresRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for submit exam request
    /// </summary>
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
        [MinLength(1, ErrorMessage = "At least one answer is required")]
        public List<StudentExamAnswer> Answers { get; set; } = new List<StudentExamAnswer>();

        [Display(Name = "Score ID")]
        public string ScoreID { get; set; } = "0";
    }


    /// <summary>
    /// Model for student list item
    /// </summary>
    public class StudentListItem
    {
        [Display(Name = "Value")]
        public string Value { get; set; } = string.Empty;

        [Display(Name = "Text")]
        public string Text { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for exam questions response
    /// </summary>
    public class ExamQuestionsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Questions")]
        public List<ExamQuestion> Questions { get; set; } = new List<ExamQuestion>();
    }

    /// <summary>
    /// Model for score validation response
    /// </summary>
    public class ScoreValidationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Enable Score Update")]
        public bool EnableScoreUpdate { get; set; }
    }

    /// <summary>
    /// Model for current session response
    /// </summary>
    public class CurrentSessionResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Sessions")]
        public List<SessionItem> Sessions { get; set; } = new List<SessionItem>();
    }

    /// <summary>
    /// Model for session item
    /// </summary>
    public class SessionItem
    {
        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student scores response
    /// </summary>
    public class StudentScoresResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Scores")]
        public List<StudentScore> Scores { get; set; } = new List<StudentScore>();
    }


    /// <summary>
    /// Model for submit exam response
    /// </summary>
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

    /// <summary>
    /// Model for student list response
    /// </summary>
    public class StudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Students")]
        public List<StudentListItem> Students { get; set; } = new List<StudentListItem>();
    }
}
