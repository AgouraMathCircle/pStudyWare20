using Microsoft.Extensions.Configuration;
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
        private readonly IEmailUtility _emailUtility;
        private readonly IConfiguration _configuration;

        public EmailManagerService(IEmailManagerRepository emailManagerRepository, IEmailUtility emailUtility, IConfiguration configuration)
        {
            _emailManagerRepository = emailManagerRepository;
            _emailUtility = emailUtility;
            _configuration = configuration;
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
                        messages.Add(new MessageInfo
                        {
                            MessageID = GetIntValue(row, "MessageID"),
                            TrackingID = GetIntValue(row, "TrackingID"),
                            SendFrom = row["SendFrom"]?.ToString() ?? "",
                            SendTo = row["SendTo"]?.ToString() ?? "",
                            SendBy = row["SendBy"]?.ToString() ?? "",
                            Subject = row["Subject"]?.ToString() ?? "",
                            Message = row["Message"]?.ToString() ?? "",
                            SendDate = row["SendDate"] != DBNull.Value ? Convert.ToDateTime(row["SendDate"]) : DateTime.MinValue,
                            Status = row["Status"]?.ToString() ?? "",
                            SenderName = row.Table.Columns.Contains("SenderName") ? row["SenderName"]?.ToString() ?? "" : ""
                        });
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
                    message = new MessageInfo
                    {
                        MessageID = GetIntValue(row, "MessageID"),
                        TrackingID = GetIntValue(row, "TrackingID"),
                        SendFrom = row["SendFrom"]?.ToString() ?? "",
                        SendTo = row["SendTo"]?.ToString() ?? "",
                        SendBy = row["SendBy"]?.ToString() ?? "",
                        Subject = row["Subject"]?.ToString() ?? "",
                        Message = row["Message"]?.ToString() ?? "",
                        SendDate = row["SendDate"] != DBNull.Value ? Convert.ToDateTime(row["SendDate"]) : DateTime.MinValue,
                        Status = row["Status"]?.ToString() ?? "",
                        SenderName = row.Table.Columns.Contains("SenderName") ? row["SenderName"]?.ToString() ?? "" : ""
                    };
                }

                return new GetMessageResponse
                {
                    IsSuccess = true,
                    Message = message
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
                int emailId = request.ReplyToEmailID ?? 0;
                string mode = request.Mode ?? "N";

                // Send message to database
                var result = await _emailManagerRepository.SendMessageAsync(
                    request.SendTo,
                    request.SendFrom,
                    request.Subject,
                    request.Message,
                    request.SendBy,
                    emailId,
                    mode,
                    request.ChapterID
                );

                // Send email notification
                string emailSubject = "Agoura Math Circle - " + request.Subject;
                string emailBody = request.Message +
                    " <br/> <br/>Regards <br/> " + request.FromName +
                    "<br/> Agoura Math Circle<br/>www.agouramathcircle.org";

                // Determine which email method to use based on member type and mode
                if (request.MemberType == "S") // Student
                {
                    await _emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, emailSubject, emailBody);
                }
                else if (request.MemberType == "I") // Instructor
                {
                    if (mode == "R") // Reply
                    {
                        await _emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, request.Subject, emailBody);
                    }
                    else if (request.SendTo.Contains("ALL", StringComparison.OrdinalIgnoreCase))
                    {
                        var adminEmail = _configuration["AdminEmailID"] ?? "";
                        await _emailUtility.SendEmailGroupAsync(adminEmail, request.SendFrom, emailSubject, emailBody, request.SendTo);
                    }
                    else
                    {
                        await _emailUtility.SendEmailAsync(request.SendTo, request.SendFrom,
                            request.Subject + " - Message To [" + request.FromName + "]", emailBody);
                    }
                }
                else if (request.MemberType == "A") // Admin
                {
                    if (mode == "R") // Reply
                    {
                        await _emailUtility.SendEmailAsync(request.SendTo, request.SendFrom, request.Subject, emailBody);
                    }
                    else
                    {
                        var adminEmail = _configuration["AdminEmailID"] ?? "";
                        await _emailUtility.SendEmailGroupAsync(adminEmail, request.SendFrom, emailSubject, emailBody, request.SendTo);
                    }
                }

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

        /// <summary>
        /// Update message status (mark as viewed, delete, etc.)
        /// </summary>
        public async Task<UpdateMessageStatusResponse> UpdateMessageStatusAsync(UpdateMessageStatusRequest request)
        {
            try
            {
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
            if (row[columnName] == DBNull.Value)
                return 0;

            if (int.TryParse(row[columnName]?.ToString(), out int result))
                return result;

            return 0;
        }
    }
}

