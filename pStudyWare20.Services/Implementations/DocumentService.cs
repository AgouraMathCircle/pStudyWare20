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
    }
}
