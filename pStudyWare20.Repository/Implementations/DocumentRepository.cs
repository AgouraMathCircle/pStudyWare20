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
                    CommandType = CommandType.StoredProcedure
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
        /// Publish document using stored procedure
        /// </summary>
        public async Task<string> PublishDocumentAsync(PublishDocument request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spPublishDocument", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@DocumentID", request.docID));

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
        /// Get documents repository list using stored procedure
        /// </summary>
        public async Task<string> GetDocumentsRepositoryListAsync(DocumentRepositoryListRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spGetDocumentsRepositoryList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@Username", request.Username ?? ""));

                var dataTable = new DataTable();
                using var adapter = new SqlDataAdapter(command);
                adapter.Fill(dataTable);

                return System.Text.Json.JsonSerializer.Serialize(dataTable);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting documents repository list: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Add document to repository using stored procedure
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

                command.Parameters.Add(new SqlParameter("@Topics", request.Topics ?? ""));
                command.Parameters.Add(new SqlParameter("@DocName", request.DocName ?? ""));
                command.Parameters.Add(new SqlParameter("@Description", request.Description ?? ""));
                command.Parameters.Add(new SqlParameter("@Class", request.Class ?? ""));
                command.Parameters.Add(new SqlParameter("@Session", request.Session ?? ""));
                command.Parameters.Add(new SqlParameter("@Publish", request.Publish ?? ""));
                command.Parameters.Add(new SqlParameter("@DocType", request.DocType ?? ""));
                command.Parameters.Add(new SqlParameter("@FileContent", request.FileContent ?? Array.Empty<byte>()));
                command.Parameters.Add(new SqlParameter("@ContentType", request.ContentType ?? ""));

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
        /// Delete document from repository using stored procedure
        /// </summary>
        public async Task<string> DeleteDocumentAsync(DocumentDeleteRequest request)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new SqlCommand("AMC_spDeleteDocument", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add(new SqlParameter("@DocID", request.DocID ?? ""));
                command.Parameters.Add(new SqlParameter("@DocName", request.DocName ?? ""));

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
    }
}