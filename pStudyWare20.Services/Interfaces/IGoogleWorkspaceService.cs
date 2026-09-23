using System.Threading.Tasks;

namespace pStudyWare20.Services.Interfaces
{
    public interface IGoogleWorkspaceService
    {
        Task<bool> AddMemberToGroupAsync(string groupEmail, string memberEmail);
        Task<bool> RemoveMemberFromGroupAsync(string groupEmail, string memberEmail);
        Task<pStudyWare20.Shared.GetMessagesResponse> GetGmailMessagesAsync(string userEmail, string label = "inbox", string searchQuery = "", int maxResults = 20);
        Task<pStudyWare20.Shared.GetMessageResponse> GetGmailMessageAsync(string userEmail, string gmailId);
        Task<pStudyWare20.Shared.SendMessageResponse> SendGmailMessageAsync(pStudyWare20.Shared.SendGmailMessageRequest request);
        Task<bool> ToggleMessageStarAsync(string userEmail, string gmailId, bool isStarred);
    }
}
