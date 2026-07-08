using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class ContactService : IContactService
    {
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

                response.IsSuccess = true;
                response.Message = "Your request has successfully submitted.";
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