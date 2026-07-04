using Microsoft.EntityFrameworkCore;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;

namespace pStudyWare20.Repository.Implementations
{
    public class NewsletterRepository : INewsletterRepository
    {
        private readonly AMC_DBContext _context;

        public NewsletterRepository(AMC_DBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Persists newsletter email to AMC_tblNewsltr (legacy footer subscribe form).
        /// </summary>
        public async Task<bool> EmailExistsAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();

            return await _context.AMC_tblNewsltrs
                .AnyAsync(x => x.colEmail.ToLower() == normalizedEmail);
        }

        public async Task AddSubscriptionAsync(string email)
        {
            var now = DateTime.Now;

            _context.AMC_tblNewsltrs.Add(new AMC_tblNewsltr
            {
                colEmail = email.Trim(),
                RequestedDate = now,
                InsertDate = now,
            });

            await _context.SaveChangesAsync();
        }
    }
}
