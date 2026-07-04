using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class NewsletterService : INewsletterService
    {
        private readonly INewsletterRepository _newsletterRepository;

        public NewsletterService(INewsletterRepository newsletterRepository)
        {
            _newsletterRepository = newsletterRepository;
        }

        /// <summary>
        /// Saves newsletter subscription to AMC_tblNewsltr (legacy footer subscribe form).
        /// </summary>
        public NewsletterSubscribeResponse Subscribe(NewsletterSubscribeRequest request)
        {
            var response = new NewsletterSubscribeResponse();
            var email = request.Email?.Trim() ?? string.Empty;

            try
            {
                if (_newsletterRepository.EmailExistsAsync(email).GetAwaiter().GetResult())
                {
                    response.IsSuccess = true;
                    response.Message = "You are already subscribed to our newsletter.";
                    return response;
                }

                _newsletterRepository.AddSubscriptionAsync(email).GetAwaiter().GetResult();

                response.IsSuccess = true;
                response.Message = "Thank you for subscribing!";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }
    }
}
