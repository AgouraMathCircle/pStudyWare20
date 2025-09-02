using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Shared;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Implementation of document data access operations using stored procedures (matches legacy controller)
    /// </summary>
    public class DocumentRepository : IDocumentRepository
    {
        private readonly string? _connectionString;

        public DocumentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection connection string not found in configuration.");
        }

        /// <summary>
        /// Get class materials using AMC_spDocuments stored procedure
        /// </summary>
        public async Task<string> GetClassMaterialsAsync(UserName request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spDocuments", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Username", request.userName));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }

        /// <summary>
        /// Publish document using AMC_spPublishDocuments stored procedure
        /// </summary>
        public async Task<string> PublishDocumentAsync(PublishDocument request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("AMC_spPublishDocuments", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@DocID", request.docID));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return System.Text.Json.JsonSerializer.Serialize(dataTable);
                    }
                }
            }
        }
    }
}
