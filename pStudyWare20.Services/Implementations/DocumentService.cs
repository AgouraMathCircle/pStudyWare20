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
        /// Get class materials (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails GetClassMaterials(UserName userName)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _documentRepository.GetClassMaterialsAsync(userName).Result;

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
        /// Publish document (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails PublishDocument(PublishDocument publishDocument)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _documentRepository.PublishDocumentAsync(publishDocument).Result;

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
                var dataTable = System.Text.Json.JsonSerializer.Deserialize<System.Data.DataTable>(result);
                var documents = new List<DocumentRepositoryItem>();

                if (dataTable != null)
                {
                    foreach (System.Data.DataRow row in dataTable.Rows)
                    {
                        documents.Add(new DocumentRepositoryItem
                        {
                            DocID = Convert.ToInt32(row["DocID"]),
                            Topics = row["Topics"]?.ToString() ?? string.Empty,
                            DocName = row["DocName"]?.ToString() ?? string.Empty,
                            Description = row["Description"]?.ToString() ?? string.Empty,
                            Class = row["Class"]?.ToString() ?? string.Empty,
                            Session = row["Session"]?.ToString() ?? string.Empty,
                            Publish = row["Publish"]?.ToString() ?? string.Empty,
                            DocType = row["DocType"]?.ToString() ?? string.Empty,
                            UploadedDate = Convert.ToDateTime(row["UploadedDate"]),
                            UploadedBy = row["UploadedBy"]?.ToString() ?? string.Empty,
                            FilePath = row["FilePath"]?.ToString() ?? string.Empty,
                            FileSize = Convert.ToInt64(row["FileSize"])
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
    }
}
