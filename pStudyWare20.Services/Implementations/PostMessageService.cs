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
                    var dataTable = JsonSerializer.Deserialize<System.Data.DataTable>(result);
                    if (dataTable != null && dataTable.Rows.Count > 0)
                    {
                        foreach (System.Data.DataRow row in dataTable.Rows)
                        {
                            response.PostMessages.Add(new PostMessage
                            {
                                MessageID = Convert.ToInt32(row["MessageID"]),
                                PostedBy = row["PostedBy"]?.ToString() ?? string.Empty,
                                PostedDate = row["PostedDate"]?.ToString() ?? string.Empty,
                                Active = Convert.ToBoolean(row["Active"]),
                                Message = row["Message"]?.ToString() ?? string.Empty,
                                AlertDate = row["AlertDate"]?.ToString() ?? string.Empty,
                                Description = row["Description"]?.ToString() ?? string.Empty,
                                RowID = Convert.ToInt32(row["RowID"])
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
