using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    /// <summary>
    /// Controller for Donate functionality
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class DonateController : ControllerBase
    {
        private readonly IDonateService _donateService;

        public DonateController(IDonateService donateService)
        {
            _donateService = donateService ?? throw new ArgumentNullException(nameof(donateService));
        }

        /// <summary>
        /// Gets all donors data
        /// </summary>
        /// <returns>GetDonorsResponse containing donor information</returns>
        [HttpGet("GetAllDonors")]
        public async Task<ActionResult<GetDonorsResponse>> GetAllDonors()
        {
            try
            {
                var response = await _donateService.GetDonorsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetDonorsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets donors by specific year
        /// </summary>
        /// <param name="year">Year to filter by</param>
        /// <returns>GetDonorsByYearResponse containing donors for the year</returns>
        [HttpGet("GetDonorsByYear/{year}")]
        public async Task<ActionResult<GetDonorsByYearResponse>> GetDonorsByYear(int year)
        {
            try
            {
                var request = new GetDonorsByYearRequest { Year = year };
                var response = await _donateService.GetDonorsByYearAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetDonorsByYearResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}",
                    Year = year
                });
            }
        }

        /// <summary>
        /// Gets donors by specific level
        /// </summary>
        /// <param name="request">Request containing level and optional year filter</param>
        /// <returns>GetDonorsByLevelResponse containing donors for the level</returns>
        [HttpPost("GetDonorsByLevel")]
        public async Task<ActionResult<GetDonorsByLevelResponse>> GetDonorsByLevel([FromBody] GetDonorsByLevelRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Level))
                {
                    return BadRequest(new GetDonorsByLevelResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Level is required"
                    });
                }

                var response = await _donateService.GetDonorsByLevelAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetDonorsByLevelResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}",
                    Level = request?.Level ?? string.Empty,
                    Year = request?.Year
                });
            }
        }

        /// <summary>
        /// Gets donate dashboard data
        /// </summary>
        /// <param name="request">Request for dashboard data</param>
        /// <returns>DonateDashboardResponse containing dashboard information</returns>
        [HttpPost("GetDashboard")]
        public async Task<ActionResult<DonateDashboardResponse>> GetDashboard([FromBody] DonateDashboardRequest request)
        {
            try
            {
                request ??= new DonateDashboardRequest();
                var response = await _donateService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DonateDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets donate statistics
        /// </summary>
        /// <param name="request">Request for statistics data</param>
        /// <returns>DonateStatsResponse containing statistics</returns>
        [HttpPost("GetStats")]
        public async Task<ActionResult<DonateStatsResponse>> GetStats([FromBody] DonateStatsRequest request)
        {
            try
            {
                request ??= new DonateStatsRequest();
                var response = await _donateService.GetDonateStatsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DonateStatsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Checks donate privileges for the current user
        /// </summary>
        /// <returns>DonatePrivilegesResponse containing privilege information</returns>
        [HttpGet("CheckPrivileges")]
        public async Task<ActionResult<DonatePrivilegesResponse>> CheckPrivileges()
        {
            try
            {
                var response = await _donateService.CheckDonatePrivilegesAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DonatePrivilegesResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets all donors data (POST method for complex requests)
        /// </summary>
        /// <param name="request">Request containing optional filters</param>
        /// <returns>GetDonorsResponse containing donor information</returns>
        [HttpPost("GetDonors")]
        public async Task<ActionResult<GetDonorsResponse>> GetDonors([FromBody] GetDonorsRequest request)
        {
            try
            {
                var response = await _donateService.GetDonorsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetDonorsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets donors by year (POST method)
        /// </summary>
        /// <param name="request">Request containing year filter</param>
        /// <returns>GetDonorsByYearResponse containing donors for the year</returns>
        [HttpPost("GetDonorsByYear")]
        public async Task<ActionResult<GetDonorsByYearResponse>> GetDonorsByYearPost([FromBody] GetDonorsByYearRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new GetDonorsByYearResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Request is required"
                    });
                }

                var response = await _donateService.GetDonorsByYearAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetDonorsByYearResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}",
                    Year = request?.Year ?? 0
                });
            }
        }

        /// <summary>
        /// Gets donate dashboard data (GET method)
        /// </summary>
        /// <returns>DonateDashboardResponse containing dashboard information</returns>
        [HttpGet("GetDashboard")]
        public async Task<ActionResult<DonateDashboardResponse>> GetDashboardData()
        {
            try
            {
                var request = new DonateDashboardRequest { IncludeStatistics = true };
                var response = await _donateService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DonateDashboardResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets donate statistics (GET method)
        /// </summary>
        /// <param name="year">Optional year filter</param>
        /// <returns>DonateStatsResponse containing statistics</returns>
        [HttpGet("GetStats")]
        public async Task<ActionResult<DonateStatsResponse>> GetStats(int? year = null)
        {
            try
            {
                var request = new DonateStatsRequest { Year = year };
                var response = await _donateService.GetDonateStatsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new DonateStatsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Internal server error: {ex.Message}"
                });
            }
        }
    }
}
