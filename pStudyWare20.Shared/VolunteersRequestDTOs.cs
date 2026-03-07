using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Single volunteer request item (matches grid from VolunteersRequest.aspx)
    /// </summary>
    public class VolunteerRequestItem
    {
        public int VolunteerID { get; set; }
        public string VolunteerName { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string EnrolledSession { get; set; } = string.Empty;
        public string Interest { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime InsertDate { get; set; }
        public string Comments { get; set; } = string.Empty;
        /// <summary>Legacy format: FirstName~#LastName~#Email~#ChapterID</summary>
        public string VolunteerInfo { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request for get volunteers request list
    /// </summary>
    public class GetVolunteersRequestRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response for get volunteers request list
    /// </summary>
    public class GetVolunteersRequestResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public List<VolunteerRequestItem> VolunteersRequest { get; set; } = new List<VolunteerRequestItem>();
    }

    /// <summary>
    /// Request for update volunteer status (approve and assign chapter/class/type)
    /// </summary>
    public class UpdateVolunteerStatusRequest
    {
        [Required]
        public string VolundeerID { get; set; } = string.Empty;
        [Required]
        public string ChapterID { get; set; } = string.Empty;
        [Required]
        public string Class { get; set; } = string.Empty;
        [Required]
        public string Section { get; set; } = string.Empty;
        [Required]
        public string Type { get; set; } = string.Empty; // P, S, C, V
    }

    /// <summary>
    /// Request for delete volunteer request
    /// </summary>
    public class DeleteVolunteerRequestRequest
    {
        [Required]
        public string RequestID { get; set; } = string.Empty;
    }
}
