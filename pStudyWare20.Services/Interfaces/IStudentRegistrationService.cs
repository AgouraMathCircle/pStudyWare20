using System.Collections.Generic;
using System.Threading.Tasks;
using pStudyWare20.Entity;

namespace pStudyWare20.Services.Interfaces
{
    public interface IStudentRegistrationService
    {
        Task<StudentRegistrationResponse> RegisterStudentAsync(StudentRegistrationRequest request);
        Task<StudentRegistration> GetRegistrationByIdAsync(int id);
        Task<IEnumerable<StudentRegistration>> GetAllRegistrationsAsync();
        Task<StudentRegistration> UpdateRegistrationAsync(int id, StudentRegistrationRequest request);
        Task<bool> DeleteRegistrationAsync(int id);
        Task<IEnumerable<StudentRegistration>> GetRegistrationsByParentEmailAsync(string email);
        Task<IEnumerable<StudentRegistration>> GetRegistrationsByStudentEmailAsync(string email);
        Task<IEnumerable<StudentRegistration>> GetRegistrationsBySessionAsync(string session);
        Task<IEnumerable<StudentRegistration>> GetRegistrationsByLocationAsync(int location);
    }
} 