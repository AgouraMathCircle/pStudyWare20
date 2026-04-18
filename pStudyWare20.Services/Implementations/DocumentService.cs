using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of document business logic operations (matches legacy controller)
    /// </summary>
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly IConfiguration _configuration;

        public DocumentService(IDocumentRepository documentRepository, IConfiguration configuration)
        {
            _documentRepository = documentRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Get class materials (legacy student flow; SP AMC_spGetClassMaterials).
        /// </summary>
        public async Task<ResponseDetails> GetClassMaterialsAsync(UserName userName)
        {
            var responseDetails = new ResponseDetails();
            try
            {
                var result = await _documentRepository.GetClassMaterialsAsync(userName).ConfigureAwait(false);
                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Publish document (legacy Documents.aspx Publish(); SP AMC_spPublishDocuments).
        /// </summary>
        public async Task<ResponseDetails> PublishDocumentAsync(PublishDocument publishDocument)
        {
            var responseDetails = new ResponseDetails();
            try
            {
                var result = await _documentRepository.PublishDocumentAsync(publishDocument).ConfigureAwait(false);
                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get documents repository list
        /// </summary>
        public async Task<DocumentRepositoryListResponse> GetDocumentsRepositoryListAsync(DocumentRepositoryListRequest request)
        {
            var response = new DocumentRepositoryListResponse();
            try
            {
                var result = await _documentRepository.GetDocumentsRepositoryListAsync(request);

                // Parse the JSON result and convert to DocumentRepositoryItem list
                var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, System.Text.Json.JsonElement>>>(result);
                var documents = new List<DocumentRepositoryItem>();

                if (rows != null && rows.Count > 0)
                {
                    foreach (var row in rows)
                    {
                        documents.Add(new DocumentRepositoryItem
                        {
                            DocID = GetIntValue(row, "mDocID") ?? GetIntValue(row, "DocID") ?? 0,
                            Topics = GetStringValue(row, "Topics"),
                            DocName = GetStringValue(row, "mDocName"),
                            Description = GetStringValue(row, "Description"),
                            Class = GetStringValue(row, "Class"),
                            Session = GetStringValue(row, "mSession"),
                            Publish = GetStringValue(row, "Status"),
                            VideoURL = GetStringValue(row, "mURLName"),
                            DocType = GetStringValue(row, "DocType"),
                            UploadedDate = GetDateTimeValue(row, "InsertDate") ?? DateTime.MinValue,
                            UploadedBy = GetStringValue(row, "UploadedBy"),
                            FilePath = GetStringValue(row, "FilePath"),
                            FileSize = GetLongValue(row, "FileSize") ?? 0
                        });
                    }
                }

                response.IsSuccess = true;
                response.Message = "Documents retrieved successfully";
                response.Documents = documents;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to retrieve documents";
            }

            return response;
        }

        /// <summary>
        /// Get documents repository (using AMC_spDocumentsRepository)
        /// </summary>
        public async Task<DocumentRepositoryListResponse> GetDocumentsRepositoryAsync(DocumentRepositoryListRequest request)
        {
            var response = new DocumentRepositoryListResponse();
            try
            {
                var result = await _documentRepository.GetDocumentsRepositoryAsync(request);

                // Parse the JSON result and convert to DocumentRepositoryItem list
                var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, System.Text.Json.JsonElement>>>(result);
                var documents = new List<DocumentRepositoryItem>();

                if (rows != null && rows.Count > 0)
                {
                    foreach (var row in rows)
                    {
                        documents.Add(new DocumentRepositoryItem
                        {
                            DocID = GetIntValue(row, "mDocID") ?? GetIntValue(row, "DocID") ?? 0,
                            Topics = GetStringValue(row, "Topics"),
                            DocName = GetStringValue(row, "mDocName"),
                            Description = GetStringValue(row, "Description"),
                            Class = GetStringValue(row, "Class"),
                            Session = GetStringValue(row, "mSession"),
                            Publish = GetStringValue(row, "Status"),
                            VideoURL = GetStringValue(row, "mURLName"),
                            DocType = GetStringValue(row, "DocType"),
                            UploadedDate = GetDateTimeValue(row, "InsertDate") ?? DateTime.MinValue,
                            UploadedBy = GetStringValue(row, "UploadedBy"),
                            FilePath = GetStringValue(row, "FilePath"),
                            FileSize = GetLongValue(row, "FileSize") ?? 0
                        });
                    }
                }

                response.IsSuccess = true;
                response.Message = "Documents retrieved successfully";
                response.Documents = documents;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to retrieve documents";
            }

            return response;
        }

        /// <summary>
        /// Upload document to repository
        /// </summary>
        public async Task<DocumentUploadResponse> UploadDocumentAsync(DocumentUploadRequest request)
        {
            var response = new DocumentUploadResponse();
            try
            {
                // Save file to disk first
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "pStudyWare", "AMC_Docs");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                var fileName = $"{Guid.NewGuid()}_{request.DocName}";
                var filePath = Path.Combine(uploadPath, fileName);

                await File.WriteAllBytesAsync(filePath, request.FileContent);

                // Update request with actual file path
                request.DocName = fileName;

                // Call repository to add document metadata
                var result = await _documentRepository.AddDocumentAsync(request);

                // Parse result to get document ID if available
                var dataTable = System.Text.Json.JsonSerializer.Deserialize<System.Data.DataTable>(result);
                int documentId = 0;
                if (dataTable != null && dataTable.Rows.Count > 0)
                {
                    documentId = Convert.ToInt32(dataTable.Rows[0]["DocID"]);
                }

                response.IsSuccess = true;
                response.Message = "Document uploaded successfully";
                response.DocumentId = documentId;
                response.FilePath = filePath;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to upload document";
            }

            return response;
        }

        /// <summary>
        /// Delete document from repository
        /// </summary>
        public async Task<DocumentDeleteResponse> DeleteDocumentAsync(DocumentDeleteRequest request)
        {
            var response = new DocumentDeleteResponse();
            try
            {
                // Delete file from disk first
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "pStudyWare", "AMC_Docs", request.DocName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                // Call repository to delete document metadata
                var result = await _documentRepository.DeleteDocumentAsync(request);

                response.IsSuccess = true;
                response.Message = "Document deleted successfully";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to delete document";
            }

            return response;
        }

        // Helper methods for JSON deserialization
        private string GetStringValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind != System.Text.Json.JsonValueKind.Null)
            {
                return row[key].ToString();
            }
            return string.Empty;
        }

        private int? GetIntValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind == System.Text.Json.JsonValueKind.Number)
            {
                return row[key].GetInt32();
            }
            return null;
        }

        private long? GetLongValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind == System.Text.Json.JsonValueKind.Number)
            {
                return row[key].GetInt64();
            }
            return null;
        }

        private DateTime? GetDateTimeValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (row.ContainsKey(key) && row[key].ValueKind != System.Text.Json.JsonValueKind.Null)
            {
                try
                {
                    return row[key].GetDateTime();
                }
                catch
                {
                    // Try parsing as string if DateTime parse fails
                    var str = row[key].ToString();
                    if (DateTime.TryParse(str, out DateTime result))
                    {
                        return result;
                    }
                }
            }
            return null;
        }

        // Student Documents methods implementation
        /// <summary>
        /// Get student documents
        /// </summary>
        public async Task<StudentDocumentsListResponse> GetStudentDocumentsAsync(GetStudentDocumentsRequest request)
        {
            var response = new StudentDocumentsListResponse();
            try
            {
                var result = await _documentRepository.GetStudentDocumentsAsync(request);

                // Parse the JSON result and convert to StudentDocument list
                var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, System.Text.Json.JsonElement>>>(result);
                var documents = new List<StudentDocument>();

                if (rows != null && rows.Count > 0)
                {
                    foreach (var row in rows)
                    {
                        documents.Add(new StudentDocument
                        {
                            DocumentID = GetIntValue(row, "DocumentID") ?? 0,
                            DocID = GetIntValue(row, "mDocID") ?? 0,
                            Description = GetStringValue(row, "Description"),
                            Type = GetStringValue(row, "Type"),
                            DocumentName = GetStringValue(row, "mDocName"),
                            InsertDate = GetDateTimeValue(row, "InsertDate") ?? DateTime.MinValue,
                            StudentID = GetStringValue(row, "mStudentID"),
                            Username = GetStringValue(row, "Username")
                        });
                    }
                }

                response.IsSuccess = true;
                response.StudentDocuments = documents;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Add student document with file upload
        /// </summary>
        public async Task<DocumentOperationResponse> AddStudentDocumentAsync(UploadDocumentRequest request)
        {
            var response = new DocumentOperationResponse();
            try
            {
                // Save file to disk first
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "pStudyWare", "AMC_Student_Docs");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                // Create filename based on student info, session, and year
                var fileName = $"{request.StudentID}_{request.Session}_{DateTime.Now.Year}.pdf";
                fileName = fileName.Replace("(", "_").Replace(")", "").Replace("-", "_").Replace(" ", "");

                var filePath = Path.Combine(uploadPath, fileName);
                await File.WriteAllBytesAsync(filePath, request.FileContent);

                // Update request with actual file name
                request.FileName = fileName;

                // Call repository to add document metadata
                var result = await _documentRepository.AddStudentDocumentAsync(request);

                response.IsSuccess = true;
                response.Message = "Document uploaded successfully";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to upload document";
            }

            return response;
        }

        /// <summary>
        /// Delete student document
        /// </summary>
        public async Task<DocumentOperationResponse> DeleteStudentDocumentAsync(DeleteDocumentRequest request)
        {
            var response = new DocumentOperationResponse();
            try
            {
                // Delete file from disk first
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "pStudyWare", "AMC_Student_Docs", request.DocumentName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                // Call repository to delete document metadata
                var result = await _documentRepository.DeleteStudentDocumentAsync(request);

                response.IsSuccess = true;
                response.Message = "Document deleted successfully";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to delete document";
            }

            return response;
        }

        /// <summary>
        /// Get current session
        /// </summary>
        public async Task<ScheduleLookupResponse> GetCurrentSessionAsync(GetCurrentSessionRequest request)
        {
            var response = new ScheduleLookupResponse();
            try
            {
                var result = await _documentRepository.GetCurrentSessionAsync(request);

                // Parse the JSON result and convert to CurrentSession list
                var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, System.Text.Json.JsonElement>>>(result);
                var sessions = new List<CurrentSession>();

                if (rows != null && rows.Count > 0)
                {
                    foreach (var row in rows)
                    {
                        sessions.Add(new CurrentSession
                        {
                            Session = GetStringValue(row, "Session")
                        });
                    }
                }

                response.IsSuccess = true;
                response.Sessions = sessions;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Get schedule lookup
        /// </summary>
        public async Task<ScheduleLookupResponse> GetScheduleLookupAsync(GetScheduleLookupRequest request)
        {
            var response = new ScheduleLookupResponse();
            try
            {
                var result = await _documentRepository.GetScheduleLookupAsync(request);

                // Parse the JSON result and convert to CurrentSession list
                var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, System.Text.Json.JsonElement>>>(result);
                var sessions = new List<CurrentSession>();

                if (rows != null && rows.Count > 0)
                {
                    foreach (var row in rows)
                    {
                        sessions.Add(new CurrentSession
                        {
                            Session = GetStringValue(row, "DisplayValue") ?? GetStringValue(row, "Session")
                        });
                    }
                }

                response.IsSuccess = true;
                response.Sessions = sessions;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Update message center
        /// </summary>
        public async Task<MessageCenterOperationResponse> UpdateMessageCenterAsync(UpdateMessageCenterRequest request)
        {
            var response = new MessageCenterOperationResponse();
            try
            {
                var result = await _documentRepository.UpdateMessageCenterAsync(request);

                response.IsSuccess = true;
                response.Message = "Message sent successfully";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
                response.Message = "Failed to send message";
            }

            return response;
        }
    }
}
