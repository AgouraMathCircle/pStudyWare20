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
                        var emailInfo = GetStringValue(row, "Emailinfo", "EmailInfo");

                        messages.Add(new SentMessageInfo
                        {
                            MessageID = GetIntValue(row, "MessageID"),
                            // Legacy sentemail.aspx grid binds [SendFrom]/[SendTo] directly from SP columns.
                            SendFrom = GetStringValue(row, "SendFrom"),
                            SendTo = GetStringValue(row, "SendTo"),
                            Subject = GetStringValue(row, "Subject"),
                            SendDate = GetDateTimeValue(row, "SendDate"),
                            Message = GetStringValue(row, "Message"),
                            EmailID = GetIntValue(row, "EmailID") != 0
                                ? GetIntValue(row, "EmailID")
                                : GetIntValue(row, "TrackingID"),
                            Name = ParseNameFromEmailInfo(emailInfo),
                            StudentName = GetStringValue(row, "StudentName"),
                            MessageTo = GetStringValue(row, "MessageTo"),
                            SendBy = GetStringValue(row, "SendBy"),
                            SenderUsername = ParseSenderUsernameFromEmailInfo(emailInfo),
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
        private static string GetStringValue(DataRow row, params string[] columnNames)
        {
            foreach (var columnName in columnNames)
            {
                var column = row.Table.Columns.Cast<DataColumn>()
                    .FirstOrDefault(c =>
                        string.Equals(c.ColumnName, columnName, StringComparison.OrdinalIgnoreCase));

                if (column != null && row[column] != DBNull.Value)
                {
                    var value = row[column]?.ToString();
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        return value.Trim();
                    }
                }
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

        /// <summary>
        /// Legacy Emailinfo: ID~#SendFrom~#Subject~#Name~#SendBy
        /// </summary>
        private static string ParseNameFromEmailInfo(string emailInfo)
        {
            if (string.IsNullOrWhiteSpace(emailInfo))
            {
                return string.Empty;
            }

            var parts = emailInfo.Split("~#");
            if (parts.Length <= 3)
            {
                return string.Empty;
            }

            var name = parts[3].Trim();
            return name == "0" ? string.Empty : name;
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
    }
}
