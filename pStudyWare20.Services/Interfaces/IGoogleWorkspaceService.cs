using System.Threading.Tasks;

namespace pStudyWare20.Services.Interfaces
{
    public interface IGoogleWorkspaceService
    {
        Task<bool> AddMemberToGroupAsync(string groupEmail, string memberEmail);
        Task<bool> RemoveMemberFromGroupAsync(string groupEmail, string memberEmail);
    }
}
