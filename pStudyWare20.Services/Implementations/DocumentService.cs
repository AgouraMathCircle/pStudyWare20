using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Text.RegularExpressions;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of document business logic operations (matches legacy controller)
    /// </summary>
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment _hostEnvironment;
        private readonly ILogger<DocumentService> _logger;
        private bool _storageConfigurationLogged;

        /// <summary>
        /// Legacy uploads sometimes prefixed disk/DB names with a GUID. Strip before save/display.
        /// </summary>
        private static readonly Regex GuidPrefixFileNameRegex = new(
            @"^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|[0-9a-fA-F]{32})_(.+)$",
            RegexOptions.Compiled | RegexOptions.CultureInvariant);

        public DocumentService(
            IDocumentRepository documentRepository,
            IConfiguration configuration,
            IHostEnvironment hostEnvironment,
            ILogger<DocumentService> logger)
        {
            _documentRepository = documentRepository;
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
            _logger = logger;
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
                            DocumentID = GetIntValue(row, "DocumentID") ?? 0,
                            Topics = GetStringValue(row, "Topics"),
                            DocName = StripGuidPrefixFromFileName(GetStringValue(row, "mDocName")),
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
                            DocumentID = GetIntValue(row, "DocumentID") ?? 0,
                            Topics = GetStringValue(row, "Topics"),
                            DocName = StripGuidPrefixFromFileName(GetStringValue(row, "mDocName")),
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
        /// Upload class material (PDF) or docs repository file (Word/Excel/PowerPoint).
        /// Legacy: Documents.aspx → ~/pStudyWare/Documents/ + mDocType P;
        /// DocumentsRepository.aspx → ~/pStudyWare/AMC_Docs/ + mDocType W.
        /// DB always stores the original upload file name in mDocName.
        /// </summary>
        public async Task<DocumentUploadResponse> UploadDocumentAsync(DocumentUploadRequest request)
        {
            var response = new DocumentUploadResponse();
            try
            {
                var fileContent = NormalizeFileContent(request.FileContent, null);
                if (fileContent.Length == 0)
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "File content is empty.";
                    response.Message = "Failed to upload document";
                    return response;
                }

                if (!TryGetSafeStudentDocumentFileName(request.DocName, out var displayFileName))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Invalid document name.";
                    response.Message = "Failed to upload document";
                    return response;
                }

                var isRepositoryDocument = IsRepositoryDocumentType(request.DocType);
                if (isRepositoryDocument && !IsAllowedRepositoryExtension(displayFileName))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage =
                        "Sorry, we can accept only Word, Excel and PowerPoint files.";
                    response.Message = "Failed to upload document";
                    return response;
                }

                request.FileContent = fileContent;
                request.Class = NormalizeRepositoryClassCode(request.Class);

                var uploadPath = isRepositoryDocument
                    ? GetRepositoryDocsPath()
                    : GetLegacyClassMaterialDocsPath();
                LogDocumentStorageConfiguration("UploadDocument");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                    _logger.LogInformation(
                        "Created document upload directory at {UploadPath}",
                        uploadPath);
                }

                var diskFileName = ResolveUniqueDiskFileName(uploadPath, displayFileName);
                var filePath = Path.Combine(uploadPath, diskFileName);
                await File.WriteAllBytesAsync(filePath, request.FileContent);

                _logger.LogInformation(
                    "Class material file saved. Environment={Environment} DocName={DocName} DiskFileName={DiskFileName} FullPath={FullPath} SizeBytes={SizeBytes} FileExists={FileExists}",
                    _hostEnvironment.EnvironmentName,
                    displayFileName,
                    diskFileName,
                    filePath,
                    fileContent.Length,
                    File.Exists(filePath));

                // Legacy Documents.aspx stores the original upload file name in mDocName (no GUID prefix).
                request.DocName = displayFileName;
                request.DocType = isRepositoryDocument ? "W" : "P";
                if (isRepositoryDocument)
                {
                    request.VideoURL = string.Empty;
                }

                // Call repository to add document metadata
                var result = await _documentRepository.AddDocumentAsync(request);

                // Parse result to get document ID if available (SP may return no rows)
                var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, System.Text.Json.JsonElement>>>(result);
                int documentId = 0;
                if (rows != null && rows.Count > 0)
                {
                    documentId = GetStaticIntValue(rows[0], "DocID")
                        ?? GetStaticIntValue(rows[0], "mDocID")
                        ?? 0;
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
        /// Upload Word/Excel/PowerPoint to Docs Repository (AMC_Docs + mDocType W).
        /// </summary>
        public async Task<DocumentUploadResponse> UploadRepositoryDocumentAsync(
            DocumentRepositoryUploadRequest request)
        {
            var fileContent = NormalizeFileContent(request.FileContent, request.FileContentBase64);
            if (fileContent.Length == 0)
            {
                return new DocumentUploadResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "File content is empty.",
                    Message = "Failed to upload document",
                };
            }

            if (!TryGetSafeStudentDocumentFileName(request.DocName, out var displayFileName))
            {
                return new DocumentUploadResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid document name.",
                    Message = "Failed to upload document",
                };
            }

            if (!IsAllowedRepositoryExtension(displayFileName))
            {
                return new DocumentUploadResponse
                {
                    IsSuccess = false,
                    ErrorMessage =
                        "Sorry, we can accept only Word, Excel and PowerPoint files.",
                    Message = "Failed to upload document",
                };
            }

            var uploadRequest = new DocumentUploadRequest
            {
                Topics = request.Topics ?? string.Empty,
                DocName = displayFileName,
                Description = request.Description,
                Class = NormalizeRepositoryClassCode(request.Class),
                Session = request.Session,
                Publish = string.IsNullOrWhiteSpace(request.Publish) ? "0" : request.Publish,
                DocType = "W",
                VideoURL = string.Empty,
                FileContent = fileContent,
            };

            return await UploadDocumentAsync(uploadRequest);
        }

        /// <summary>
        /// Delete document from repository
        /// </summary>
        public async Task<DocumentDeleteResponse> DeleteDocumentAsync(DocumentDeleteRequest request)
        {
            var response = new DocumentDeleteResponse();
            try
            {
                if (!TryResolveDeleteDocumentId(request.DocID, out var docId))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Invalid document ID.";
                    response.Message = "Failed to delete document";
                    return response;
                }

                request.DocID = docId.ToString();

                if (!TryGetSafeStudentDocumentFileName(request.DocName, out var safeFileName))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Invalid document name.";
                    response.Message = "Failed to delete document";
                    return response;
                }

                foreach (var directory in GetClassMaterialSearchDirectories())
                {
                    if (!Directory.Exists(directory))
                    {
                        continue;
                    }

                    var foundPath = FindClassMaterialFileOnDisk(directory, safeFileName);
                    if (foundPath != null && File.Exists(foundPath))
                    {
                        File.Delete(foundPath);
                        break;
                    }
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
        private static bool TryGetRowElement(
            Dictionary<string, System.Text.Json.JsonElement> row,
            string key,
            out System.Text.Json.JsonElement element)
        {
            if (row.TryGetValue(key, out element))
            {
                return true;
            }

            foreach (var kvp in row)
            {
                if (string.Equals(kvp.Key, key, StringComparison.OrdinalIgnoreCase))
                {
                    element = kvp.Value;
                    return true;
                }
            }

            element = default;
            return false;
        }

        private string GetStringValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (TryGetRowElement(row, key, out var element)
                && element.ValueKind != System.Text.Json.JsonValueKind.Null)
            {
                return element.ToString();
            }
            return string.Empty;
        }

        private int? GetIntValue(Dictionary<string, System.Text.Json.JsonElement> row, string key) =>
            GetStaticIntValue(row, key);

        private static int? GetStaticIntValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (!TryGetRowElement(row, key, out var element)
                || element.ValueKind == System.Text.Json.JsonValueKind.Null)
            {
                return null;
            }

            if (element.ValueKind == System.Text.Json.JsonValueKind.Number)
            {
                if (element.TryGetInt32(out var intValue))
                {
                    return intValue;
                }

                if (element.TryGetInt64(out var longValue) && longValue <= int.MaxValue)
                {
                    return (int)longValue;
                }
            }

            if (element.ValueKind == System.Text.Json.JsonValueKind.String
                && int.TryParse(element.GetString(), out var parsed))
            {
                return parsed;
            }

            return null;
        }

        /// <summary>
        /// AMC_spStudentDocuments exposes table mDocID as DocumentID; AMC_spDeleteDocuments @DocID uses that value.
        /// The mDocID column in the result set is a display row number only.
        /// </summary>
        private static int ResolveStudentDocumentDeleteId(Dictionary<string, System.Text.Json.JsonElement> row) =>
            GetStaticIntValue(row, "DocumentID") ?? 0;

        private long? GetLongValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (TryGetRowElement(row, key, out var element)
                && element.ValueKind == System.Text.Json.JsonValueKind.Number)
            {
                return element.GetInt64();
            }
            return null;
        }

        private DateTime? GetDateTimeValue(Dictionary<string, System.Text.Json.JsonElement> row, string key)
        {
            if (TryGetRowElement(row, key, out var element)
                && element.ValueKind != System.Text.Json.JsonValueKind.Null)
            {
                try
                {
                    return element.GetDateTime();
                }
                catch
                {
                    var str = element.ToString();
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
                            DocumentID = ResolveStudentDocumentDeleteId(row),
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
                request.StudentID = ExtractStudentId(request.StudentID);
                if (string.IsNullOrWhiteSpace(request.StudentID))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Student ID is required.";
                    response.Message = "Failed to upload document";
                    return response;
                }

                if (request.FileContent == null || request.FileContent.Length == 0)
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "File content is required.";
                    response.Message = "Failed to upload document";
                    return response;
                }

                var uploadPath = GetStudentDocsUploadPath();
                Directory.CreateDirectory(uploadPath);

                // Legacy StudentDocuments.aspx.cs naming: StudentID_StudentName_Session_Year.pdf
                var studentName = string.IsNullOrWhiteSpace(request.StudentName)
                    ? "Student"
                    : request.StudentName.Trim();
                var fileName = BuildStudentDocumentFileName(
                    request.StudentID,
                    studentName,
                    request.Session);

                var filePath = Path.Combine(uploadPath, fileName);
                await File.WriteAllBytesAsync(filePath, request.FileContent);

                request.FileName = fileName;

                await _documentRepository.AddStudentDocumentAsync(request);

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
                if (string.IsNullOrWhiteSpace(request.DocumentName))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Document name is required.";
                    response.Message = "Failed to delete document";
                    return response;
                }

                if (!TryResolveDeleteDocumentId(request.DocumentID, out var docId))
                {
                    response.IsSuccess = false;
                    response.ErrorMessage = "Invalid document ID.";
                    response.Message = "Failed to delete document";
                    return response;
                }

                request.DocumentID = docId.ToString();

                // Delete file from disk first (ignore if already removed)
                var filePath = Path.Combine(GetStudentDocsUploadPath(), request.DocumentName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                await _documentRepository.DeleteStudentDocumentAsync(request);

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
        /// Read student document bytes from configured storage path.
        /// </summary>
        public async Task<StudentDocumentFileResponse> GetStudentDocumentFileAsync(string documentName)
        {
            var response = new StudentDocumentFileResponse();
            try
            {
                if (!TryGetSafeStudentDocumentFileName(documentName, out var safeFileName))
                {
                    response.ErrorMessage = "Invalid document name.";
                    return response;
                }

                var filePath = Path.Combine(GetStudentDocsUploadPath(), safeFileName);
                if (!File.Exists(filePath))
                {
                    response.ErrorMessage = "Document file was not found.";
                    return response;
                }

                response.FileContent = await File.ReadAllBytesAsync(filePath);
                response.FileName = safeFileName;
                response.ContentType = GetStudentDocumentContentType(safeFileName);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        /// <summary>
        /// Read class material PDF bytes from configured/legacy storage paths.
        /// Legacy: ~/pStudyWare/Documents/ (Documents.aspx OpenFile).
        /// </summary>
        public async Task<StudentDocumentFileResponse> GetClassMaterialFileAsync(string documentName)
        {
            var response = new StudentDocumentFileResponse();
            try
            {
                if (!TryGetSafeStudentDocumentFileName(documentName, out var safeFileName))
                {
                    _logger.LogWarning(
                        "Class material lookup rejected invalid file name. RequestedName={DocumentName}",
                        documentName);
                    response.ErrorMessage = "Invalid document name.";
                    return response;
                }

                LogDocumentStorageConfiguration("GetClassMaterialFile");
                var searchDirectories = GetClassMaterialSearchDirectories().ToList();
                _logger.LogInformation(
                    "Class material lookup started. Environment={Environment} RequestedName={DocumentName} SafeFileName={SafeFileName} SearchPaths={SearchPaths}",
                    _hostEnvironment.EnvironmentName,
                    documentName,
                    safeFileName,
                    string.Join(" | ", searchDirectories));

                string? foundPath = null;
                foreach (var directory in searchDirectories)
                {
                    if (!Directory.Exists(directory))
                    {
                        _logger.LogDebug(
                            "Class material search skipped missing directory {Directory}",
                            directory);
                        continue;
                    }

                    foundPath = FindClassMaterialFileOnDisk(directory, safeFileName);
                    if (foundPath != null)
                    {
                        break;
                    }
                }

                if (foundPath == null)
                {
                    _logger.LogWarning(
                        "Class material file not found. SafeFileName={SafeFileName} SearchPaths={SearchPaths}",
                        safeFileName,
                        string.Join(" | ", searchDirectories));
                    response.ErrorMessage = "Document file was not found.";
                    return response;
                }

                _logger.LogInformation(
                    "Class material file found at {FoundPath}",
                    foundPath);

                response.FileContent = await File.ReadAllBytesAsync(foundPath);
                response.FileName = safeFileName;
                response.ContentType = GetStudentDocumentContentType(safeFileName);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        private IEnumerable<string> GetClassMaterialSearchDirectories()
        {
            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var directory in new[]
            {
                GetLegacyClassMaterialDocsPath(),
                GetRepositoryDocsPath(),
                ResolvePathFromContentRoot(Path.Combine("..", "pStudayWare", "Documents")),
                ResolvePathFromContentRoot(Path.Combine("..", "pStudyWare20.UI", "public", "pstudyware", "Documents")),
            })
            {
                if (seen.Add(directory))
                {
                    yield return directory;
                }
            }
        }

        private string GetRepositoryDocsPath() =>
            ResolveConfiguredStoragePath(
                "DocumentStorage:RepositoryDocsPath",
                Path.Combine("pStudyWare", "AMC_Docs"));

        private string GetLegacyClassMaterialDocsPath() =>
            ResolveConfiguredStoragePath(
                "DocumentStorage:ClassMaterialDocsPath",
                Path.Combine("pStudyWare", "Documents"));

        private string ResolveConfiguredStoragePath(string configurationKey, string defaultRelativePath)
        {
            var configured = _configuration[configurationKey];
            var relativePath = !string.IsNullOrWhiteSpace(configured)
                ? configured
                : defaultRelativePath;

            if (Path.IsPathRooted(relativePath))
            {
                return relativePath;
            }

            return ResolvePathFromContentRoot(relativePath);
        }

        private string ResolvePathFromContentRoot(string relativePath)
        {
            return Path.GetFullPath(Path.Combine(_hostEnvironment.ContentRootPath, relativePath));
        }

        private void LogDocumentStorageConfiguration(string operation)
        {
            if (_storageConfigurationLogged)
            {
                return;
            }

            _storageConfigurationLogged = true;
            var searchPaths = GetClassMaterialSearchDirectories().ToList();
            _logger.LogInformation(
                "Document storage configuration [{Operation}] Environment={Environment} IsDevelopment={IsDevelopment} ContentRoot={ContentRoot} WorkingDirectory={WorkingDirectory} ClassMaterialUploadPath={ClassMaterialUploadPath} RepositoryUploadPath={RepositoryUploadPath} StudentDocsPath={StudentDocsPath} SearchPaths={SearchPaths}",
                operation,
                _hostEnvironment.EnvironmentName,
                _hostEnvironment.IsDevelopment(),
                _hostEnvironment.ContentRootPath,
                Directory.GetCurrentDirectory(),
                GetLegacyClassMaterialDocsPath(),
                GetRepositoryDocsPath(),
                GetStudentDocsUploadPath(),
                string.Join(" | ", searchPaths));
        }

        private static bool IsRepositoryDocumentType(string? docType) =>
            string.Equals(docType?.Trim(), "W", StringComparison.OrdinalIgnoreCase);

        private static readonly HashSet<string> RepositoryAllowedExtensions =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
            };

        private static bool IsAllowedRepositoryExtension(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            return !string.IsNullOrWhiteSpace(extension)
                && RepositoryAllowedExtensions.Contains(extension);
        }

        private static string NormalizeRepositoryClassCode(string? classValue)
        {
            if (string.IsNullOrWhiteSpace(classValue))
            {
                return string.Empty;
            }

            var trimmed = classValue.Trim();
            var classMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                ["Junior Beginner"] = "JB",
                ["Junior Intermediate"] = "JI",
                ["Junior Advanced"] = "JA",
                ["Senior Beginner"] = "SB",
                ["Senior Intermediate"] = "SI",
                ["Senior Advanced"] = "SA",
            };

            return classMap.TryGetValue(trimmed, out var code) ? code : trimmed;
        }

        private static byte[] NormalizeFileContent(byte[]? fileContent, string? base64Content)
        {
            if (fileContent != null && fileContent.Length > 0)
            {
                return fileContent;
            }

            if (string.IsNullOrWhiteSpace(base64Content))
            {
                return Array.Empty<byte>();
            }

            try
            {
                var normalized = base64Content.Trim();
                var commaIndex = normalized.IndexOf(',');
                if (commaIndex >= 0)
                {
                    normalized = normalized[(commaIndex + 1)..];
                }

                return Convert.FromBase64String(normalized);
            }
            catch
            {
                return Array.Empty<byte>();
            }
        }

        private static IEnumerable<string> GetCandidateDiskFileNames(string displayFileName)
        {
            var strippedName = StripGuidPrefixFromFileName(displayFileName);

            yield return displayFileName;
            if (!string.Equals(strippedName, displayFileName, StringComparison.OrdinalIgnoreCase))
            {
                yield return strippedName;
            }

            for (var counter = 2; counter <= 100; counter++)
            {
                yield return $"{counter}{displayFileName}";
                if (!string.Equals(strippedName, displayFileName, StringComparison.OrdinalIgnoreCase))
                {
                    yield return $"{counter}{strippedName}";
                }
            }
        }

        /// <summary>
        /// Legacy Utils.UploadProductPhoto: prefix with counter when the target path already exists.
        /// </summary>
        private static string ResolveUniqueDiskFileName(string directory, string originalFileName)
        {
            var fileName = originalFileName;
            var pathToCheck = Path.Combine(directory, fileName);
            if (!File.Exists(pathToCheck))
            {
                return fileName;
            }

            var counter = 2;
            while (File.Exists(pathToCheck))
            {
                fileName = $"{counter}{originalFileName}";
                pathToCheck = Path.Combine(directory, fileName);
                counter++;
            }

            return fileName;
        }

        private static bool TryGetSafeStudentDocumentFileName(string? documentName, out string safeFileName)
        {
            safeFileName = string.Empty;
            if (string.IsNullOrWhiteSpace(documentName))
            {
                return false;
            }

            var trimmed = documentName.Trim();
            if (trimmed.Contains("..", StringComparison.Ordinal))
            {
                return false;
            }

            var fileName = Path.GetFileName(trimmed);
            if (string.IsNullOrWhiteSpace(fileName) ||
                !string.Equals(fileName, trimmed, StringComparison.Ordinal))
            {
                return false;
            }

            if (fileName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return false;
            }

            safeFileName = StripGuidPrefixFromFileName(fileName);
            return true;
        }

        private static string StripGuidPrefixFromFileName(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return fileName;
            }

            var match = GuidPrefixFileNameRegex.Match(fileName.Trim());
            return match.Success ? match.Groups[1].Value : fileName.Trim();
        }

        private static string? FindClassMaterialFileOnDisk(string directory, string safeFileName)
        {
            foreach (var candidateName in GetCandidateDiskFileNames(safeFileName))
            {
                var candidatePath = Path.Combine(directory, candidateName);
                if (File.Exists(candidatePath))
                {
                    return candidatePath;
                }
            }

            if (!Directory.Exists(directory))
            {
                return null;
            }

            var strippedName = StripGuidPrefixFromFileName(safeFileName);
            foreach (var filePath in Directory.EnumerateFiles(directory))
            {
                var fileName = Path.GetFileName(filePath);
                if (string.Equals(fileName, safeFileName, StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(fileName, strippedName, StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(StripGuidPrefixFromFileName(fileName), strippedName, StringComparison.OrdinalIgnoreCase))
                {
                    return filePath;
                }
            }

            return null;
        }

        private static string GetStudentDocumentContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            return extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase)
                ? "application/pdf"
                : "application/octet-stream";
        }

        private static bool TryResolveDeleteDocumentId(string? rawDocumentId, out int docId)
        {
            docId = 0;
            if (string.IsNullOrWhiteSpace(rawDocumentId))
            {
                return false;
            }

            return int.TryParse(rawDocumentId.Trim(), out docId) && docId > 0;
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

        /// <summary>
        /// Legacy: ~/pStudyWare/AMC_Student_Docs/ (StudentDocuments.aspx.cs).
        /// Override with DocumentStorage:StudentDocsPath in appsettings.
        /// </summary>
        private string GetStudentDocsUploadPath()
        {
            var configured = _configuration["DocumentStorage:StudentDocsPath"];
            if (string.IsNullOrWhiteSpace(configured))
            {
                return Path.Combine(Directory.GetCurrentDirectory(), "pStudyWare", "AMC_Student_Docs");
            }

            return Path.IsPathRooted(configured)
                ? configured
                : Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), configured));
        }

        private static string ExtractStudentId(string? studentId)
        {
            var value = (studentId ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            var parts = value.Split('~');
            return parts.Length >= 2 ? parts[1].Trim() : value;
        }

        private static string BuildStudentDocumentFileName(
            string studentId,
            string studentName,
            string session)
        {
            var fileName = $"{studentId}_{studentName}_{session}_{DateTime.Now.Year}.pdf";
            return SanitizeStudentDocumentFileName(fileName);
        }

        private static string SanitizeStudentDocumentFileName(string fileName) =>
            fileName.Trim()
                .Replace("(", "_", StringComparison.Ordinal)
                .Replace(")", "", StringComparison.Ordinal)
                .Replace("-", "_", StringComparison.Ordinal)
                .Replace(" ", "", StringComparison.Ordinal);
    }
}
