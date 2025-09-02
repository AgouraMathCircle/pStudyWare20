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
    }
}
