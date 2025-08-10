using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using pStudyWare20.Data.Models;
using pStudyWare20.Entity;
using pStudyWare20.Entity.Models;
using pStudyWare20.Repository.Interfaces;

namespace pStudyWare20.Repository.Implementations
{
    /// <summary>
    /// Repository implementation for donor data operations using EF Core
    /// </summary>
    public class DonorRepository : IDonorRepository
    {
        private readonly AMC_DBContext _context;
        private readonly ILogger<DonorRepository> _logger;

        public DonorRepository(AMC_DBContext context, ILogger<DonorRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get donors for a specific year using stored procedure
        /// </summary>
        public async Task<IEnumerable<Donor>> GetDonorsByYearAsync(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for year {year}");

                // Call the stored procedure using FromSqlRaw
                var dbDonors = await _context.AMC_tblDonors
                    .FromSqlRaw("EXEC AMC_spGetDonors @Year = {0}", year)
                    .ToListAsync();

                // Map to Donor entities using DonorMapper
                var donors = DonorMapper.MapFromDatabase(dbDonors);

                _logger.LogInformation($"Retrieved {donors.Count()} donors for year {year}");
                return donors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for year {year}");
                throw;
            }
        }

        /// <summary>
        /// Get donors for past years (before the specified year)
        /// </summary>
        public async Task<IEnumerable<Donor>> GetPastYearDonorsAsync(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for years before {year}");

                // Get donors from years before the specified year
                var dbDonors = await _context.AMC_tblDonors
                    .Where(d => d.Year < year)
                    .OrderByDescending(d => d.Year)
                    .ThenBy(d => d.DonorName)
                    .ToListAsync();

                // Map to Donor entities using DonorMapper
                var donors = DonorMapper.MapFromDatabase(dbDonors);

                _logger.LogInformation($"Retrieved {donors.Count()} donors for years before {year}");
                return donors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for years before {year}");
                throw;
            }
        }

        /// <summary>
        /// Add a new donor
        /// </summary>
        public async Task<Donor> AddDonorAsync(Donor donor)
        {
            try
            {
                _logger.LogInformation($"Adding new donor: {donor.Name}");

                // Map to database model using DonorMapper
                var dbDonor = DonorMapper.MapToDatabase(donor);
                if (dbDonor == null)
                {
                    throw new InvalidOperationException("Failed to map donor to database model");
                }

                // Add to database
                _context.AMC_tblDonors.Add(dbDonor);
                await _context.SaveChangesAsync();

                // Map back to entity with generated ID
                donor.Id = dbDonor.DonorID;

                _logger.LogInformation($"Successfully added donor with ID: {donor.Id}");
                return donor;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding donor: {donor.Name}");
                throw;
            }
        }

        /// <summary>
        /// Update an existing donor
        /// </summary>
        public async Task<Donor> UpdateDonorAsync(Donor donor)
        {
            try
            {
                _logger.LogInformation($"Updating donor with ID: {donor.Id}");

                // Find existing donor
                var existingDonor = await _context.AMC_tblDonors.FindAsync(donor.Id);
                if (existingDonor == null)
                {
                    throw new InvalidOperationException($"Donor with ID {donor.Id} not found");
                }

                // Map to database model using DonorMapper
                var updatedDbDonor = DonorMapper.MapToDatabase(donor);
                if (updatedDbDonor == null)
                {
                    throw new InvalidOperationException("Failed to map donor to database model");
                }

                // Update properties
                existingDonor.DonorName = updatedDbDonor.DonorName;
                existingDonor.Year = updatedDbDonor.Year;
                existingDonor.DonorLevel = updatedDbDonor.DonorLevel;
                existingDonor.PostedBy = updatedDbDonor.PostedBy;
                existingDonor.PostedDate = updatedDbDonor.PostedDate ?? DateTime.UtcNow;
                existingDonor.Semester = updatedDbDonor.Semester;

                // Save changes
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully updated donor with ID: {donor.Id}");
                return donor;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating donor with ID: {donor.Id}");
                throw;
            }
        }

        /// <summary>
        /// Delete a donor by ID
        /// </summary>
        public async Task<bool> DeleteDonorAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting donor with ID: {id}");

                // Find donor to delete
                var donor = await _context.AMC_tblDonors.FindAsync(id);
                if (donor == null)
                {
                    _logger.LogWarning($"Donor with ID {id} not found for deletion");
                    return false;
                }

