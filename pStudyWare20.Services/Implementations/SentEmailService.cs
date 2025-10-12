using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of sent email business logic operations (matches legacy controller)
    /// </summary>
    public class SentEmailService : ISentEmailService
    {
        private readonly ISentEmailRepository _sentEmailRepository;
        private readonly IConfiguration _configuration;

        public SentEmailService(ISentEmailRepository sentEmailRepository, IConfiguration configuration)
        {
            _sentEmailRepository = sentEmailRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Get sent messages (matches legacy controller exactly)
        /// </summary>
        public SentMessagesListResponse GetSentMessages(GetSentMessagesRequest request)
        {
            SentMessagesListResponse response = new SentMessagesListResponse();
            try
            {
                var result = _sentEmailRepository.GetSentMessagesAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            var emailInfo = $"{row["EmailID"]}~#{row["SendTo"]}~#{row["Subject"]}~#{row["Name"]}~#{row["SendBy"]}";

                            response.SentMessages.Add(new SentEmailMessage
                            {
                                MessageID = Convert.ToInt32(row["MessageID"]),
                                EmailID = row["EmailID"]?.ToString() ?? string.Empty,
                                SendFrom = row["SendFrom"]?.ToString() ?? string.Empty,
                                SendTo = row["SendTo"]?.ToString() ?? string.Empty,
                                Subject = row["Subject"]?.ToString() ?? string.Empty,
                                Message = row["Message"]?.ToString() ?? string.Empty,
                                SendDate = Convert.ToDateTime(row["SendDate"]),
                                Name = row["Name"]?.ToString() ?? string.Empty,
                                SendBy = row["SendBy"]?.ToString() ?? string.Empty,
                                EmailInfo = emailInfo
                            });
                        }
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Get message (matches legacy controller exactly)
        /// </summary>
        public MessageDetailResponse GetMessage(GetMessageRequest request)
        {
            MessageDetailResponse response = new MessageDetailResponse();
            try
            {
                var result = _sentEmailRepository.GetMessageAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        response.Message = dataTable.Rows[0]["Message"]?.ToString() ?? string.Empty;
                    }
                }

                response.IsSuccess = true;
                response.ErrorMessage = "";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// View email (combines sent messages and message details - matches legacy controller)
        /// </summary>
        public ViewEmailResponse ViewEmail(ViewEmailRequest request)
        {
            ViewEmailResponse response = new ViewEmailResponse();
            try
            {
                // First get the message details
                var messageRequest = new GetMessageRequest { EmailId = request.EmailID };
                var messageResponse = GetMessage(messageRequest);

                if (messageResponse.IsSuccess)
                {
                    response.EmailMessage = new SentEmailMessage
                    {
                        EmailID = request.EmailID,
                        SendTo = request.SendTo,
                        Subject = request.Subject,
                        Name = request.Name,
                        SendBy = request.SendBy,
                        Message = messageResponse.Message
                    };
                }

                response.IsSuccess = messageResponse.IsSuccess;
                response.ErrorMessage = messageResponse.ErrorMessage;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }
    }
}
