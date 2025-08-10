using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.ComponentModel;
using pStudyWare20.Entity;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Entity.Models;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class DonorsController : ControllerBase
    {
        private readonly IDonorService _donorService;
        private readonly ILogger<DonorsController> _logger;

        public DonorsController(IDonorService donorService, ILogger<DonorsController> logger)
        {
            _donorService = donorService;
            _logger = logger;
        }

        /// <summary>
        /// Get all donors grouped by year and category
        /// </summary>
        /// <returns>Donor data grouped by year and category</returns>
        [HttpGet("grouped")]
        [Description("Get all donors grouped by year and category")]
        public async Task<ActionResult<DonorsResponseDto>> GetDonorsGrouped()
        {
            try
            {
                _logger.LogInformation("Getting all donors grouped by year and category");

                var response = await _donorService.GetDonorsGroupedAsync();

                _logger.LogInformation("Successfully retrieved donors grouped by year and category");

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting donors grouped by year and category");
                return StatusCode(500, new { message = "An error occurred while retrieving donors", error = ex.Message });
            }
        }









        /// <summary>
        /// Add a new donor
        /// </summary>
        /// <param name="donor">The donor to add</param>
        /// <returns>The created donor</returns>
        [HttpPost]
        [Description("Add a new donor")]
        public async Task<ActionResult<Donor>> AddDonor([FromBody] Donor donor)
        {
            try
            {
                _logger.LogInformation($"Adding new donor: {donor.Name}");

                if (donor == null)
                {
                    return BadRequest(new { message = "Donor data is required" });
                }

                var addedDonor = await _donorService.AddDonorAsync(donor);

                _logger.LogInformation($"Successfully added donor with ID: {addedDonor.Id}");

                return CreatedAtAction(nameof(GetDonorById), new { id = addedDonor.Id }, addedDonor);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Validation error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding donor: {donor?.Name}");
                return StatusCode(500, new { message = "An error occurred while adding the donor", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing donor
        /// </summary>
        /// <param name="id">The ID of the donor to update</param>
        /// <param name="donor">The updated donor data</param>
        /// <returns>The updated donor</returns>
        [HttpPut("{id}")]
        [Description("Update an existing donor")]
        public async Task<ActionResult<Donor>> UpdateDonor(int id, [FromBody] Donor donor)
        {
            try
            {
                _logger.LogInformation($"Updating donor with ID: {id}");

                if (donor == null)
                {
                    return BadRequest(new { message = "Donor data is required" });
                }

                // Ensure the ID in the URL matches the donor object
                donor.Id = id;

                var updatedDonor = await _donorService.UpdateDonorAsync(donor);

                _logger.LogInformation($"Successfully updated donor with ID: {updatedDonor.Id}");

                return Ok(updatedDonor);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Validation error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating donor with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while updating the donor", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a donor
        /// </summary>
        /// <param name="id">The ID of the donor to delete</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        [Description("Delete a donor")]
        public async Task<ActionResult> DeleteDonor(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting donor with ID: {id}");

                var result = await _donorService.DeleteDonorAsync(id);

                if (!result)
                {
                    return NotFound(new { message = $"Donor with ID {id} not found" });
                }

                _logger.LogInformation($"Successfully deleted donor with ID: {id}");

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Business rule violation: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting donor with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while deleting the donor", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a donor by ID
        /// </summary>
        /// <param name="id">The ID of the donor</param>
        /// <returns>The donor if found</returns>
        [HttpGet("{id}")]
        [Description("Get a donor by ID")]
        public async Task<ActionResult<Donor>> GetDonorById(int id)
        {
            try
            {
                _logger.LogInformation($"Getting donor with ID: {id}");

                var donor = await _donorService.GetDonorByIdAsync(id);

                if (donor == null)
                {
                    return NotFound(new { message = $"Donor with ID {id} not found" });
                }

                _logger.LogInformation($"Successfully retrieved donor with ID: {id}");

                return Ok(donor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donor with ID: {id}");
                return StatusCode(500, new { message = "An error occurred while retrieving the donor", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all donors
        /// </summary>
        /// <returns>All donors</returns>
        [HttpGet]
        [Description("Get all donors")]
        public async Task<ActionResult<IEnumerable<Donor>>> GetAllDonors()
        {
            try
            {
                _logger.LogInformation("Getting all donors");

                var donors = await _donorService.GetAllDonorsAsync();

                _logger.LogInformation($"Successfully retrieved {donors.Count()} total donors");

                return Ok(donors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all donors");
                return StatusCode(500, new { message = "An error occurred while retrieving donors", error = ex.Message });
            }
        }



        /// <summary>
        /// Get donor statistics
        /// </summary>
        /// <returns>Donor statistics</returns>
        [HttpGet("statistics")]
        [Description("Get donor statistics")]
        public async Task<ActionResult<object>> GetDonorStatistics()
        {
            try
            {
                _logger.LogInformation("Getting donor statistics");

                var statistics = await _donorService.GetDonorStatisticsAsync();

                _logger.LogInformation("Successfully retrieved donor statistics");

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting donor statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving donor statistics", error = ex.Message });
            }
        }

        /// <summary>
        /// Get donors by specific year with grouping
        /// </summary>
        /// <param name="year">The year to filter donors</param>
        /// <returns>Donors grouped by year</returns>
        [HttpGet("year/{year}/grouped")]
        [Description("Get donors by specific year with grouping")]
        public async Task<ActionResult<DonorsByYearDto>> GetDonorsByYearGrouped(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for year {year} with grouping");

                var response = await _donorService.GetDonorsByYearGroupedAsync(year);

                if (response.TotalDonors == 0)
                {
                    return NotFound(new { message = $"No donors found for year {year}" });
                }

                _logger.LogInformation($"Successfully retrieved {response.TotalDonors} donors for year {year} with grouping");

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid year parameter: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for year {year} with grouping");
                return StatusCode(500, new { message = "An error occurred while retrieving donors", error = ex.Message });
            }
        }

        /// <summary>
        /// Get donors by specific category with grouping
        /// </summary>
        /// <param name="category">The category to filter donors</param>
        /// <returns>Donors grouped by category</returns>
        [HttpGet("category/{category}/grouped")]
        [Description("Get donors by specific category with grouping")]
        public async Task<ActionResult<DonorsByCategoryDto>> GetDonorsByCategoryGrouped(string category)
        {
            try
            {
                _logger.LogInformation($"Getting donors for category {category} with grouping");

                var response = await _donorService.GetDonorsByCategoryGroupedAsync(category);

                if (response.TotalDonors == 0)
                {
                    return NotFound(new { message = $"No donors found for category {category}" });
                }

                _logger.LogInformation($"Successfully retrieved {response.TotalDonors} donors for category {category} with grouping");

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Invalid category parameter: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for category {category}");
                return StatusCode(500, new { message = "An error occurred while retrieving donors", error = ex.Message });
            }
        }

        /// <summary>
        /// Get available years for donors
        /// </summary>
        /// <returns>List of available years</returns>
        [HttpGet("years")]
        [Description("Get available years for donors")]
        public async Task<ActionResult<List<int>>> GetAvailableYears()
        {
            try
            {
                _logger.LogInformation("Getting available years for donors");

                var years = await _donorService.GetAvailableYearsAsync();

                _logger.LogInformation($"Successfully retrieved {years.Count} available years");

                return Ok(years);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available years for donors");
                return StatusCode(500, new { message = "An error occurred while retrieving available years", error = ex.Message });
            }
        }

        /// <summary>
        /// Get donors by specific year with levels grouped by donation levels (refactored from Donate.aspx.cs)
        /// </summary>
        /// <param name="year">The year to filter donors</param>
        /// <returns>Donors grouped by donation levels for the specified year</returns>
        [HttpGet("year/{year}/levels")]
        [Description("Get donors by specific year grouped by donation levels (refactored from Donate.aspx.cs)")]
        public async Task<ActionResult<DonorsByYearWithLevelsDto>> GetDonorsByYearWithLevels(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for year {year} grouped by donation levels");

                var response = await _donorService.GetDonorsByYearWithLevelsAsync(year);

                if (response == null)
                {
                    return NotFound($"No donors found for year {year}");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for year {year} grouped by donation levels");
                return StatusCode(500, "An error occurred while retrieving donors");
            }
        }

        /// <summary>
        /// Get all donors grouped by year and donation levels using stored procedure (refactored from Donate.aspx.cs)
        /// </summary>
        /// <returns>All donors grouped by year and donation levels</returns>
        [HttpGet("grouped-by-year-and-levels")]
        [Description("Get all donors grouped by year and donation levels using stored procedure (refactored from Donate.aspx.cs)")]
        public async Task<ActionResult<DonorsByYearWithLevelsDto>> GetAllDonorsGroupedByYearAndLevels()
        {
            try
            {
                _logger.LogInformation("Getting all donors grouped by year and donation levels using stored procedure");

                var response = await _donorService.GetAllDonorsGroupedByYearAndLevelsAsync();

                if (response == null)
                {
                    return NotFound("No donors found");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all donors grouped by year and donation levels");
                return StatusCode(500, "An error occurred while retrieving donors");
            }
        }

        /// <summary>
        /// Get current year donors grouped by donation levels
        /// </summary>
        /// <param name="year">The current year to get donors for</param>
        /// <returns>Current year donors grouped by donation levels</returns>
        [HttpGet("current/{year}")]
        [Description("Get current year donors grouped by donation levels")]
        public async Task<ActionResult<DonorsByYearWithLevelsDto>> GetCurrentYearDonors(int year)
        {
            try
            {
                _logger.LogInformation($"Getting current year donors for year {year}");

                var response = await _donorService.GetDonorsByYearWithLevelsAsync(year);

                if (response == null)
                {
                    return NotFound($"No donors found for year {year}");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting current year donors for year {year}");
                return StatusCode(500, "An error occurred while retrieving current year donors");
            }
        }

        /// <summary>
        /// Get past year donors grouped by donation levels
        /// </summary>
        /// <param name="year">The past year to get donors for</param>
        /// <returns>Past year donors grouped by donation levels</returns>
        [HttpGet("past/{year}")]
        [Description("Get past year donors grouped by donation levels")]
        public async Task<ActionResult<DonorsByYearWithLevelsDto>> GetPastYearDonors(int year)
        {
            try
            {
                _logger.LogInformation($"Getting past year donors for year {year}");

                var response = await _donorService.GetDonorsByYearWithLevelsAsync(year);

                if (response == null)
                {
                    return NotFound($"No donors found for year {year}");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting past year donors for year {year}");
                return StatusCode(500, "An error occurred while retrieving past year donors");
            }
        }

        /// <summary>
        /// Get available donor categories (levels)
        /// </summary>
        /// <returns>List of available categories</returns>
        [HttpGet("categories")]
        [Description("Get available donor categories (levels)")]
        public async Task<ActionResult<List<string>>> GetAvailableCategories()
        {
            try
            {
                _logger.LogInformation("Getting available donor categories");

                var categories = await _donorService.GetAvailableCategoriesAsync();

                _logger.LogInformation($"Successfully retrieved {categories.Count} available categories");

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available donor categories");
                return StatusCode(500, new { message = "An error occurred while retrieving available categories", error = ex.Message });
            }
        }
    }
}
