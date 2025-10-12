using System;
using System.Linq.Expressions;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IMemberRepository
    {
        // Stored procedure operations
        Task<MemberMaster?> ValidateUserWithStoredProcedureAsync(string emailId, string password);
        Task<MemberMaster?> GetUserPasswordByEmailAsync(string emailId);
        Task AddUserTrackingAsync(string userId, string userName, string userType, string ipAddress);
    }
}