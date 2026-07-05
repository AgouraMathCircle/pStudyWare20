using System.ComponentModel.DataAnnotations;



namespace pStudyWare20.Shared

{

    public class NewsletterSubscribeRequest

    {

        [Required(ErrorMessage = "Please enter your Email ID.")]

        [EmailAddress(ErrorMessage = "Please enter a valid Email ID.")]

        public string Email { get; set; } = string.Empty;

    }



    public class NewsletterSubscribeResponse

    {

        public bool IsSuccess { get; set; }

        public string Message { get; set; } = string.Empty;

        public string ErrorMessage { get; set; } = string.Empty;

    }

}


