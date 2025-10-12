namespace pStudyWare20.Shared
{
    /// <summary>
    /// DTO for stored procedure results that don't return all MemberMaster columns
    /// Only includes columns that are actually returned by the pWebMemberFrm stored procedure
    /// Based on the original ASP.NET code, it only uses the Password column
    /// </summary>
    public class MemberPasswordResult
    {
        public string Password { get; set; } = string.Empty;
    }
}
