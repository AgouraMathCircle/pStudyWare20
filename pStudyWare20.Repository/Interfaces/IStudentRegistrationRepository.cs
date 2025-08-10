using System.Collections.Generic;
using System.Threading.Tasks;
using pStudyWare20.Entity;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IStudentRegistrationRepository
    {
        Task<StudentRegistration> CreateAsync(StudentRegistration registration);
        Task<StudentRegistration?> GetByIdAsync(int id);
        Task<IEnumerable<StudentRegistration>> GetAllAsync();
        Task<StudentRegistration?> UpdateAsync(StudentRegistration registration);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<StudentRegistration>> GetByParentEmailAsync(string email);
        Task<IEnumerable<StudentRegistration>> GetByStudentEmailAsync(string email);
        Task<IEnumerable<StudentRegistration>> GetBySessionAsync(string session);
        Task<IEnumerable<StudentRegistration>> GetByLocationAsync(int location);
    }
} 