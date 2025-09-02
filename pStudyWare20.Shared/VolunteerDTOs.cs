using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for volunteer registration request (matches RegistrationVolunteerModel from reference)
    /// </summary>
    public class RegistrationVolunteerModel
    {
        [Display(Name = " FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [Display(Name = " LastName")]
        public string LastName { get; set; } = string.Empty;

        [Display(Name = " PhoneNo")]
        public string PhoneNo { get; set; } = string.Empty;

        [Display(Name = " City")]
        public string City { get; set; } = string.Empty;

        [Display(Name = " State")]
        public string State { get; set; } = string.Empty;

        [Display(Name = " Country")]
        public string Country { get; set; } = string.Empty;

        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "School/University Name")]
        public string SchoolName { get; set; } = string.Empty;

        [Display(Name = " Grade")]
        public string Grade { get; set; } = string.Empty;

        [Display(Name = "Location Id")]
        public int LocationId { get; set; }

        [Display(Name = "Session Name")]
        public string SessionId { get; set; } = string.Empty;

        [Display(Name = "Location Name")]
        public string LocationName { get; set; } = string.Empty;

        [Display(Name = "Session Name")]
        public string SessionName { get; set; } = string.Empty;

        [Display(Name = "Interested")]
        public string InterestedFor { get; set; } = string.Empty;

        [Display(Name = "Session Name")]
        public string Aboutyourself { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response details model (matches ResponseDetails from reference)
    /// </summary>
    public class ResponseDetails
    {
        [Display(Name = "Check Status True/False.Read Error message if False")]
        public bool isSuccess { get; set; }

        public string ErrorMessage { get; set; } = string.Empty;

        public object Message { get; set; } = string.Empty;
    }
}
