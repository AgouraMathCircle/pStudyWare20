using System;
using System.Linq.Expressions;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IMemberRepository
    {
        // Basic CRUD operations
        Task<MemberMaster?> GetByIdAsync(int id);
        Task<IEnumerable<MemberMaster>> GetAllAsync();
        Task<IEnumerable<MemberMaster>> FindAsync(Expression<Func<MemberMaster, bool>> predicate);
        Task<MemberMaster?> FirstOrDefaultAsync(Expression<Func<MemberMaster, bool>> predicate);
        Task AddAsync(MemberMaster entity);
        Task AddRangeAsync(IEnumerable<MemberMaster> entities);
        void Update(MemberMaster entity);
        void Remove(MemberMaster entity);
        void RemoveRange(IEnumerable<MemberMaster> entities);
        Task<int> SaveChangesAsync();

        // Member-specific operations
        Task<MemberMaster?> GetByEmailOrUsernameAsync(string emailOrUsername);
        Task<MemberMaster?> ValidateCredentialsAsync(string emailOrUsername, string password);
        Task UpdateLastActiveDateAsync(int memberId);

        // Stored procedure operations
        Task<MemberMaster?> ValidateUserWithStoredProcedureAsync(string emailId, string password);
        Task AddUserTrackingAsync(string userId, string userName, string userType, string ipAddress);
    }
}