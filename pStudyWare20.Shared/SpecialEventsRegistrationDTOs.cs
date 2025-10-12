using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for special events registration list request
    /// </summary>
    public class SpecialEventsRegistrationListRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for special events registration list response
    /// </summary>
    public class SpecialEventsRegistrationListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Special Events Registration List")]
        public object SpecialEventsRegistrationList { get; set; } = new object();
    }

    /// <summary>
    /// Model for deleting special events registration request
    /// </summary>
    public class DeleteSpecialEventsRegistrationRequest
    {
        [Display(Name = "Request ID")]
        public string RequestId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for deleting special events registration response
    /// </summary>
    public class DeleteSpecialEventsRegistrationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for export Excel request
    /// </summary>
    public class ExportSpecialEventsRegistrationExcelRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for export Excel response
    /// </summary>
    public class ExportSpecialEventsRegistrationExcelResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "File Name")]
        public string FileName { get; set; } = string.Empty;

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "Content Type")]
        public string ContentType { get; set; } = "application/octet-stream";

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for special events registration dashboard data request
    /// </summary>
    public class SpecialEventsRegistrationDashboardRequest
    {
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for special events registration dashboard data response
    /// </summary>
    public class SpecialEventsRegistrationDashboardResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Special Events Registration List")]
        public object SpecialEventsRegistrationList { get; set; } = new object();
    }

    /// <summary>
    /// Model for special events registration privileges check response
    /// </summary>
    public class SpecialEventsRegistrationPrivilegesResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Role")]
        public string Role { get; set; } = string.Empty;

        [Display(Name = "Member Type")]
        public string MemberType { get; set; } = string.Empty;

        [Display(Name = "Can Delete Applications")]
        public bool CanDeleteApplications { get; set; }

        [Display(Name = "Can Export Data")]
        public bool CanExportData { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for special events registration action request (handles different actions like Delete)
    /// </summary>
    public class SpecialEventsRegistrationActionRequest
    {
        [Display(Name = "Action")]
        public string Action { get; set; } = string.Empty; // D = Delete

        [Display(Name = "Request ID")]
        public string RequestId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for special events registration action response
    /// </summary>
    public class SpecialEventsRegistrationActionResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Action Data")]
        public object ActionData { get; set; } = new object();

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }
}
