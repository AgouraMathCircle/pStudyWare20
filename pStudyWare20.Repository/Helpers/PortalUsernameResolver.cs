using Microsoft.EntityFrameworkCore;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Repository.Helpers
{
    /// <summary>
    /// Resolves login identifiers (email, etc.) to MemberMaster.UserName for legacy stored procedures.
    /// </summary>
    public static class PortalUsernameResolver
    {
        public static async Task<string> ResolveAsync(AMC_DBContext context, string? identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier))
            {
                return string.Empty;
            }

            var normalized = identifier.Trim();
            var upper = normalized.ToUpper();

            var member = await context.MemberMasters
                .AsNoTracking()
                .FirstOrDefaultAsync(m =>
                    (m.UserName != null && m.UserName.ToUpper() == upper) ||
                    (m.EmailID != null && m.EmailID.ToUpper() == upper));

            if (member != null && !string.IsNullOrWhiteSpace(member.UserName))
            {
                return member.UserName.Trim();
            }

            return normalized;
        }

        /// <summary>
        /// Resolves login id to parent email for legacy SPs (e.g. AMC_spReportCard_StudentDashboard).
        /// </summary>
        public static async Task<string> ResolvePortalEmailAsync(AMC_DBContext context, string? identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier))
            {
                return string.Empty;
            }

            var normalized = identifier.Trim();
            var upper = normalized.ToUpper();

            var member = await context.MemberMasters
                .AsNoTracking()
                .FirstOrDefaultAsync(m =>
                    (m.UserName != null && m.UserName.ToUpper() == upper) ||
                    (m.EmailID != null && m.EmailID.ToUpper() == upper));

            if (!string.IsNullOrWhiteSpace(member?.EmailID))
            {
                return member.EmailID.Trim();
            }

            return normalized;
        }
    }
}
