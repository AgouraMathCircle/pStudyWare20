using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IContactRepository
    {
        Task AddEnquiryAsync(ContactEnquiryRequest request);
    }
}
