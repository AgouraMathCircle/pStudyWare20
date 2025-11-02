using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pStudyWare20.Data.Models;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for document data access operations
    /// </summary>
    public class DocumentRepository : IDocumentRepository
    {
        private readonly AMC_DBContext _context;
        private readonly string _connectionString;

        public DocumentRepository(AMC_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Get class materials using stored procedure
        /// </summary>
        public async Task<string> GetClassMaterialsAsync(UserName request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetClassMaterials", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 120 // 2 minutes timeout
                };

                command.Parameters.Add(new SqlParameter("@Username", request.userName ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting class materials: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Publish document using stored procedure (matches legacy AMC_spPublishDocuments)
        /// </summary>
        public async Task<string> PublishDocumentAsync(PublishDocument request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spPublishDocuments", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@DocID", request.docID));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error publishing document: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get documents repository list using stored procedure (matches legacy AMC_spDocuments)
        /// </summary>
        public async Task<string> GetDocumentsRepositoryListAsync(DocumentRepositoryListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDocuments", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 120 // 2 minutes timeout for document operations
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to List of Dictionary for proper JSON serialization
                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return System.Text.Json.JsonSerializer.Serialize(rows);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting documents repository list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get documents repository using stored procedure AMC_spDocumentsRepository (matches DocumentsRepository.aspx)
        /// </summary>
        public async Task<string> GetDocumentsRepositoryAsync(DocumentRepositoryListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDocumentsRepository", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 120 // 2 minutes timeout for document operations
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to List of Dictionary for proper JSON serialization
                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return System.Text.Json.JsonSerializer.Serialize(rows);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting documents repository: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Add document to repository using stored procedure (matches legacy AMC_spAddDocument)
        /// </summary>
        public async Task<string> AddDocumentAsync(DocumentUploadRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddDocument", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@mTopics", request.Topics ?? ""));
                command.Parameters.Add(new SqlParameter("@mVideoURL", request.VideoURL ?? ""));
                command.Parameters.Add(new SqlParameter("@mDocName", request.DocName ?? ""));
                command.Parameters.Add(new SqlParameter("@mDescription", request.Description ?? ""));
                command.Parameters.Add(new SqlParameter("@mClass", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@mSession", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@mPublish", request.Publish ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding document: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete document from repository using stored procedure (matches legacy AMC_spDeleteDocuments)
        /// </summary>
        public async Task<string> DeleteDocumentAsync(DocumentDeleteRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteDocuments", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Type", "C"));
                command.Parameters.Add(new SqlParameter("@DocID", request.DocID ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting document: {ex.Message}", ex);
            }
        }

        // Student Documents methods implementation
        /// <summary>
        /// Get student documents using stored procedure (matches AMC_spStudentDocuments)
        /// </summary>
        public async Task<string> GetStudentDocumentsAsync(GetStudentDocumentsRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spStudentDocuments", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 120
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to List of Dictionary for proper JSON serialization
                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return System.Text.Json.JsonSerializer.Serialize(rows);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting student documents: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Add student document using stored procedure (matches AMC_spAddStudentDocument)
        /// </summary>
        public async Task<string> AddStudentDocumentAsync(UploadDocumentRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddStudentDocument", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@StudentID", request.StudentID ?? ""));
                command.Parameters.Add(new SqlParameter("@DocName", request.FileName ?? ""));
                command.Parameters.Add(new SqlParameter("@Description", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Type", request.Type ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding student document: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Delete student document using stored procedure (matches AMC_spDeleteDocuments with Type='S')
        /// </summary>
        public async Task<string> DeleteStudentDocumentAsync(DeleteDocumentRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteDocuments", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Type", "S"));
                command.Parameters.Add(new SqlParameter("@DocID", request.DocumentID ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error deleting student document: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get current session using stored procedure (matches AMC_spSelectCurrentSession)
        /// </summary>
        public async Task<string> GetCurrentSessionAsync(GetCurrentSessionRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectCurrentSession", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@ChapterID", request.ChapterID ?? "3"));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to List of Dictionary for proper JSON serialization
                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return System.Text.Json.JsonSerializer.Serialize(rows);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting current session: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get schedule lookup using stored procedure (matches AMC_spSelectScheduleLookup)
        /// </summary>
        public async Task<string> GetScheduleLookupAsync(GetScheduleLookupRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spSelectScheduleLookup", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                // Convert DataTable to List of Dictionary for proper JSON serialization
                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in dataTable.Rows)
                {
                    var dict = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns)
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                    rows.Add(dict);
                }

                return System.Text.Json.JsonSerializer.Serialize(rows);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting schedule lookup: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Update message center using stored procedure (matches AMC_spAddEmailTracking)
        /// </summary>
        public async Task<string> UpdateMessageCenterAsync(UpdateMessageCenterRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spAddEmailTracking", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@SendTo", request.SendTo ?? ""));
                command.Parameters.Add(new SqlParameter("@SendFrom", request.SendFrom ?? ""));
                command.Parameters.Add(new SqlParameter("@Subject", request.Subject ?? ""));
                command.Parameters.Add(new SqlParameter("@Message", request.Message ?? ""));
                command.Parameters.Add(new SqlParameter("@SendBy", request.SendBy ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating message center: {ex.Message}", ex);
            }
        }
    }
}