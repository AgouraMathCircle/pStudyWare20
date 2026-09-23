using System;
using System.IO;
using System.Threading.Tasks;
using Google.Apis.Admin.Directory.directory_v1;
using Google.Apis.Admin.Directory.directory_v1.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
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
        private readonly string[] _directoryScopes = { DirectoryService.Scope.AdminDirectoryGroupMember };
        private readonly string[] _gmailScopes = { GmailService.Scope.GmailReadonly, GmailService.Scope.GmailSend };
        private readonly string[] _gmailModifyScopes = { GmailService.Scope.GmailModify, GmailService.Scope.GmailSend };

        public GoogleWorkspaceService(IConfiguration configuration, ILogger<GoogleWorkspaceService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private async Task<DirectoryService> GetDirectoryServiceAsync()
        {
            GoogleCredential credential;

            var gsaSection = _configuration.GetSection("GoogleServiceAccount");
            if (gsaSection.Exists())
            {
                var gsa = new
                {
                    adminemail = gsaSection["admin_email"],
                    type = gsaSection["type"],
                    project_id = gsaSection["project_id"],
                    private_key_id = gsaSection["private_key_id"],
                    private_key = gsaSection["private_key"],
                    client_email = gsaSection["client_email"],
                    client_id = gsaSection["client_id"],
                    auth_uri = gsaSection["auth_uri"],
                    token_uri = gsaSection["token_uri"],
                    auth_provider_x509_cert_url = gsaSection["auth_provider_x509_cert_url"],
                    client_x509_cert_url = gsaSection["client_x509_cert_url"],
                    universe_domain = gsaSection["universe_domain"]
                };
                var json = System.Text.Json.JsonSerializer.Serialize(gsa);
                credential = GoogleCredential.FromJson(json).CreateScoped(_directoryScopes);
            }
            else
            {
                var possiblePaths = new[]
                {
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "google-service-account.json"),
                    Path.Combine(Directory.GetCurrentDirectory(), "google-service-account.json"),
                    Path.Combine(AppContext.BaseDirectory, "google-service-account.json"),
                    Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) ?? "", "google-service-account.json")
                };

                string keyFilePath = null;
                foreach (var path in possiblePaths)
                {
                    if (File.Exists(path))
                    {
                        keyFilePath = path;
                        break;
                    }
                }

                if (keyFilePath == null)
                {
                    throw new FileNotFoundException($"Google Service Account JSON key not found in appsettings and file not found.");
                }

                using (var stream = new FileStream(keyFilePath, FileMode.Open, FileAccess.Read))
                {
                    credential = GoogleCredential.FromStream(stream).CreateScoped(_directoryScopes);
                }
            }

            // If Domain-Wide Delegation is set up and an Admin Email is provided
            string adminEmail = _configuration["GoogleServiceAccount:admin_email"];
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

        public async Task<pStudyWare20.Shared.GetMessagesResponse> GetGmailMessagesAsync(string userEmail, string label = "inbox", string searchQuery = "", int maxResults = 50)
        {
            var response = new pStudyWare20.Shared.GetMessagesResponse();
            try
            {
                GoogleCredential credential;
                var gsaSection = _configuration.GetSection("GoogleServiceAccount");
                if (gsaSection.Exists())
                {
                    var gsa = new
                    {
                        adminemail = gsaSection["admin_email"],
                        type = gsaSection["type"],
                        project_id = gsaSection["project_id"],
                        private_key_id = gsaSection["private_key_id"],
                        private_key = gsaSection["private_key"],
                        client_email = gsaSection["client_email"],
                        client_id = gsaSection["client_id"],
                        auth_uri = gsaSection["auth_uri"],
                        token_uri = gsaSection["token_uri"],
                        auth_provider_x509_cert_url = gsaSection["auth_provider_x509_cert_url"],
                        client_x509_cert_url = gsaSection["client_x509_cert_url"],
                        universe_domain = gsaSection["universe_domain"]
                    };
                    var json = System.Text.Json.JsonSerializer.Serialize(gsa);
                    credential = GoogleCredential.FromJson(json).CreateScoped(_gmailScopes);
                }
                else
                {
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "google-service-account.json");
                    if (!File.Exists(path))
                        path = Path.Combine(Directory.GetCurrentDirectory(), "google-service-account.json");

                    using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read))
                    {
                        credential = GoogleCredential.FromStream(stream).CreateScoped(_gmailScopes);
                    }
                }

                // DWD: Impersonate the user
                credential = credential.CreateWithUser(userEmail);

                var service = new GmailService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "pStudyWare20"
                });

                var request = service.Users.Messages.List("me");
                request.MaxResults = maxResults;
                
                string labelQuery = "in:inbox";
                if (!string.IsNullOrEmpty(label))
                {
                    if (string.Equals(label, "sent", StringComparison.OrdinalIgnoreCase))
                        labelQuery = "in:sent";
                    else if (string.Equals(label, "draft", StringComparison.OrdinalIgnoreCase))
                        labelQuery = "in:draft";
                    else if (string.Equals(label, "trash", StringComparison.OrdinalIgnoreCase))
                        labelQuery = "in:trash";
                    else if (string.Equals(label, "spam", StringComparison.OrdinalIgnoreCase))
                        labelQuery = "in:spam";
                    else if (string.Equals(label, "starred", StringComparison.OrdinalIgnoreCase))
                        labelQuery = "is:starred";
                }

                if (!string.IsNullOrEmpty(searchQuery))
                {
                    labelQuery += " " + searchQuery;
                }

                request.Q = labelQuery.Trim();

                var messagesResponse = await request.ExecuteAsync();

                var messagesList = new System.Collections.Generic.List<pStudyWare20.Shared.MessageInfo>();

                if (messagesResponse.Messages != null)
                {
                    var fetchTasks = new System.Collections.Generic.List<Task<pStudyWare20.Shared.MessageInfo>>();
                    int idCounter = 1;

                    foreach (var msg in messagesResponse.Messages)
                    {
                        var currentIdCounter = idCounter; // Capture for lambda
                        fetchTasks.Add(Task.Run(async () =>
                        {
                            try
                            {
                                var msgRequest = service.Users.Messages.Get("me", msg.Id);
                                msgRequest.Format = Google.Apis.Gmail.v1.UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
                                var msgDetails = await msgRequest.ExecuteAsync();

                                string from = "";
                                string subject = "";
                                string date = "";

                                if (msgDetails.Payload?.Headers != null)
                                {
                                    foreach (var header in msgDetails.Payload.Headers)
                                    {
                                        if (header.Name == "From") from = header.Value;
                                        else if (header.Name == "Subject") subject = header.Value;
                                        else if (header.Name == "Date") date = header.Value;
                                    }
                                }

                                DateTime parsedDate = DateTime.MinValue;
                                DateTime.TryParse(date, out parsedDate);
                                
                                string bodyText = GetMessageBody(msgDetails.Payload);
                                if (string.IsNullOrEmpty(bodyText))
                                {
                                    bodyText = msgDetails.Snippet ?? "";
                                }

                                return new pStudyWare20.Shared.MessageInfo
                                {
                                    MessageID = currentIdCounter,
                                    TrackingID = currentIdCounter,
                                    GmailId = msg.Id,
                                    SenderName = from,
                                    Subject = subject,
                                    Message = bodyText,
                                    SendDate = parsedDate,
                                    Status = msgDetails.LabelIds != null && msgDetails.LabelIds.Contains("UNREAD") ? "U" : "V",
                                    IsStarred = msgDetails.LabelIds != null && msgDetails.LabelIds.Contains("STARRED")
                                };
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, $"Failed to fetch details for message {msg.Id}");
                                return null;
                            }
                        }));
                        
                        idCounter++;
                    }

                    var results = await Task.WhenAll(fetchTasks);
                    foreach(var res in results)
                    {
                        if(res != null) messagesList.Add(res);
                    }
                }

                response.IsSuccess = true;
                response.Messages = messagesList;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching Gmail messages for user {userEmail}");
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        private string GetMessageBody(Google.Apis.Gmail.v1.Data.MessagePart payload)
        {
            if (payload == null) return "";
            
            // If it's a simple part
            if (payload.Body != null && !string.IsNullOrEmpty(payload.Body.Data))
            {
                return DecodeBase64Url(payload.Body.Data);
            }
            
            // If it's multipart
            if (payload.Parts != null)
            {
                // Try to find HTML part
                var htmlPart = payload.Parts.FirstOrDefault(p => p.MimeType == "text/html");
                if (htmlPart != null) return GetMessageBody(htmlPart);
                
                // Otherwise text part
                var textPart = payload.Parts.FirstOrDefault(p => p.MimeType == "text/plain");
                if (textPart != null) return GetMessageBody(textPart);
                
                // Fallback
                if (payload.Parts.Count > 0) return GetMessageBody(payload.Parts[0]);
            }
            
            return "";
        }

        private string DecodeBase64Url(string base64Url)
        {
            if (string.IsNullOrEmpty(base64Url)) return "";
            string base64 = base64Url.Replace('-', '+').Replace('_', '/');
            switch (base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
            }
            var bytes = Convert.FromBase64String(base64);
            return System.Text.Encoding.UTF8.GetString(bytes);
        }

        public async Task<pStudyWare20.Shared.GetMessageResponse> GetGmailMessageAsync(string userEmail, string gmailId)
        {
            var response = new pStudyWare20.Shared.GetMessageResponse();
            try
            {
                GoogleCredential credential;
                var gsaSection = _configuration.GetSection("GoogleServiceAccount");
                if (gsaSection.Exists())
                {
                    var gsa = new
                    {
                        adminemail = gsaSection["admin_email"],
                        type = gsaSection["type"],
                        project_id = gsaSection["project_id"],
                        private_key_id = gsaSection["private_key_id"],
                        private_key = gsaSection["private_key"],
                        client_email = gsaSection["client_email"],
                        client_id = gsaSection["client_id"],
                        auth_uri = gsaSection["auth_uri"],
                        token_uri = gsaSection["token_uri"],
                        auth_provider_x509_cert_url = gsaSection["auth_provider_x509_cert_url"],
                        client_x509_cert_url = gsaSection["client_x509_cert_url"],
                        universe_domain = gsaSection["universe_domain"]
                    };
                    var json = System.Text.Json.JsonSerializer.Serialize(gsa);
                    credential = GoogleCredential.FromJson(json).CreateScoped(_gmailScopes);
                }
                else
                {
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "google-service-account.json");
                    if (!File.Exists(path))
                        path = Path.Combine(Directory.GetCurrentDirectory(), "google-service-account.json");

                    using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read))
                    {
                        credential = GoogleCredential.FromStream(stream).CreateScoped(_gmailScopes);
                    }
                }

                credential = credential.CreateWithUser(userEmail);
                var service = new Google.Apis.Gmail.v1.GmailService(new Google.Apis.Services.BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "AMC pStudyWare Gmail Integration"
                });

                var msgRequest = service.Users.Messages.Get("me", gmailId);
                msgRequest.Format = Google.Apis.Gmail.v1.UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
                var msgDetails = await msgRequest.ExecuteAsync();

                // Try to remove UNREAD label if present to mark as read
                if (msgDetails.LabelIds != null && msgDetails.LabelIds.Contains("UNREAD"))
                {
                    try
                    {
                        var mods = new Google.Apis.Gmail.v1.Data.ModifyMessageRequest
                        {
                            RemoveLabelIds = new List<string> { "UNREAD" }
                        };
                        await service.Users.Messages.Modify(mods, "me", gmailId).ExecuteAsync();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to remove UNREAD label from message {MessageId}. Ensure GmailModify scope is granted in DWD if this is desired.", gmailId);
                    }
                }

                string from = "";
                string subject = "";
                string date = "";

                if (msgDetails.Payload?.Headers != null)
                {
                    foreach (var header in msgDetails.Payload.Headers)
                    {
                        if (header.Name == "From") from = header.Value;
                        else if (header.Name == "Subject") subject = header.Value;
                        else if (header.Name == "Date") date = header.Value;
                    }
                }

                DateTime parsedDate = DateTime.MinValue;
                DateTime.TryParse(date, out parsedDate);

                string bodyText = GetMessageBody(msgDetails.Payload);
                if (string.IsNullOrEmpty(bodyText))
                {
                    bodyText = msgDetails.Snippet ?? "";
                }

                response.IsSuccess = true;
                response.Message = new pStudyWare20.Shared.MessageInfo
                {
                    MessageID = 0,
                    TrackingID = 0,
                    GmailId = msgDetails.Id,
                    SenderName = from,
                    Subject = subject,
                    Message = bodyText,
                    SendDate = parsedDate,
                    Status = "V",
                    IsStarred = msgDetails.LabelIds != null && msgDetails.LabelIds.Contains("STARRED")
                };
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<pStudyWare20.Shared.SendMessageResponse> SendGmailMessageAsync(pStudyWare20.Shared.SendGmailMessageRequest request)
        {
            var response = new pStudyWare20.Shared.SendMessageResponse();
            try
            {
                GoogleCredential credential;
                var gsaSection = _configuration.GetSection("GoogleServiceAccount");
                if (gsaSection.Exists())
                {
                    var gsa = new
                    {
                        adminemail = gsaSection["admin_email"],
                        type = gsaSection["type"],
                        project_id = gsaSection["project_id"],
                        private_key_id = gsaSection["private_key_id"],
                        private_key = gsaSection["private_key"],
                        client_email = gsaSection["client_email"],
                        client_id = gsaSection["client_id"],
                        auth_uri = gsaSection["auth_uri"],
                        token_uri = gsaSection["token_uri"],
                        auth_provider_x509_cert_url = gsaSection["auth_provider_x509_cert_url"],
                        client_x509_cert_url = gsaSection["client_x509_cert_url"],
                        universe_domain = gsaSection["universe_domain"]
                    };
                    var json = System.Text.Json.JsonSerializer.Serialize(gsa);
                    credential = GoogleCredential.FromJson(json).CreateScoped(_gmailScopes);
                }
                else
                {
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "google-service-account.json");
                    if (!File.Exists(path))
                        path = Path.Combine(Directory.GetCurrentDirectory(), "google-service-account.json");

                    using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read))
                    {
                        credential = GoogleCredential.FromStream(stream).CreateScoped(_gmailScopes);
                    }
                }

                credential = credential.CreateWithUser(request.Username);
                var service = new Google.Apis.Gmail.v1.GmailService(new Google.Apis.Services.BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "AMC pStudyWare Gmail Integration"
                });

                string rawMessage = 
                    $"To: {request.To}\r\n" +
                    (!string.IsNullOrEmpty(request.Cc) ? $"Cc: {request.Cc}\r\n" : "") +
                    (!string.IsNullOrEmpty(request.Bcc) ? $"Bcc: {request.Bcc}\r\n" : "") +
                    $"From: \"{request.FromName}\" <{request.Username}>\r\n" +
                    $"Subject: {request.Subject}\r\n" +
                    "Content-Type: text/html; charset=utf-8\r\n\r\n" +
                    request.Body;

                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(rawMessage);
                string base64Url = Convert.ToBase64String(bytes).Replace('+', '-').Replace('/', '_').Replace("=", "");

                var msg = new Google.Apis.Gmail.v1.Data.Message { Raw = base64Url };
                await service.Users.Messages.Send(msg, "me").ExecuteAsync();

                response.IsSuccess = true;
                response.Message = "Email sent successfully via Gmail API.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send Gmail message for user {request.Username}");
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }
            return response;
        }

        public async Task<bool> ToggleMessageStarAsync(string userEmail, string gmailId, bool isStarred)
        {
            try
            {
                GoogleCredential credential;
                var gsaSection = _configuration.GetSection("GoogleServiceAccount");
                if (gsaSection.Exists())
                {
                    var gsa = new
                    {
                        adminemail = gsaSection["admin_email"],
                        type = gsaSection["type"],
                        project_id = gsaSection["project_id"],
                        private_key_id = gsaSection["private_key_id"],
                        private_key = gsaSection["private_key"],
                        client_email = gsaSection["client_email"],
                        client_id = gsaSection["client_id"],
                        auth_uri = gsaSection["auth_uri"],
                        token_uri = gsaSection["token_uri"],
                        auth_provider_x509_cert_url = gsaSection["auth_provider_x509_cert_url"],
                        client_x509_cert_url = gsaSection["client_x509_cert_url"],
                        universe_domain = gsaSection["universe_domain"]
                    };
                    var json = System.Text.Json.JsonSerializer.Serialize(gsa);
                    credential = GoogleCredential.FromJson(json).CreateScoped(_gmailModifyScopes);
                }
                else
                {
                    var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "google-service-account.json");
                    if (!File.Exists(path))
                        path = Path.Combine(Directory.GetCurrentDirectory(), "google-service-account.json");

                    using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read))
                    {
                        credential = GoogleCredential.FromStream(stream).CreateScoped(_gmailModifyScopes);
                    }
                }

                credential = credential.CreateWithUser(userEmail);
                var service = new Google.Apis.Gmail.v1.GmailService(new Google.Apis.Services.BaseClientService.Initializer
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "AMC pStudyWare Gmail Integration"
                });

                var mods = new Google.Apis.Gmail.v1.Data.ModifyMessageRequest();
                if (isStarred)
                {
                    mods.AddLabelIds = new System.Collections.Generic.List<string> { "STARRED" };
                }
                else
                {
                    mods.RemoveLabelIds = new System.Collections.Generic.List<string> { "STARRED" };
                }

                await service.Users.Messages.Modify(mods, "me", gmailId).ExecuteAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error toggling star on Gmail message {gmailId} for user {userEmail}");
                return false;
            }
        }
    }
}
