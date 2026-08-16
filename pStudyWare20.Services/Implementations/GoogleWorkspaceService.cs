using System;
using System.IO;
using System.Threading.Tasks;
using Google.Apis.Admin.Directory.directory_v1;
using Google.Apis.Admin.Directory.directory_v1.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using pStudyWare20.Services.Interfaces;

namespace pStudyWare20.Services.Implementations
{
    public class GoogleWorkspaceService : IGoogleWorkspaceService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<GoogleWorkspaceService> _logger;
        private readonly string[] _scopes = { DirectoryService.Scope.AdminDirectoryGroupMember };

        public GoogleWorkspaceService(IConfiguration configuration, ILogger<GoogleWorkspaceService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private async Task<DirectoryService> GetDirectoryServiceAsync()
        {
            string keyFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "google-service-account.json");
            if (!File.Exists(keyFilePath))
            {
                // Fallback to searching in the content root
                keyFilePath = Path.Combine(Directory.GetCurrentDirectory(), "google-service-account.json");
            }

            if (!File.Exists(keyFilePath))
            {
                throw new FileNotFoundException("Google Service Account JSON key file not found.", keyFilePath);
            }

            GoogleCredential credential;
            using (var stream = new FileStream(keyFilePath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream).CreateScoped(_scopes);
            }

            // If Domain-Wide Delegation is set up and an Admin Email is provided
            string adminEmail = _configuration["GoogleWorkspace:AdminEmail"];
            if (!string.IsNullOrWhiteSpace(adminEmail))
            {
                credential = credential.CreateWithUser(adminEmail);
            }

            var service = new DirectoryService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "pStudyWare20"
            });

            return service;
        }

        public async Task<bool> AddMemberToGroupAsync(string groupEmail, string memberEmail)
        {
            if (string.IsNullOrWhiteSpace(groupEmail) || string.IsNullOrWhiteSpace(memberEmail)) return false;

            bool allSuccess = true;
            string[] groups = groupEmail.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);

            try
            {
                var service = await GetDirectoryServiceAsync();

                foreach (var singleGroup in groups)
                {
                    string trimmedGroup = singleGroup.Trim().ToLowerInvariant();
                    try
                    {
                        var member = new Member
                        {
                            Email = memberEmail,
                            Role = "MEMBER"
                        };

                        var request = service.Members.Insert(member, trimmedGroup);
                        await request.ExecuteAsync();
                        
                        _logger.LogInformation($"Successfully added {memberEmail} to Google Group {trimmedGroup}.");
                    }
                    catch (Google.GoogleApiException ex) when (ex.Error?.Code == 409)
                    {
                        // 409 Conflict means the member is already in the group
                        _logger.LogInformation($"Member {memberEmail} is already in Google Group {trimmedGroup}.");
                    }
                }
                
                return allSuccess;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding member {memberEmail} to Google Group(s) {groupEmail}");
                throw;
            }
        }

        public async Task<bool> RemoveMemberFromGroupAsync(string groupEmail, string memberEmail)
        {
            if (string.IsNullOrWhiteSpace(groupEmail) || string.IsNullOrWhiteSpace(memberEmail)) return false;

            bool allSuccess = true;
            string[] groups = groupEmail.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);

            try
            {
                var service = await GetDirectoryServiceAsync();

                foreach (var singleGroup in groups)
                {
                    string trimmedGroup = singleGroup.Trim().ToLowerInvariant();
                    try
                    {
                        var request = service.Members.Delete(trimmedGroup, memberEmail);
                        await request.ExecuteAsync();

                        _logger.LogInformation($"Successfully removed {memberEmail} from Google Group {trimmedGroup}.");
                    }
                    catch (Google.GoogleApiException ex) when (ex.Error?.Code == 404)
                    {
                        // 404 Not Found means the member is not in the group, which is fine for removal
                        _logger.LogInformation($"Member {memberEmail} was not found in Google Group {trimmedGroup}.");
                    }
                }

                return allSuccess;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing member {memberEmail} from Google Group(s) {groupEmail}");
                throw;
            }
        }
    }
}
