using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using System.IO;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for Email Manager business logic
    /// </summary>
    public class EmailManagerService : IEmailManagerService
    {
        private readonly IEmailManagerRepository _emailManagerRepository;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public EmailManagerService(
            IEmailManagerRepository emailManagerRepository,
            IServiceScopeFactory serviceScopeFactory)
        {
            _emailManagerRepository = emailManagerRepository;
            _serviceScopeFactory = serviceScopeFactory;
        }

        /// <summary>
        /// Get messages for a user (inbox)
        /// </summary>
        public async Task<GetMessagesResponse> GetMessagesAsync(GetMessagesRequest request)
        {
            try
            {
                var messagesData = await _emailManagerRepository.GetMessagesAsync(request.Username);
                var messages = new List<MessageInfo>();

                // Convert DataTable to List<MessageInfo>
                if (messagesData != null && messagesData.Rows.Count > 0)
                {
                    foreach (DataRow row in messagesData.Rows)
                    {
                        var emailInfo = GetStringValue(row, "Emailinfo");
                        messages.Add(new MessageInfo
                        {
                            MessageID = GetIntValue(row, "MessageID"),
                            TrackingID = GetIntValue(row, "TrackingID") != 0
                                ? GetIntValue(row, "TrackingID")
                                : GetIntValue(row, "EmailID"),
                            SendFrom = GetStringValue(row, "SendFrom"),
                            SendTo = GetStringValue(row, "SendTo"),
                            SendBy = GetStringValue(row, "SendBy"),
                            Subject = GetStringValue(row, "Subject"),
                            Message = GetStringValue(row, "Message"),
                            SendDate = GetDateTimeValue(row, "SendDate"),
                            Status = GetStringValue(row, "Status"),
                            SenderName = GetSenderNameFromRow(row, emailInfo),
                            SenderUsername = ParseSenderUsernameFromEmailInfo(emailInfo),
                        });
                    }
                }

                if (messages.Count > 0)
                {
                    var trackingIds = messages
                        .Select(m => m.TrackingID)
                        .Where(id => id > 0)
                        .ToList();
                    var archivedIds = await _emailManagerRepository.GetArchivedTrackingIdsAsync(trackingIds);
                    if (archivedIds.Count > 0)
                    {
                        messages = messages
                            .Where(m => !archivedIds.Contains(m.TrackingID))
                            .ToList();
                    }
                }

                return new GetMessagesResponse
                {
                    IsSuccess = true,
                    Messages = messages
                };
            }
            catch (Exception ex)
            {
                return new GetMessagesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get a specific message by ID
        /// </summary>
        public async Task<GetMessageResponse> GetMessageAsync(GetMessageRequest request)
        {
            try
            {
                var messageData = await _emailManagerRepository.GetMessageByIdAsync(request.EmailID);
                MessageInfo? message = null;

                if (messageData != null && messageData.Tables.Count > 0 && messageData.Tables[0].Rows.Count > 0)
                {
                    var row = messageData.Tables[0].Rows[0];
                    // AMC_spGetMessageCenter_Message only returns the Message column.
                    message = new MessageInfo
                    {
                        MessageID = request.EmailID,
                        TrackingID = request.EmailID,
                        Message = GetStringValue(row, "Message"),
                    };
                }

                return new GetMessageResponse
                {
                    IsSuccess = message != null,
                    Message = message,
                    ErrorMessage = message == null ? "Message not found" : string.Empty,
                };
            }
            catch (Exception ex)
            {
                return new GetMessageResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Send a new message or reply to a message
        /// </summary>
        public async Task<SendMessageResponse> SendMessageAsync(SendMessageRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.SendTo))
                {
                    return new SendMessageResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Recipient is required"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Subject))
                {
                    return new SendMessageResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Subject is required"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Message))
                {
                    return new SendMessageResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Message is required"
                    };
                }

                int emailId = request.ReplyToEmailID ?? 0;
                string mode = request.Mode ?? "N";

                // Save to message center first; email notification runs in the background.
                await _emailManagerRepository.SendMessageAsync(
                    request.SendTo,
                    request.SendFrom,
                    request.Subject,
                    request.Message,
                    request.SendBy,
                    emailId,
                    mode,
                    request.ChapterID
                );

                QueueMessageCenterEmailNotification(request, mode);

                return new SendMessageResponse
                {
                    IsSuccess = true,
                    Message = "Your message has been sent successfully"
                };
            }
            catch (Exception ex)
            {
                return new SendMessageResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private void QueueMessageCenterEmailNotification(SendMessageRequest request, string mode)
        {
            var notificationRequest = new SendMessageRequest
            {
                SendTo = request.SendTo,
                SendFrom = request.SendFrom,
                Subject = request.Subject,
                Message = request.Message,
                SendBy = request.SendBy,
                Mode = mode,
                MemberType = request.MemberType,
                FromName = request.FromName,
            };

            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var emailUtility = scope.ServiceProvider.GetRequiredService<IEmailUtility>();
                    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                    await SendMessageCenterEmailNotificationAsync(
                        emailUtility,
                        configuration,
                        notificationRequest,
                        mode);
                }
                catch
                {
                    // Message is already saved; SMTP failures must not block the user.
                }
            });
        }

        private static async Task SendMessageCenterEmailNotificationAsync(
            IEmailUtility emailUtility,
            IConfiguration configuration,
            SendMessageRequest request,
            string mode)
        {
            string emailSubject = "Agoura Math Circle - " + request.Subject;
            string emailBody = request.Message +
                " <br/> <br/>Regards <br/> " + request.FromName +
                "<br/> Agoura Math Circle<br/>www.agouramathcircle.org";

            if (request.MemberType == "S")
            {
                await emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, emailSubject, emailBody);
            }
            else if (request.MemberType == "I")
            {
                if (mode == "R")
                {
                    await emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, request.Subject, emailBody);
                }
                else if (request.SendTo.Contains("ALL", StringComparison.OrdinalIgnoreCase))
                {
                    var adminEmail = configuration["AdminEmailID"] ?? "";
                    await emailUtility.SendEmailGroupAsync(adminEmail, request.SendFrom, emailSubject, emailBody, request.SendTo);
                }
                else
                {
                    await emailUtility.SendEmailAsync(request.SendTo, request.SendFrom,
                        request.Subject + " - Message To [" + request.FromName + "]", emailBody);
                }
            }
            else if (request.MemberType == "A")
            {
                if (mode == "R")
                {
                    await emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, request.Subject, emailBody);
                }
                else
                {
                    var adminEmail = configuration["AdminEmailID"] ?? "";
                    await emailUtility.SendEmailGroupAsync(adminEmail, request.SendFrom, emailSubject, emailBody, request.SendTo);
                }
            }
            else if (request.MemberType == "V")
            {
                if (mode == "R")
                {
                    await emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, request.Subject, emailBody);
                }
                else if (request.SendTo.Contains("ALL", StringComparison.OrdinalIgnoreCase))
                {
                    var adminEmail = configuration["AdminEmailID"] ?? "";
                    await emailUtility.SendEmailGroupAsync(adminEmail, request.SendFrom, emailSubject, emailBody, request.SendTo);
                }
                else
                {
                    await emailUtility.SendEmailAsync(request.SendTo, request.SendFrom,
                        request.Subject + " - Message To [" + request.FromName + "]", emailBody);
                }
            }
        }

        /// <summary>
        /// Update message status (mark as viewed, delete, etc.)
        /// </summary>
        public async Task<UpdateMessageStatusResponse> UpdateMessageStatusAsync(UpdateMessageStatusRequest request)
        {
            try
            {
                if (string.Equals(request.Mode, "T", StringComparison.OrdinalIgnoreCase) &&
                    request.TrackingID <= 0)
                {
                    return new UpdateMessageStatusResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "A valid tracking ID is required to delete a message."
                    };
                }

                await _emailManagerRepository.UpdateMessageStatusAsync(
                    request.Mode,
                    request.TrackingID.ToString(),
                    request.SendTo
                );

                string message = request.Mode == "T" ? "Message deleted successfully" : "Message marked as viewed";

                return new UpdateMessageStatusResponse
                {
                    IsSuccess = true,
                    Message = message
                };
            }
            catch (Exception ex)
            {
                return new UpdateMessageStatusResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get instructor email groups
        /// </summary>
        public async Task<GetInstructorEmailGroupsResponse> GetInstructorEmailGroupsAsync(GetInstructorEmailGroupsRequest request)
        {
            try
            {
                var groupsData = await _emailManagerRepository.GetInstructorEmailGroupsAsync(request.Username);
                var groups = new List<EmailGroup>();

                if (groupsData != null && groupsData.Tables.Count > 0 && groupsData.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in groupsData.Tables[0].Rows)
                    {
                        groups.Add(new EmailGroup
                        {
                            Value = row["InstructorEmailGroup"]?.ToString() ?? "",
                            Text = row["Class"]?.ToString() ?? ""
                        });
                    }
                }

                return new GetInstructorEmailGroupsResponse
                {
                    IsSuccess = true,
                    EmailGroups = groups
                };
            }
            catch (Exception ex)
            {
                return new GetInstructorEmailGroupsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get student list for email
        /// </summary>
        public async Task<GetStudentListForEmailResponse> GetStudentListForEmailAsync(GetStudentListForEmailRequest request)
        {
            try
            {
                var studentsData = await _emailManagerRepository.GetStudentListForEmailAsync(request.Username, request.MemberType);
                var students = new List<StudentEmailInfo>();

                if (studentsData != null && studentsData.Tables.Count > 0 && studentsData.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in studentsData.Tables[0].Rows)
                    {
                        students.Add(new StudentEmailInfo
                        {
                            Value = row["StudentID"]?.ToString() ?? "",
                            Text = row["StudentName"]?.ToString() ?? ""
                        });
                    }
                }

                return new GetStudentListForEmailResponse
                {
                    IsSuccess = true,
                    Students = students
                };
            }
            catch (Exception ex)
            {
                return new GetStudentListForEmailResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Export messages to Excel
        /// </summary>
        public async Task<ExportMessagesResponse> ExportMessagesToExcelAsync(ExportMessagesRequest request)
        {
            try
            {
                var messagesData = await _emailManagerRepository.GetMessagesAsync(request.Username);

                if (messagesData == null || messagesData.Rows.Count == 0)
                {
                    return new ExportMessagesResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "No messages to export"
                    };
                }

                return new ExportMessagesResponse
                {
                    IsSuccess = true,
                    FileName = "MessageCenter.xlsx",
                    FileContent = DataTableExcelExporter.ToXlsxBytes(messagesData, "Messages"),
                    ContentType = DataTableExcelExporter.XlsxContentType
                };
            }
            catch (Exception ex)
            {
                return new ExportMessagesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Helper method to safely get integer value from DataRow
        /// </summary>
        private int GetIntValue(DataRow row, string columnName)
        {
            if (!row.Table.Columns.Contains(columnName) || row[columnName] == DBNull.Value)
                return 0;

            if (int.TryParse(row[columnName]?.ToString(), out int result))
                return result;

            return 0;
        }

        private static string GetStringValue(DataRow row, string columnName)
        {
            if (!row.Table.Columns.Contains(columnName) || row[columnName] == DBNull.Value)
                return string.Empty;

            return row[columnName]?.ToString() ?? string.Empty;
        }

        private static DateTime GetDateTimeValue(DataRow row, string columnName)
        {
            if (!row.Table.Columns.Contains(columnName) || row[columnName] == DBNull.Value)
                return DateTime.MinValue;

            if (DateTime.TryParse(row[columnName]?.ToString(), out DateTime value))
                return value;

            return DateTime.MinValue;
        }

        private static string GetSenderNameFromRow(DataRow row, string emailInfo)
        {
            var senderName = GetStringValue(row, "SenderName");
            if (!string.IsNullOrWhiteSpace(senderName))
            {
                return senderName;
            }

            return ParseSenderNameFromEmailInfo(emailInfo);
        }

        /// <summary>
        /// Legacy Emailinfo: ID~#SendFrom~#Subject~#Name~#SendBy
        /// </summary>
        private static string ParseSenderUsernameFromEmailInfo(string emailInfo)
        {
            if (string.IsNullOrWhiteSpace(emailInfo))
            {
                return string.Empty;
            }

            var parts = emailInfo.Split("~#");
            return parts.Length > 1 ? parts[1].Trim() : string.Empty;
        }

        private static string ParseSenderNameFromEmailInfo(string emailInfo)
        {
            if (string.IsNullOrWhiteSpace(emailInfo))
            {
                return string.Empty;
            }

            var parts = emailInfo.Split("~#");
            return parts.Length > 3 ? parts[3].Trim() : string.Empty;
        }
    }
}

