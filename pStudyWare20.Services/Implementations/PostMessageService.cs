using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.Json;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of post message business logic operations (matches legacy controller)
    /// </summary>
    public class PostMessageService : IPostMessageService
    {
        private readonly IPostMessageRepository _postMessageRepository;
        private readonly IConfiguration _configuration;

        public PostMessageService(IPostMessageRepository postMessageRepository, IConfiguration configuration)
        {
            _postMessageRepository = postMessageRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Get alert list (matches legacy controller exactly)
        /// </summary>
        public PostMessageListResponse GetAlertList(GetAlertListRequest request)
        {
            PostMessageListResponse response = new PostMessageListResponse();
            try
            {
                var result = _postMessageRepository.GetAlertListAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var list = JsonSerializer.Deserialize<List<AlertListRowDto>>(result);
                    if (list != null)
                    {
                        foreach (var row in list)
                        {
                            response.PostMessages.Add(new PostMessage
                            {
                                MessageID = row.MessageID,
                                RowID = row.RowID,
                                PostedBy = row.PostedBy,
                                PostedDate = row.PostedDate,
                                AlertDate = row.AlertDate,
                                Description = row.Description,
                                Message = string.IsNullOrWhiteSpace(row.Message) ? row.Description : row.Message,
                                Active = row.Active
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
        /// Insert or update post message (matches legacy controller exactly)
        /// </summary>
        public PostMessageOperationResponse InsertOrUpdatePostMessage(PostMessageRequest request)
        {
            PostMessageOperationResponse response = new PostMessageOperationResponse();
            try
            {
                var result = _postMessageRepository.InsertOrUpdatePostMessageAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var resultObj = JsonSerializer.Deserialize<dynamic>(result);
                    response.IsSuccess = true;
                    response.Message = "Data updated successfully.";
                    response.ErrorMessage = "";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to save post message";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
        }

        /// <summary>
        /// Delete post message (matches legacy controller exactly)
        /// </summary>
        public PostMessageOperationResponse DeletePostMessage(DeletePostMessageRequest request)
        {
            PostMessageOperationResponse response = new PostMessageOperationResponse();
            try
            {
                var result = _postMessageRepository.DeletePostMessageAsync(request).Result;

                if (!string.IsNullOrEmpty(result))
                {
                    var resultObj = JsonSerializer.Deserialize<dynamic>(result);
                    response.IsSuccess = true;
                    response.Message = "Data deleted successfully.";
                    response.ErrorMessage = "";
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Failed to delete post message";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "";
            }

            return response;
        }
    }
}
