using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for student registration request (matches RegistrationStudentModel from reference)
    /// </summary>
    public class RegistrationStudentModel
    {
        [Display(Name = "Parent First Name")]
        public string ParentFirstName { get; set; } = string.Empty;

        [Display(Name = "Parent Last Name")]
        public string ParentLastName { get; set; } = string.Empty;

        [Display(Name = "Address")]
        public string Address { get; set; } = string.Empty;

        [Display(Name = "City")]
        public string City { get; set; } = string.Empty;

        [Display(Name = "State")]
        public string State { get; set; } = string.Empty;

        [Display(Name = "Parent Phone Number")]
        public string ParentPhoneNo { get; set; } = string.Empty;

        [Display(Name = "Parent Email")]
        public string ParentEmail { get; set; } = string.Empty;

        [Display(Name = "Country")]
        public string Country { get; set; } = string.Empty;

        [Display(Name = "Student First Name")]
        public string StudentFirstName { get; set; } = string.Empty;

        [Display(Name = "Student Last Name")]
        public string StudentLastName { get; set; } = string.Empty;

        [Display(Name = "Student Email")]
        public string StudentEmail { get; set; } = string.Empty;

        [Display(Name = "Student School Name")]
        public string StudentSchoolName { get; set; } = string.Empty;

        [Display(Name = "Student Grade")]
        public string StudentGrade { get; set; } = string.Empty;

        [Display(Name = "Location ID")]
        public int LocationId { get; set; }

        [Display(Name = "Session ID")]
        public string SessionId { get; set; } = string.Empty;

        [Display(Name = "Picture Permission")]
        public bool PicturePermission { get; set; }

        [Display(Name = "Liability Signature")]
        public string LiabilitySignature { get; set; } = string.Empty;

        [Display(Name = "Rule Signature")]
        public string RuleSignature { get; set; } = string.Empty;

        [Display(Name = "Username")]
        public string UserName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student list request (matches Studentlist from reference)
    /// </summary>
    public class Studentlist
    {
        [Display(Name = "Username")]
        public string userName { get; set; } = string.Empty;

        [Display(Name = "Chapter ID")]
        public int chapterID { get; set; }
    }

    /// <summary>
    /// Model for username request (matches UserName from reference)
    /// </summary>
    public class UserName
    {
        [Display(Name = "Username")]
        public string userName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for students report card (matches StudentsReportCard from reference)
    /// </summary>
    public class StudentsReportCard
    {
        [Display(Name = "Student ID")]
        public int StudentID { get; set; }

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Quiz Total Score")]
        public int QuizTotalScore { get; set; }

        [Display(Name = "Quiz Received Score")]
        public int QuizReceivedScore { get; set; }

        [Display(Name = "Quiz Comments")]
        public string QuizComments { get; set; } = string.Empty;

        [Display(Name = "Class Total Score")]
        public int ClassTotalScore { get; set; }

        [Display(Name = "Class Received Score")]
        public int ClassReceivedScore { get; set; }

        [Display(Name = "Class Comments")]
        public string ClassComments { get; set; } = string.Empty;

        [Display(Name = "Homework Total Score")]
        public int HomeWorkTotalScore { get; set; }

        [Display(Name = "Homework Received Score")]
        public int HomeWorkReceivedScore { get; set; }

        [Display(Name = "Homework Comments")]
        public string HomeWorkComments { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for chapter ID request (matches ChapterID from reference)
    /// </summary>
    public class Chapter
    {
        [Display(Name = "Chapter ID")]
        public int ChapterID { get; set; }
    }

    /// <summary>
    /// Model for student ID request (matches StudentID from reference)
    /// </summary>
    public class StudentID
    {
        [Display(Name = "Student ID")]
        public int studentID { get; set; }
    }

    /// <summary>
    /// Model for student detail (matches StudentDetail from reference)
    /// </summary>
    public class StudentDetail
    {
        [Display(Name = "Student ID")]
        public int StudentId { get; set; }

        [Display(Name = "Student First Name")]
        public string StudentFirstName { get; set; } = string.Empty;

        [Display(Name = "Student Last Name")]
        public string StudentLastName { get; set; } = string.Empty;

        [Display(Name = "Student Email ID")]
        public string StudentEmailID { get; set; } = string.Empty;

        [Display(Name = "School")]
        public string School { get; set; } = string.Empty;

        [Display(Name = "Grade Level")]
        public string GradeLevel { get; set; } = string.Empty;

        [Display(Name = "City")]
        public string City { get; set; } = string.Empty;

        [Display(Name = "State")]
        public string State { get; set; } = string.Empty;

        [Display(Name = "Country")]
        public string Country { get; set; } = string.Empty;

        [Display(Name = "Student Phone")]
        public string StudentPhone { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "Registration Update")]
        public string RegistrationUpdate { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student detail response (matches StudentDetailResponse from reference)
    /// </summary>
    public class StudentDetailResponse
    {
        [Display(Name = "Student First Name")]
        public string StudentFirstName { get; set; } = string.Empty;

        [Display(Name = "Student Last Name")]
        public string StudentLastName { get; set; } = string.Empty;

        [Display(Name = "Student Email ID")]
        public string StudentEmailID { get; set; } = string.Empty;

        [Display(Name = "Student Phone")]
        public string StudentPhone { get; set; } = string.Empty;

        [Display(Name = "State")]
        public string State { get; set; } = string.Empty;

        [Display(Name = "City")]
        public string City { get; set; } = string.Empty;

        [Display(Name = "Student ID")]
        public int StudentId { get; set; }

        [Display(Name = "Grade Level")]
        public string GradeLevel { get; set; } = string.Empty;

        [Display(Name = "Country")]
        public string Country { get; set; } = string.Empty;

        [Display(Name = "Is Success")]
        public bool isSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student list dropdown (matches StudentlistDropdown from reference)
    /// </summary>
    public class StudentlistDropdown
    {
        [Display(Name = "Username")]
        public string userName { get; set; } = string.Empty;

        [Display(Name = "User Type Mode")]
        public string userTypeMode { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for response report card details (matches ResponseReportCardDetails from reference)
    /// </summary>
    public class ResponseReportCardDetails
    {
        [Display(Name = "Is Success")]
        public bool isSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Report Card")]
        public string Reportcard { get; set; } = string.Empty;

        [Display(Name = "Student Detail Utility")]
        public object StudentDetailUtillity { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }
}