                // Remove from database
                _context.AMC_tblDonors.Remove(donor);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully deleted donor with ID: {id}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting donor with ID: {id}");
                throw;
            }
        }

        /// <summary>
        /// Get all donors
        /// </summary>
        public async Task<IEnumerable<Donor>> GetAllDonorsAsync()
        {
            try
            {
                _logger.LogInformation("Getting all donors");

                var dbDonors = await _context.AMC_tblDonors
                    .OrderByDescending(d => d.Year)
                    .ThenBy(d => d.DonorName)
                    .ToListAsync();

                // Map to Donor entities using DonorMapper
                var donors = DonorMapper.MapFromDatabase(dbDonors);

                _logger.LogInformation($"Retrieved {donors.Count()} total donors");
                return donors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all donors");
                throw;
            }
        }

        /// <summary>
        /// Get a donor by ID
        /// </summary>
        public async Task<Donor> GetDonorByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Getting donor with ID: {id}");

                var dbDonor = await _context.AMC_tblDonors.FindAsync(id);
                if (dbDonor == null)
                {
                    _logger.LogWarning($"Donor with ID {id} not found");
                    return null;
                }

                // Map to Donor entity using DonorMapper
                var donor = DonorMapper.MapFromDatabase(dbDonor);

                _logger.LogInformation($"Retrieved donor with ID: {id}");
                return donor ?? throw new InvalidOperationException($"Failed to map donor with ID {id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donor with ID: {id}");
                throw;
            }
        }

        /// <summary>
        /// Get donors by donation level
        /// </summary>
        public async Task<IEnumerable<Donor>> GetDonorsByLevelAsync(string level)
        {
            try
            {
                _logger.LogInformation($"Getting donors for level: {level}");

                var dbDonors = await _context.AMC_tblDonors
                    .Where(d => d.DonorLevel == level)
                    .OrderByDescending(d => d.Year)
                    .ThenBy(d => d.DonorName)
                    .ToListAsync();

                // Map to Donor entities using DonorMapper
                var donors = DonorMapper.MapFromDatabase(dbDonors);

                _logger.LogInformation($"Retrieved {donors.Count()} donors for level: {level}");
                return donors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for level: {level}");
                throw;
            }
        }

        /// <summary>
        /// Get all donors grouped by year and donation levels using stored procedure (refactored from Donate.aspx.cs)
        /// </summary>
        public async Task<DonorsByYearWithLevelsDto> GetAllDonorsGroupedByYearAndLevelsAsync()
        {
            try
            {
                _logger.LogInformation("Getting all donors grouped by year and donation levels using stored procedure");

                // Call the stored procedure using FromSqlRaw (without year parameter to match original logic)
                var dbDonors = await _context.AMC_tblDonors
                    .FromSqlRaw("EXEC AMC_spGetDonors")
                    .ToListAsync();

                // Map to Donor entities using DonorMapper
                var allDonors = DonorMapper.MapFromDatabase(dbDonors).ToList();

                if (!allDonors.Any())
                {
                    return new DonorsByYearWithLevelsDto
                    {
                        Year = DateTime.Now.Year,
                        DiamondDonors = new List<DonorDto>(),
                        PlatinumDonors = new List<DonorDto>(),
                        GoldDonors = new List<DonorDto>(),
                        SilverDonors = new List<DonorDto>(),
                        BronzeDonors = new List<DonorDto>(),
                        TotalDonors = 0,
                        TotalAmount = 0
                    };
                }

                // Get the current year (most recent year with donors)
                var currentYear = allDonors.Max(d => d.Year);

                // Filter donors for the current year
                var currentYearDonors = allDonors.Where(d => d.Year == currentYear).ToList();

                // Group donors by donation level for the current year
                var diamondDonors = currentYearDonors.Where(d => d.DonationLevel == DonationLevel.Diamond).ToList();
                var platinumDonors = currentYearDonors.Where(d => d.DonationLevel == DonationLevel.Platinum).ToList();
                var goldDonors = currentYearDonors.Where(d => d.DonationLevel == DonationLevel.Gold).ToList();
                var silverDonors = currentYearDonors.Where(d => d.DonationLevel == DonationLevel.Silver).ToList();
                var bronzeDonors = currentYearDonors.Where(d => d.DonationLevel == DonationLevel.Bronze).ToList();

                // Create the response DTO
                var response = new DonorsByYearWithLevelsDto
                {
                    Year = currentYear,
                    TotalDonors = currentYearDonors.Count,
                    TotalAmount = currentYearDonors.Sum(d => d.MinAmount)
                };

                // Map to DTOs and assign to response
                response.DiamondDonors = diamondDonors.Select(d => new DonorDto
                {
                    DonorId = d.Id,
                    DonorName = d.Name,
                    DonorLevel = d.DonationLevel.ToString(),
                    Year = d.Year,
                    PostedBy = d.PostedBy,
                    PostedDate = d.PostedDate,
                    Semester = d.Semester
                }).ToList();

                response.PlatinumDonors = platinumDonors.Select(d => new DonorDto
                {
                    DonorId = d.Id,
                    DonorName = d.Name,
                    DonorLevel = d.DonationLevel.ToString(),
                    Year = d.Year,
                    PostedBy = d.PostedBy,
                    PostedDate = d.PostedDate,
                    Semester = d.Semester
                }).ToList();

                response.GoldDonors = goldDonors.Select(d => new DonorDto
                {
                    DonorId = d.Id,
                    DonorName = d.Name,
                    DonorLevel = d.DonationLevel.ToString(),
                    Year = d.Year,
                    PostedBy = d.PostedBy,
                    PostedDate = d.PostedDate,
                    Semester = d.Semester
                }).ToList();

                response.SilverDonors = silverDonors.Select(d => new DonorDto
                {
                    DonorId = d.Id,
                    DonorName = d.Name,
                    DonorLevel = d.DonationLevel.ToString(),
                    Year = d.Year,
                    PostedBy = d.PostedBy,
                    PostedDate = d.PostedDate,
                    Semester = d.Semester
                }).ToList();

                response.BronzeDonors = bronzeDonors.Select(d => new DonorDto
                {
                    DonorId = d.Id,
                    DonorName = d.Name,
                    DonorLevel = d.DonationLevel.ToString(),
                    Year = d.Year,
                    PostedBy = d.PostedBy,
                    PostedDate = d.PostedDate,
                    Semester = d.Semester
                }).ToList();

                _logger.LogInformation($"Successfully retrieved {currentYearDonors.Count} donors for year {currentYear} grouped by donation levels");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all donors grouped by year and donation levels");
                throw;
            }
        }
    }
}
