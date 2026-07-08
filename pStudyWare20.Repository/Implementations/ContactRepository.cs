using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Contact enquiry DB persistence — disabled until AMC_spAddEnquiry is wired up.
    /// </summary>
    public class ContactRepository : IContactRepository
    {
        private readonly string _connectionString;

        public ContactRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _ = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Database connection is not configured (DefaultConnection).");
        }
        /// <summary>
        /// Saves contact enquiry using AMC_spAddEnquiry (matches ContactUs.aspx.cs btnSubmit_Click).
        /// </summary>
        //public Task AddEnquiryAsync(ContactEnquiryRequest request)
        //{        
        //    // await using var connection = new SqlConnection(_connectionString);
        //    // await connection.OpenAsync();
        //    // await using var command = new SqlCommand("AMC_spAddEnquiry", connection) { CommandType = CommandType.StoredProcedure };
        //    // command.Parameters.Add(new SqlParameter("@Name", request.Name ?? string.Empty));
        //    // command.Parameters.Add(new SqlParameter("@Email", request.Email ?? string.Empty));
        //    // command.Parameters.Add(new SqlParameter("@Message", request.Message ?? string.Empty));
        //    // await command.ExecuteNonQueryAsync();
        //    throw new NotImplementedException("Contact enquiry database save is not enabled.");
        //}
    }
}
