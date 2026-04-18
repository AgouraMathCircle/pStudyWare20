using System.Data;
using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface ISemesterLookupRepository
    {
        Task<DataTable> SelectSemesterLookupAsync();
        Task UpdateSemesterLookupAsync(UpdateSemesterLookupRequest request);
    }
}
