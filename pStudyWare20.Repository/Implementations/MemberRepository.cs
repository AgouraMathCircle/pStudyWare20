using Microsoft.EntityFrameworkCore;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Linq.Expressions;

namespace pStudyWare20.Repository.Implementations
{
    public class MemberRepository : IMemberRepository
    {
        private readonly string? _connectionString;
        private readonly AMC_DBContext _context;
        private readonly DbSet<MemberMaster> _dbSet;

        public MemberRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _dbSet = context.Set<MemberMaster>();
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection connection string not found in configuration.");
        }

        // Basic CRUD operations
        public async Task<MemberMaster?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<MemberMaster>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<IEnumerable<MemberMaster>> FindAsync(Expression<Func<MemberMaster, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task<MemberMaster?> FirstOrDefaultAsync(Expression<Func<MemberMaster, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        public async Task AddAsync(MemberMaster entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<MemberMaster> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public void Update(MemberMaster entity)
        {
            _dbSet.Update(entity);
        }

        public void Remove(MemberMaster entity)
        {
            _dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<MemberMaster> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // Member-specific operations
        public async Task<MemberMaster?> GetByEmailOrUsernameAsync(string emailOrUsername)
        {
            // Convert to lowercase for case-insensitive comparison
            var searchTerm = emailOrUsername.ToLower();

            return await _dbSet.FirstOrDefaultAsync(u =>
                (u.EmailID != null && u.EmailID.ToLower() == searchTerm) ||
                (u.UserName != null && u.UserName.ToLower() == searchTerm));
        }

        public async Task<MemberMaster?> ValidateCredentialsAsync(string emailOrUsername, string password)
        {
            var user = await GetByEmailOrUsernameAsync(emailOrUsername);

            if (user == null)
                return null;

            // Validate password (assuming plain text for now - should be hashed in production)
            if (user.Password != password)
                return null;

            // Check if user is active
            if (user.Active == false)
                return null;

            return user;
        }

        public async Task UpdateLastActiveDateAsync(int memberId)
        {
            var user = await _dbSet.FindAsync(memberId);
            if (user != null)
            {
                user.LastActiveDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<MemberMaster?> ValidateUserWithStoredProcedureAsync(string emailId, string password)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("pWebMemberFrm", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@emailId", emailId));
                    command.Parameters.Add(new SqlParameter("@password", password));
                    command.Parameters.Add(new SqlParameter("@mode", "ValidateUser"));

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        var dataSet = new DataSet();
                        adapter.Fill(dataSet);

                        if (dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count == 1)
                        {
                            var row = dataSet.Tables[0].Rows[0];

                            return new MemberMaster
                            {
                                pMemberID = Convert.ToInt32(row["pMemberID"]),
                                EmailID = row["EmailID"]?.ToString(),
                                UserName = row["Username"]?.ToString(),
                                FirstName = row["FirstName"]?.ToString(),
                                LastName = row["LastName"]?.ToString(),
                                MemberType = row["MemberType"]?.ToString(),
                                ChapterID = row["ChapterID"] != DBNull.Value ? Convert.ToInt32(row["ChapterID"]) : null,
                                systemAdmin = row["systemAdmin"]?.ToString(),
                                Active = true // Assuming if stored procedure returns a row, user is active
                            };
                        }
                    }
                }
            }

            return null;
        }

        public async Task AddUserTrackingAsync(string userId, string userName, string userType, string ipAddress)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spAddUserTracking", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@UserID", userId));
                    command.Parameters.Add(new SqlParameter("@UserName", userName));
                    command.Parameters.Add(new SqlParameter("@UserType", userType));
                    command.Parameters.Add(new SqlParameter("@IPAddress", ipAddress));

                    await command.ExecuteNonQueryAsync();
                }
            }
        }
    }
}