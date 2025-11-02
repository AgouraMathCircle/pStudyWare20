using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for sent email business logic
    /// </summary>
    public class SentEmailService : ISentEmailService
    {
        private readonly ISentEmailRepository _sentEmailRepository;

        public SentEmailService(ISentEmailRepository sentEmailRepository)
        {
            _sentEmailRepository = sentEmailRepository;
        }

        /// <summary>
        /// Get sent messages for a user
        /// </summary>
        public async Task<GetSentMessagesResponse> GetSentMessagesAsync(GetSentMessagesRequest request)
        {
            try
            {
                var dataTable = await _sentEmailRepository.GetSentMessagesAsync(request.Username);
                var messages = new List<SentMessageInfo>();

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    foreach (DataRow row in dataTable.Rows)
                    {
                        messages.Add(new SentMessageInfo
                        {
                            MessageID = GetIntValue(row, "MessageID"),
                            SendFrom = GetStringValue(row, "SendFrom"),
                            SendTo = GetStringValue(row, "SendTo"),
                            Subject = GetStringValue(row, "Subject"),
                            SendDate = GetDateTimeValue(row, "SendDate"),
                            Message = GetStringValue(row, "Message"),
                            EmailID = GetIntValue(row, "EmailID"),
                            Name = GetStringValue(row, "Name"),
                            SendBy = GetStringValue(row, "SendBy")
                        });
                    }
                }

                return new GetSentMessagesResponse
                {
                    IsSuccess = true,
                    Messages = messages
                };
            }
            catch (Exception ex)
            {
                return new GetSentMessagesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Get specific message details
        /// </summary>
        public async Task<GetMessageDetailsResponse> GetMessageDetailsAsync(GetMessageDetailsRequest request)
        {
            try
            {
                var dataTable = await _sentEmailRepository.GetMessageDetailsAsync(request.EmailID);

                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    var row = dataTable.Rows[0];
                    return new GetMessageDetailsResponse
                    {
                        IsSuccess = true,
                        Message = GetStringValue(row, "Message"),
                        EmailID = request.EmailID,
                        SendTo = GetStringValue(row, "SendTo"),
                        Subject = GetStringValue(row, "Subject"),
                        Name = GetStringValue(row, "Name"),
                        SendBy = GetStringValue(row, "SendBy")
                    };
                }

                return new GetMessageDetailsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Message not found"
                };
            }
            catch (Exception ex)
            {
                return new GetMessageDetailsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        /// <summary>
        /// Helper method to get integer value from DataRow
        /// </summary>
        private int GetIntValue(DataRow row, string columnName)
        {
            if (row.Table.Columns.Contains(columnName) &&
                row[columnName] != DBNull.Value &&
                int.TryParse(row[columnName].ToString(), out int value))
            {
                return value;
            }
            return 0;
        }

        /// <summary>
        /// Helper method to get string value from DataRow (handles missing columns)
        /// </summary>
        private string GetStringValue(DataRow row, string columnName)
        {
            if (row.Table.Columns.Contains(columnName) && row[columnName] != DBNull.Value)
            {
                return row[columnName]?.ToString() ?? "";
            }
            return "";
        }

        /// <summary>
        /// Helper method to get DateTime value from DataRow (handles missing columns)
        /// </summary>
        private DateTime GetDateTimeValue(DataRow row, string columnName)
        {
            if (row.Table.Columns.Contains(columnName) && row[columnName] != DBNull.Value)
            {
                if (DateTime.TryParse(row[columnName].ToString(), out DateTime value))
                {
                    return value;
                }
            }
            return DateTime.MinValue;
        }
    }
}
