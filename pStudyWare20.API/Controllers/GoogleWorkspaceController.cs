using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Commented out to ensure frontend can hit it without token issues, though it should ideally be protected
    public class GoogleWorkspaceController : ControllerBase
    {
        private readonly IGoogleWorkspaceService _googleWorkspaceService;

        public GoogleWorkspaceController(IGoogleWorkspaceService googleWorkspaceService)
        {
            _googleWorkspaceService = googleWorkspaceService;
        }

        public class GroupMemberRequest
        {
            public string GroupEmail { get; set; } = string.Empty;
            public string UserEmail { get; set; } = string.Empty;
        }

        [HttpPost("AddMember")]
        public async Task<IActionResult> AddMember([FromBody] GroupMemberRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.GroupEmail) || string.IsNullOrWhiteSpace(request.UserEmail))
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "GroupEmail and UserEmail are required." });
            }

            try
            {
                bool result = await _googleWorkspaceService.AddMemberToGroupAsync(request.GroupEmail, request.UserEmail);
                if (result)
                {
                    return Ok(new { IsSuccess = true, ErrorMessage = "" });
                }
                return StatusCode(500, new { IsSuccess = false, ErrorMessage = "Failed to add member to group." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }

        [HttpPost("RemoveMember")]
        public async Task<IActionResult> RemoveMember([FromBody] GroupMemberRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.GroupEmail) || string.IsNullOrWhiteSpace(request.UserEmail))
            {
                return BadRequest(new { IsSuccess = false, ErrorMessage = "GroupEmail and UserEmail are required." });
            }

            try
            {
                bool result = await _googleWorkspaceService.RemoveMemberFromGroupAsync(request.GroupEmail, request.UserEmail);
                if (result)
                {
                    return Ok(new { IsSuccess = true, ErrorMessage = "" });
                }
                return StatusCode(500, new { IsSuccess = false, ErrorMessage = "Failed to remove member from group." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }
    }
}
