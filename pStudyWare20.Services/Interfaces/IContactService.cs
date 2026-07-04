using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface IContactService
    {
        ContactEnquiryResponse SubmitEnquiry(ContactEnquiryRequest request);
    }
}
