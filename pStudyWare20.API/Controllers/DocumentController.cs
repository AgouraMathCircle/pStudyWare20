using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Net.Mime;

namespace pStudyWare20.API.Controllers
{
    /// <summary>
    /// REST API for class materials and document repository operations.
    /// Legacy reference: <c>pStudayWare/Documents.aspx.cs</c> (grid, upload, publish, delete).
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [EnableCors("AllowReactApp")]
    [Produces(MediaTypeNames.Application.Json)]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly ILogger<DocumentController> _logger;

        public DocumentController(IDocumentService documentService, ILogger<DocumentController> logger)
        {
            _documentService = documentService;
            _logger = logger;
        }

        /// <summary>
        /// Student / class-material list (not the admin Documents grid).
        /// Legacy: separate class materials flow; repository uses <c>AMC_spGetClassMaterials</c>.
        /// </summary>
        [HttpPost("GetClassMaterials")]
        [ProducesResponseType(typeof(ResponseDetails), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ResponseDetails>> GetClassMaterials(
            [FromBody] UserName userName,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.GetClassMaterialsAsync(userName).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetClassMaterials failed for user.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while getting class materials.", ex));
            }
        }

        /// <summary>
        /// Publish a document (set published flag in DB).
        /// Legacy: <c>Documents.aspx.cs</c> <c>Publish()</c> → <c>AMC_spPublishDocuments</c> with <c>@DocID</c>.
        /// </summary>
        [HttpPost("PublishDocument")]
        [ProducesResponseType(typeof(ResponseDetails), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ResponseDetails>> PublishDocument(
            [FromBody] PublishDocument publishDocument,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.PublishDocumentAsync(publishDocument).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PublishDocument failed for DocID {DocId}.", publishDocument.docID);
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while publishing the document.", ex));
            }
        }

        /// <summary>
        /// Admin / instructor class material grid (all documents for user).
        /// Legacy: <c>Documents.aspx.cs</c> <c>BindGridView()</c> → <c>AMC_spDocuments</c> with <c>@Username</c> (session username).
        /// </summary>
        [HttpPost("GetDocumentsList")]
        [ProducesResponseType(typeof(DocumentRepositoryListResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentRepositoryListResponse>> GetDocumentsList(
            [FromBody] DocumentRepositoryListRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();
            if (string.IsNullOrWhiteSpace(request.Username))
            {
                return BadRequest(new { message = "Username is required." });
            }

            try
            {
                var response = await _documentService.GetDocumentsRepositoryListAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDocumentsList failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while getting the documents list.", ex));
            }
        }

        /// <summary>
        /// Documents repository browse (broader repository SP).
        /// Legacy: <c>DocumentsRepository.aspx</c> pattern; <c>AMC_spDocumentsRepository</c> with <c>@Username</c>.
        /// </summary>
        [HttpPost("GetDocumentsRepository")]
        [ProducesResponseType(typeof(DocumentRepositoryListResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentRepositoryListResponse>> GetDocumentsRepository(
            [FromBody] DocumentRepositoryListRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();
            if (string.IsNullOrWhiteSpace(request.Username))
            {
                return BadRequest(new { message = "Username is required." });
            }

            try
            {
                var response = await _documentService.GetDocumentsRepositoryAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDocumentsRepository failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while getting the documents repository.", ex));
            }
        }

        /// <summary>
        /// Upload class material metadata + file.
        /// Legacy: <c>Documents.aspx.cs</c> <c>btnSubmit_Click1</c> → <c>AMC_spAddDocument</c>
        /// (<c>@mTopics</c>, <c>@mVideoURL</c>, <c>@mDocName</c>, <c>@mDescription</c>, <c>@mClass</c>, <c>@mSession</c>, <c>@mPublish</c>).
        /// </summary>
        [HttpPost("UploadDocument")]
        [ProducesResponseType(typeof(DocumentUploadResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentUploadResponse>> UploadDocument(
            [FromBody] DocumentUploadRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                _logger.LogInformation(
                    "UploadDocument request. DocName={DocName} IsAuthenticated={IsAuthenticated} User={User}",
                    request.DocName,
                    User.Identity?.IsAuthenticated == true,
                    User.Identity?.Name ?? "(anonymous)");

                var response = await _documentService.UploadDocumentAsync(request).ConfigureAwait(false);
                if (response.IsSuccess)
                {
                    _logger.LogInformation(
                        "UploadDocument succeeded. DocName={DocName} SavedPath={SavedPath}",
                        request.DocName,
                        response.FilePath);
                }
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UploadDocument failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while uploading the document.", ex));
            }
        }

        /// <summary>
        /// Upload Docs Repository file (Word/Excel/PowerPoint).
        /// Legacy: <c>DocumentsRepository.aspx.cs</c> <c>btnSubmit_Click1</c> → save under <c>~/pStudyWare/AMC_Docs/</c>,
        /// <c>AMC_spAddDocument</c> with <c>@mDocType</c> = <c>W</c>.
        /// </summary>
        [HttpPost("UploadRepositoryDocument")]
        [ProducesResponseType(typeof(DocumentUploadResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentUploadResponse>> UploadRepositoryDocument(
            [FromBody] DocumentRepositoryUploadRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.UploadRepositoryDocumentAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UploadRepositoryDocument failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while uploading the repository document.", ex));
            }
        }

        /// <summary>
        /// Delete class material file + DB row (class-material type).
        /// Legacy: <c>Documents.aspx.cs</c> <c>DeleteFile()</c> → delete file under <c>~/pStudyWare/Documents/</c>,
        /// then <c>AMC_spDeleteDocuments</c> with <c>@Type</c> = <c>C</c>, <c>@DocID</c>.
        /// </summary>
        [HttpPost("DeleteDocument")]
        [ProducesResponseType(typeof(DocumentDeleteResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentDeleteResponse>> DeleteDocument(
            [FromBody] DocumentDeleteRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.DeleteDocumentAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteDocument failed for DocID {DocId}.", request.DocID);
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while deleting the document.", ex));
            }
        }

        /// <summary>
        /// Student-uploaded documents list.
        /// </summary>
        [HttpPost("GetStudentDocuments")]
        [ProducesResponseType(typeof(StudentDocumentsListResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<StudentDocumentsListResponse>> GetStudentDocuments(
            [FromBody] GetStudentDocumentsRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.GetStudentDocumentsAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetStudentDocuments failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while getting student documents.", ex));
            }
        }

        /// <summary>
        /// Add student document (file + metadata).
        /// </summary>
        [HttpPost("AddStudentDocument")]
        [ProducesResponseType(typeof(DocumentOperationResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentOperationResponse>> AddStudentDocument(
            [FromBody] UploadDocumentRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.AddStudentDocumentAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddStudentDocument failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while adding the student document.", ex));
            }
        }

        /// <summary>
        /// Delete student document.
        /// </summary>
        [HttpPost("DeleteStudentDocument")]
        [ProducesResponseType(typeof(DocumentOperationResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DocumentOperationResponse>> DeleteStudentDocument(
            [FromBody] DeleteDocumentRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.DeleteStudentDocumentAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteStudentDocument failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while deleting the student document.", ex));
            }
        }

        /// <summary>
        /// View class material inline (legacy Documents.aspx OpenFile).
        /// </summary>
        [HttpGet("ViewClassMaterial")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ViewClassMaterial(
            [FromQuery] string fileName,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return BadRequest(new { message = "File name is required." });
            }

            try
            {
                _logger.LogInformation(
                    "ViewClassMaterial request. FileName={FileName} IsAuthenticated={IsAuthenticated} User={User}",
                    fileName,
                    User.Identity?.IsAuthenticated == true,
                    User.Identity?.Name ?? "(anonymous)");

                var response = await _documentService
                    .GetClassMaterialFileAsync(fileName)
                    .ConfigureAwait(false);

                if (!response.IsSuccess)
                {
                    _logger.LogWarning(
                        "ViewClassMaterial not found. FileName={FileName} Error={Error}",
                        fileName,
                        response.ErrorMessage);
                    return NotFound(new { message = response.ErrorMessage });
                }

                Response.Headers.ContentDisposition =
                    $"inline; filename=\"{response.FileName}\"; filename*=UTF-8''{Uri.EscapeDataString(response.FileName)}";

                return File(response.FileContent, response.ContentType, enableRangeProcessing: true);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ViewClassMaterial failed for {FileName}.", fileName);
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    ErrorBody("An error occurred while opening the class material.", ex));
            }
        }

        /// <summary>
        /// Download class material file.
        /// </summary>
        [HttpGet("DownloadClassMaterial")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DownloadClassMaterial(
            [FromQuery] string fileName,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return BadRequest(new { message = "File name is required." });
            }

            try
            {
                var response = await _documentService
                    .GetClassMaterialFileAsync(fileName)
                    .ConfigureAwait(false);

                if (!response.IsSuccess)
                {
                    return NotFound(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DownloadClassMaterial failed for {FileName}.", fileName);
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    ErrorBody("An error occurred while downloading the class material.", ex));
            }
        }

        /// <summary>
        /// View student document inline (legacy OpenFile).
        /// </summary>
        [HttpGet("ViewStudentDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ViewStudentDocument(
            [FromQuery] string fileName,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return BadRequest(new { message = "File name is required." });
            }

            try
            {
                var response = await _documentService
                    .GetStudentDocumentFileAsync(fileName)
                    .ConfigureAwait(false);

                if (!response.IsSuccess)
                {
                    return NotFound(new { message = response.ErrorMessage });
                }

                return new FileContentResult(response.FileContent, response.ContentType);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ViewStudentDocument failed for {FileName}.", fileName);
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    ErrorBody("An error occurred while opening the student document.", ex));
            }
        }

        /// <summary>
        /// Download student document file.
        /// </summary>
        [HttpGet("DownloadStudentDocument")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DownloadStudentDocument(
            [FromQuery] string fileName,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return BadRequest(new { message = "File name is required." });
            }

            try
            {
                var response = await _documentService
                    .GetStudentDocumentFileAsync(fileName)
                    .ConfigureAwait(false);

                if (!response.IsSuccess)
                {
                    return NotFound(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DownloadStudentDocument failed for {FileName}.", fileName);
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    ErrorBody("An error occurred while downloading the student document.", ex));
            }
        }

        /// <summary>
        /// Current session lookup.
        /// </summary>
        [HttpPost("GetCurrentSession")]
        [ProducesResponseType(typeof(ScheduleLookupResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ScheduleLookupResponse>> GetCurrentSession(
            [FromBody] GetCurrentSessionRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.GetCurrentSessionAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetCurrentSession failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while getting the current session.", ex));
            }
        }

        /// <summary>
        /// Schedule / session dropdown lookup.
        /// </summary>
        [HttpPost("GetScheduleLookup")]
        [ProducesResponseType(typeof(ScheduleLookupResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ScheduleLookupResponse>> GetScheduleLookup(
            [FromBody] GetScheduleLookupRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.GetScheduleLookupAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetScheduleLookup failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while getting schedule lookup.", ex));
            }
        }

        /// <summary>
        /// Message center / email tracking update.
        /// </summary>
        [HttpPost("UpdateMessageCenter")]
        [ProducesResponseType(typeof(MessageCenterOperationResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<MessageCenterOperationResponse>> UpdateMessageCenter(
            [FromBody] UpdateMessageCenterRequest request,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (!ModelState.IsValid)
                return BadRequestValidation();

            try
            {
                var response = await _documentService.UpdateMessageCenterAsync(request).ConfigureAwait(false);
                return Ok(response);
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateMessageCenter failed.");
                return StatusCode(StatusCodes.Status500InternalServerError, ErrorBody("An error occurred while updating the message center.", ex));
            }
        }

        private ActionResult BadRequestValidation()
        {
            return BadRequest(new
            {
                message = "Invalid request data",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)),
            });
        }

        private static object ErrorBody(string message, Exception ex) =>
            new { message, error = ex.Message };
    }
}
