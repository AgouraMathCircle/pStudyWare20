using pStudyWare20.Data.Models;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IMemberRepository : IRepository<MemberMaster>
    {
        Task<MemberMaster?> GetByEmailOrUsernameAsync(string emailOrUsername);
        Task<MemberMaster?> ValidateCredentialsAsync(string emailOrUsername, string password);
        Task UpdateLastActiveDateAsync(int memberId);
        
        // New methods for stored procedure authentication
        Task<MemberMaster?> ValidateUserWithStoredProcedureAsync(string emailId, string password);
        Task AddUserTrackingAsync(string userId, string userName, string userType, string ipAddress);
    }
} 