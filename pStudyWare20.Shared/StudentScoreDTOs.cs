using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for student score (matches StudentScore from legacy system)
    /// </summary>
    public class StudentScore
    {
        [Display(Name = "Student ID")]
        public int StudentID { get; set; }

        [Display(Name = "Student Name")]
        public string StudentName { get; set; } = string.Empty;

        [Display(Name = "Group")]
        public string Group { get; set; } = string.Empty;

        [Display(Name = "Grade")]
        public string Grade { get; set; } = string.Empty;

        [Display(Name = "Semester")]
        public string Semester { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Exam Date")]
        public DateTime ExamDate { get; set; }

        [Display(Name = "Total Credit")]
        public float TotalCredit { get; set; }

        [Display(Name = "Received Credit")]
        public float ReceivedCredit { get; set; }

        [Display(Name = "Comments")]
        public string Comments { get; set; } = string.Empty;

        [Display(Name = "Report ID")]
        public string ReportID { get; set; } = "0";

        [Display(Name = "Submitted Date")]
        public string SubmittedDate { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for due date (matches StudentScore from legacy system)
    /// </summary>
    public class DueDate
    {
        [Display(Name = "Due Date")]
        public string Value { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for add student score request
    /// </summary>
    public class AddStudentScoreRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public string StudentID { get; set; } = string.Empty;

        [Display(Name = "Group / Class")]
        [JsonPropertyName("class")]
        public string Group { get; set; } = string.Empty;

        [Display(Name = "Exam Date")]
        public string ExamDate { get; set; } = string.Empty;

        [Display(Name = "Quiz Total Score")]
        [Required(ErrorMessage = "Quiz Total Score is required")]
        public string QuizTotalScore { get; set; } = "10";

        [Display(Name = "Quiz Received Score")]
        public string QuizReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Quiz Comments")]
        public string QuizComments { get; set; } = string.Empty;

        [Display(Name = "Class Test Total Score")]
        [Required(ErrorMessage = "Class Test Total Score is required")]
        public string ClassTestTotalScore { get; set; } = "10";

        [Display(Name = "Class Test Received Score")]
        public string ClassTestReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Class Test Comments")]
        public string ClassTestComments { get; set; } = string.Empty;

        [Display(Name = "Home Work Total Score")]
        [Required(ErrorMessage = "Home Work Total Score is required")]
        public string HomeWorkTotalScore { get; set; } = "10";

        [Display(Name = "Home Work Received Score")]
        public string HomeWorkReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Home Work Comments")]
        public string HomeWorkComments { get; set; } = string.Empty;

        [Display(Name = "Final Exam Total Score")]
        public string FinalExamTotalScore { get; set; } = "0";

        [Display(Name = "Final Exam Received Score")]
        public string FinalExamReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Final Exam Comments")]
        public string FinalExamComments { get; set; } = string.Empty;

        [Display(Name = "Placement Test Total Score")]
        public string PlacementTestTotalScore { get; set; } = "0";

        [Display(Name = "Placement Test Received Score")]
        public string PlacementTestReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Placement Test Comments")]
        public string PlacementTestComments { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for update student score request
    /// </summary>
    public class UpdateStudentScoreRequest
    {
        [Display(Name = "Report ID")]
        [Required(ErrorMessage = "Report ID is required")]
        public string ReportID { get; set; } = string.Empty;

        [Display(Name = "Group / Class")]
        public string Group { get; set; } = string.Empty;

        [Display(Name = "Exam Date")]
        public string ExamDate { get; set; } = string.Empty;

        [Display(Name = "Type")]
        [Required(ErrorMessage = "Type is required")]
        public string Type { get; set; } = string.Empty;

        [Display(Name = "Total Score")]
        [Required(ErrorMessage = "Total Score is required")]
        public string TotalScore { get; set; } = string.Empty;

        [Display(Name = "Received Score")]
        [Required(ErrorMessage = "Received Score is required")]
        public string ReceivedScore { get; set; } = string.Empty;

        [Display(Name = "Comments")]
        public string Comments { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get student scores request
    /// </summary>
    public class GetStudentScoresRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for validate score update request
    /// </summary>
    public class ValidateScoreUpdateRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public string StudentID { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        [JsonPropertyName("class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Exam Type")]
        [Required(ErrorMessage = "Exam Type is required")]
        public string ExamType { get; set; } = string.Empty;

        [Display(Name = "Source")]
        public string Source { get; set; } = "UpdateScore";
    }

    /// <summary>
    /// Model for get due date request
    /// </summary>
    public class GetDueDateRequest
    {
        // No specific parameters needed for due date lookup
    }

    /// <summary>
    /// Model for student scores list response
    /// </summary>
    public class StudentScoresListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student Scores")]
        public List<StudentScore> StudentScores { get; set; } = new List<StudentScore>();
    }


    /// <summary>
    /// Model for due date response
    /// </summary>
    public class DueDateResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Due Date")]
        public string DueDate { get; set; } = string.Empty;
    }


    /// <summary>
    /// Model for score operation response
    /// </summary>
    public class ScoreOperationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }
}
