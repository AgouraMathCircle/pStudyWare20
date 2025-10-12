using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for online exam question (matches OnlineExam from legacy system)
    /// </summary>
    public class OnlineExamQuestion
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
    /// Model for student online exam answer
    /// </summary>
    public class StudentOnlineExamAnswer
    {
        [Display(Name = "Student ID")]
        public int StudentID { get; set; }

        [Display(Name = "Answer Key")]
        public string AnswerKey { get; set; } = string.Empty;

        [Display(Name = "Question")]
        public int Question { get; set; }

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Current Semester")]
        public string CurrentSemester { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student list request
    /// </summary>
    public class OnlineExamStudentListRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Type")]
        public string Type { get; set; } = "E";
    }

    /// <summary>
    /// Model for online exam questions request
    /// </summary>
    public class OnlineExamQuestionsRequest
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
    public class OnlineExamScoreValidationRequest
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
    public class OnlineExamCurrentSessionRequest
    {
        [Display(Name = "Chapter ID")]
        [Required(ErrorMessage = "Chapter ID is required")]
        public string ChapterID { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student scores request
    /// </summary>
    public class OnlineExamStudentScoresRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for submit online exam request
    /// </summary>
    public class SubmitOnlineExamRequest
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
        public List<StudentOnlineExamAnswer> Answers { get; set; } = new List<StudentOnlineExamAnswer>();

        [Display(Name = "Score ID")]
        public string ScoreID { get; set; } = "0";
    }

    /// <summary>
    /// Model for student list response
    /// </summary>
    public class OnlineExamStudentListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student List")]
        public List<StudentListItem> StudentList { get; set; } = new List<StudentListItem>();
    }

    /// <summary>
    /// Model for online exam questions response
    /// </summary>
    public class OnlineExamQuestionsResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Questions")]
        public List<OnlineExamQuestion> Questions { get; set; } = new List<OnlineExamQuestion>();
    }

    /// <summary>
    /// Model for score validation response
    /// </summary>
    public class OnlineExamScoreValidationResponse
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
    public class OnlineExamCurrentSessionResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Sessions")]
        public List<SessionItem> Sessions { get; set; } = new List<SessionItem>();
    }

    /// <summary>
    /// Model for student scores response
    /// </summary>
    public class OnlineExamStudentScoresResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Scores")]
        public List<StudentScore> Scores { get; set; } = new List<StudentScore>();
    }

    /// <summary>
    /// Model for submit online exam response
    /// </summary>
    public class SubmitOnlineExamResponse
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
