using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.RegularExpressions;

namespace pStudyWare20.Services.Implementations
{
    public class ContactService : IContactService
    {
        private const int MinSubmitDelayMs = 3000;
        private const int MaxFormAgeMs = 24 * 60 * 60 * 1000;
        private const int MaxLinksInMessage = 3;

        private static readonly Regex LinkPattern = new(
            @"https?://",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private readonly IEmailUtility _emailUtility;

        public ContactService(IEmailUtility emailUtility)
        {
            _emailUtility = emailUtility;
        }

        /// <summary>
        /// Sends contact enquiry email (InformMe). DB save (AMC_spAddEnquiry) is not implemented.
        /// </summary>
        public ContactEnquiryResponse SubmitEnquiry(ContactEnquiryRequest request)
        {
            var response = new ContactEnquiryResponse();

            try
            {
                if (IsBotSubmission(request))
                {
                    return SuccessResponse();
                }

                if (!IsCaptchaValid(request))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Please answer the security question correctly.";
                    return response;
                }

                // Legacy ContactUs.aspx.cs also saved via AMC_spAddEnquiry — disabled until DB is ready.
                // _contactRepository.AddEnquiryAsync(request).GetAwaiter().GetResult();

                var emailSent = _emailUtility.SendContactEnquiryEmail(
                    request.Name,
                    request.Email,
                    request.Subject,
                    request.Message);

                if (!emailSent)
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Unable to send your message. Please try again.";
                    return response;
                }

                return SuccessResponse();
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        private static ContactEnquiryResponse SuccessResponse()
        {
            return new ContactEnquiryResponse
            {
                IsSuccess = true,
                Message = "Your request has successfully submitted.",
            };
        }

        private static bool IsBotSubmission(ContactEnquiryRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Website))
            {
                return true;
            }

            if (request.FormStartedAt <= 0)
            {
                return true;
            }

            var elapsedMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() - request.FormStartedAt;
            if (elapsedMs < MinSubmitDelayMs || elapsedMs > MaxFormAgeMs)
            {
                return true;
            }

            var linkCount = LinkPattern.Matches(request.Message ?? string.Empty).Count;
            if (linkCount > MaxLinksInMessage)
            {
                return true;
            }

            return false;
        }

        private static bool IsCaptchaValid(ContactEnquiryRequest request)
        {
            if (request.CaptchaOperandA is < 1 or > 20 || request.CaptchaOperandB is < 1 or > 20)
            {
                return false;
            }

            return request.CaptchaAnswer == request.CaptchaOperandA + request.CaptchaOperandB;
        }
    }
}
