using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;
        private readonly IEmailUtility _emailUtility;

        public ContactService(IContactRepository contactRepository, IEmailUtility emailUtility)
        {
            _contactRepository = contactRepository;
            _emailUtility = emailUtility;
        }

        /// <summary>
        /// Saves enquiry and notifies admin (matches ContactUs.aspx.cs btnSubmit_Click + InformMe).
        /// </summary>
        public ContactEnquiryResponse SubmitEnquiry(ContactEnquiryRequest request)
        {
            var response = new ContactEnquiryResponse();

            try
            {
                _contactRepository.AddEnquiryAsync(request).GetAwaiter().GetResult();

                var emailSent = _emailUtility.SendContactEnquiryEmail(
                    request.Name,
                    request.Email,
                    request.Subject,
                    request.Message);

                if (!emailSent)
                {
                    response.IsSuccess = true;
                    response.Message = "Your request has successfully submitted.";
                    response.ErrorMessage = "Enquiry saved, but the notification email could not be sent.";
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
