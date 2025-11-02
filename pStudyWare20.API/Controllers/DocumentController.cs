using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        /// <summary>
        /// Get class materials (matches legacy controller exactly)
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Class materials result</returns>
        [HttpPost]
        [Route("GetClassMaterials")]
        public object GetClassMaterials([FromBody] UserName userName)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _documentService.GetClassMaterials(userName);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting class materials", error = ex.Message });
            }
        }

        /// <summary>
        /// Publish document (matches legacy controller exactly)
        /// </summary>
        /// <param name="publishDocument">Document publish request</param>
        /// <returns>Publish result</returns>
        [HttpPost]
        [Route("PublishDocument")]
        public object PublishDocument([FromBody] PublishDocument publishDocument)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _documentService.PublishDocument(publishDocument);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while publishing document", error = ex.Message });
            }
        }

        /// <summary>
        /// Get documents repository list
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document list result</returns>
        [HttpPost]
        [Route("GetDocumentsList")]
        public async Task<object> GetDocumentsList([FromBody] DocumentRepositoryListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.GetDocumentsRepositoryListAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting documents list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get documents repository (using AMC_spDocumentsRepository stored procedure)
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document repository list result</returns>
        [HttpPost]
        [Route("GetDocumentsRepository")]
        public async Task<object> GetDocumentsRepository([FromBody] DocumentRepositoryListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.GetDocumentsRepositoryAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting documents repository", error = ex.Message });
            }
        }

        /// <summary>
        /// Upload document
        /// </summary>
        /// <param name="request">Document upload request</param>
        /// <returns>Upload result</returns>
        [HttpPost]
        [Route("UploadDocument")]
        public async Task<object> UploadDocument([FromBody] DocumentUploadRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.UploadDocumentAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading document", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete document
        /// </summary>
        /// <param name="request">Document delete request</param>
        /// <returns>Delete result</returns>
        [HttpPost]
        [Route("DeleteDocument")]
        public async Task<object> DeleteDocument([FromBody] DocumentDeleteRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.DeleteDocumentAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting document", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student documents
        /// </summary>
        /// <param name="request">Get student documents request</param>
        /// <returns>Student documents list</returns>
        [HttpPost]
        [Route("GetStudentDocuments")]
        public async Task<object> GetStudentDocuments([FromBody] GetStudentDocumentsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.GetStudentDocumentsAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Add student document
        /// </summary>
        /// <param name="request">Upload document request</param>
        /// <returns>Upload result</returns>
        [HttpPost]
        [Route("AddStudentDocument")]
        public async Task<object> AddStudentDocument([FromBody] UploadDocumentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.AddStudentDocumentAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding student document", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete student document
        /// </summary>
        /// <param name="request">Delete document request</param>
        /// <returns>Delete result</returns>
        [HttpPost]
        [Route("DeleteStudentDocument")]
        public async Task<object> DeleteStudentDocument([FromBody] DeleteDocumentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.DeleteStudentDocumentAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting student document", error = ex.Message });
            }
        }

        /// <summary>
        /// Get current session
        /// </summary>
        /// <param name="request">Get current session request</param>
        /// <returns>Current session list</returns>
        [HttpPost]
        [Route("GetCurrentSession")]
        public async Task<object> GetCurrentSession([FromBody] GetCurrentSessionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.GetCurrentSessionAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting current session", error = ex.Message });
            }
        }

        /// <summary>
        /// Get schedule lookup
        /// </summary>
        /// <param name="request">Get schedule lookup request</param>
        /// <returns>Schedule lookup list</returns>
        [HttpPost]
        [Route("GetScheduleLookup")]
        public async Task<object> GetScheduleLookup([FromBody] GetScheduleLookupRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.GetScheduleLookupAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting schedule lookup", error = ex.Message });
            }
        }

        /// <summary>
        /// Update message center
        /// </summary>
        /// <param name="request">Update message center request</param>
        /// <returns>Update result</returns>
        [HttpPost]
        [Route("UpdateMessageCenter")]
        public async Task<object> UpdateMessageCenter([FromBody] UpdateMessageCenterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _documentService.UpdateMessageCenterAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating message center", error = ex.Message });
            }
        }
    }
}
