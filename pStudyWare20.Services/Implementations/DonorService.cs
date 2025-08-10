using Microsoft.Extensions.Logging;
using pStudyWare20.Entity;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Entity.Models;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Service implementation for donor business operations
    /// </summary>
    public class DonorService : IDonorService
    {
        private readonly IDonorRepository _donorRepository;
        private readonly ILogger<DonorService> _logger;

        public DonorService(IDonorRepository donorRepository, ILogger<DonorService> logger)
        {
            _donorRepository = donorRepository;
            _logger = logger;
        }

        /// <summary>
        /// Get donors for a specific year with business logic
        /// </summary>
        public async Task<IEnumerable<Donor>> GetDonorsByYearAsync(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for year {year} with business logic");

                // Business logic: Validate year
                if (year < 1900 || year > DateTime.Now.Year + 1)
                {
                    throw new ArgumentException($"Invalid year: {year}. Year must be between 1900 and {DateTime.Now.Year + 1}");
                }

                var donors = await _donorRepository.GetDonorsByYearAsync(year);

                // Business logic: Sort by donation level (Diamond first, then Platinum, etc.)
                var sortedDonors = donors.OrderByDescending(d => (int)d.DonationLevel)
                                       .ThenBy(d => d.Name)
                                       .ToList();

                _logger.LogInformation($"Retrieved {sortedDonors.Count} donors for year {year}");
                return sortedDonors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for year {year}");
                throw;
            }
        }

        /// <summary>
        /// Get donors for past years with business logic
        /// </summary>
        public async Task<IEnumerable<Donor>> GetPastYearDonorsAsync(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for years before {year} with business logic");

                // Business logic: Validate year
                if (year < 1900 || year > DateTime.Now.Year + 1)
                {
                    throw new ArgumentException($"Invalid year: {year}. Year must be between 1900 and {DateTime.Now.Year + 1}");
                }

                var donors = await _donorRepository.GetPastYearDonorsAsync(year);

                // Business logic: Group by year and sort by donation level within each year
                var groupedDonors = donors.GroupBy(d => d.Year)
                                        .OrderByDescending(g => g.Key)
                                        .SelectMany(g => g.OrderByDescending(d => (int)d.DonationLevel)
                                                         .ThenBy(d => d.Name))
                                        .ToList();

                _logger.LogInformation($"Retrieved {groupedDonors.Count} donors for years before {year}");
                return groupedDonors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for years before {year}");
                throw;
            }
        }

        /// <summary>
        /// Get donors for a specific year grouped by donation levels (refactored from Donate.aspx.cs)
        /// </summary>
        public async Task<DonorsByYearWithLevelsDto> GetDonorsByYearWithLevelsAsync(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for year {year} grouped by donation levels");

                // Business logic: Validate year
                if (year < 1900 || year > DateTime.Now.Year + 1)
                {
                    throw new ArgumentException($"Invalid year: {year}. Year must be between 1900 and {DateTime.Now.Year + 1}");
                }

                // Get all donors for the specified year
                var allDonors = await _donorRepository.GetDonorsByYearAsync(year);
                var donorsList = allDonors.ToList();

                // Create the response DTO
                var response = new DonorsByYearWithLevelsDto
                {
                    Year = year,
                    TotalDonors = donorsList.Count,
                    TotalAmount = donorsList.Sum(d => d.MinAmount)
                };

                // Group donors by donation level (refactored from Donate.aspx.cs logic)
                var diamondDonors = donorsList.Where(d => d.DonationLevel == DonationLevel.Diamond).ToList();
                var platinumDonors = donorsList.Where(d => d.DonationLevel == DonationLevel.Platinum).ToList();
                var goldDonors = donorsList.Where(d => d.DonationLevel == DonationLevel.Gold).ToList();
                var silverDonors = donorsList.Where(d => d.DonationLevel == DonationLevel.Silver).ToList();
                var bronzeDonors = donorsList.Where(d => d.DonationLevel == DonationLevel.Bronze).ToList();

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

                _logger.LogInformation($"Successfully retrieved {donorsList.Count} donors for year {year} grouped by donation levels");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for year {year} grouped by donation levels");
                throw;
            }
        }

        /// <summary>
        /// Add a new donor with validation and business logic
        /// </summary>
        public async Task<Donor> AddDonorAsync(Donor donor)
        {
            try
            {
                _logger.LogInformation($"Adding new donor: {donor.Name} with business logic");

                // Validate donor
                var (isValid, errors) = await ValidateDonorAsync(donor);
                if (!isValid)
                {
                    throw new InvalidOperationException($"Donor validation failed: {string.Join(", ", errors)}");
                }

                // Business logic: Set default values
                donor.PostedDate = donor.PostedDate ?? DateTime.UtcNow;
                donor.Semester = string.IsNullOrWhiteSpace(donor.Semester) ? "Unknown" : donor.Semester;

                // Business logic: Check for duplicate donors in the same year
                var existingDonors = await _donorRepository.GetDonorsByYearAsync(donor.Year);
                var duplicate = existingDonors.FirstOrDefault(d =>
                    d.Name.Equals(donor.Name, StringComparison.OrdinalIgnoreCase) &&
                    d.DonationLevel == donor.DonationLevel);

                if (duplicate != null)
                {
                    throw new InvalidOperationException($"A donor with name '{donor.Name}' and level '{donor.DonationLevel}' already exists for year {donor.Year}");
                }

                var addedDonor = await _donorRepository.AddDonorAsync(donor);

                _logger.LogInformation($"Successfully added donor with ID: {addedDonor.Id}");
                return addedDonor;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding donor: {donor.Name}");
                throw;
            }
        }

        /// <summary>
        /// Update an existing donor with validation and business logic
        /// </summary>
        public async Task<Donor> UpdateDonorAsync(Donor donor)
        {
            try
            {
                _logger.LogInformation($"Updating donor with ID: {donor.Id} with business logic");

                // Validate donor
                var (isValid, errors) = await ValidateDonorAsync(donor);
                if (!isValid)
                {
                    throw new InvalidOperationException($"Donor validation failed: {string.Join(", ", errors)}");
                }

                // Business logic: Check if donor exists
                var existingDonor = await _donorRepository.GetDonorByIdAsync(donor.Id);
                if (existingDonor == null)
                {
                    throw new InvalidOperationException($"Donor with ID {donor.Id} not found");
                }

                // Business logic: Check for duplicate donors in the same year (excluding current donor)
                var existingDonors = await _donorRepository.GetDonorsByYearAsync(donor.Year);
                var duplicate = existingDonors.FirstOrDefault(d =>
                    d.Id != donor.Id &&
                    d.Name.Equals(donor.Name, StringComparison.OrdinalIgnoreCase) &&
                    d.DonationLevel == donor.DonationLevel);

                if (duplicate != null)
                {
                    throw new InvalidOperationException($"A donor with name '{donor.Name}' and level '{donor.DonationLevel}' already exists for year {donor.Year}");
                }

                var updatedDonor = await _donorRepository.UpdateDonorAsync(donor);

                _logger.LogInformation($"Successfully updated donor with ID: {updatedDonor.Id}");
                return updatedDonor;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating donor with ID: {donor.Id}");
                throw;
            }
        }

        /// <summary>
        /// Delete a donor by ID with business logic validation
        /// </summary>
        public async Task<bool> DeleteDonorAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting donor with ID: {id} with business logic");

                // Business logic: Check if donor exists
                var existingDonor = await _donorRepository.GetDonorByIdAsync(id);
                if (existingDonor == null)
                {
                    _logger.LogWarning($"Donor with ID {id} not found for deletion");
                    return false;
                }

                // Business logic: Prevent deletion of donors from current year (optional business rule)
                if (existingDonor.Year == DateTime.Now.Year)
                {
                    throw new InvalidOperationException($"Cannot delete donors from the current year ({DateTime.Now.Year})");
                }

                var result = await _donorRepository.DeleteDonorAsync(id);

                _logger.LogInformation($"Successfully deleted donor with ID: {id}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting donor with ID: {id}");
                throw;
            }
        }

        /// <summary>
        /// Get all donors with business logic
        /// </summary>
        public async Task<IEnumerable<Donor>> GetAllDonorsAsync()
        {
            try
            {
                _logger.LogInformation("Getting all donors with business logic");

                var donors = await _donorRepository.GetAllDonorsAsync();

                // Business logic: Sort by year (descending), then by donation level, then by name
                var sortedDonors = donors.OrderByDescending(d => d.Year)
                                       .ThenByDescending(d => (int)d.DonationLevel)
                                       .ThenBy(d => d.Name)
                                       .ToList();

                _logger.LogInformation($"Retrieved {sortedDonors.Count} total donors");
                return sortedDonors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all donors");
                throw;
            }
        }

        /// <summary>
        /// Get a donor by ID with business logic
        /// </summary>
        public async Task<Donor> GetDonorByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Getting donor with ID: {id} with business logic");

                var donor = await _donorRepository.GetDonorByIdAsync(id);

                if (donor == null)
                {
                    _logger.LogWarning($"Donor with ID {id} not found");
                    return null;
                }

                _logger.LogInformation($"Retrieved donor with ID: {id}");
                return donor;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donor with ID: {id}");
                throw;
            }
        }

        /// <summary>
        /// Get donors by donation level with business logic
        /// </summary>
        public async Task<IEnumerable<Donor>> GetDonorsByLevelAsync(string level)
        {
            try
            {
                _logger.LogInformation($"Getting donors for level: {level} with business logic");

                // Business logic: Validate donation level
                if (string.IsNullOrWhiteSpace(level))
                {
                    throw new ArgumentException("Donation level cannot be null or empty");
                }

                var donors = await _donorRepository.GetDonorsByLevelAsync(level);

                // Business logic: Sort by year (descending), then by name
                var sortedDonors = donors.OrderByDescending(d => d.Year)
                                       .ThenBy(d => d.Name)
                                       .ToList();

                _logger.LogInformation($"Retrieved {sortedDonors.Count} donors for level: {level}");
                return sortedDonors;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for level: {level}");
                throw;
            }
        }

        /// <summary>
        /// Validate donor data
        /// </summary>
        public async Task<(bool IsValid, List<string> Errors)> ValidateDonorAsync(Donor donor)
        {
            var errors = new List<string>();

            if (donor == null)
            {
                errors.Add("Donor cannot be null");
                return (false, errors);
            }

            // Validate name
            if (string.IsNullOrWhiteSpace(donor.Name))
            {
                errors.Add("Donor name is required");
            }
            else if (donor.Name.Length > 100)
            {
                errors.Add("Donor name cannot exceed 100 characters");
            }

            // Validate year
            if (donor.Year < 1900 || donor.Year > DateTime.Now.Year + 1)
            {
                errors.Add($"Year must be between 1900 and {DateTime.Now.Year + 1}");
            }

            // Validate donation level
            if (!Enum.IsDefined(typeof(DonationLevel), donor.DonationLevel))
            {
                errors.Add("Invalid donation level");
            }

            // Validate posted by
            if (string.IsNullOrWhiteSpace(donor.PostedBy))
            {
                errors.Add("PostedBy is required");
            }

            // Validate semester
            if (!string.IsNullOrWhiteSpace(donor.Semester) && donor.Semester.Length > 50)
            {
                errors.Add("Semester cannot exceed 50 characters");
            }

            return (errors.Count == 0, errors);
        }

        /// <summary>
        /// Get donor statistics
        /// </summary>
        public async Task<object> GetDonorStatisticsAsync()
        {
            try
            {
                _logger.LogInformation("Getting donor statistics");

                var allDonors = await _donorRepository.GetAllDonorsAsync();
                var donorsList = allDonors.ToList();

                var statistics = new
                {
                    TotalDonors = donorsList.Count,
                    TotalYears = donorsList.Select(d => d.Year).Distinct().Count(),
                    DonorsByLevel = donorsList.GroupBy(d => d.DonationLevel)
                                            .Select(g => new
                                            {
                                                Level = g.Key.ToString(),
                                                Count = g.Count(),
                                                TotalAmount = g.Sum(d => d.MinAmount)
                                            })
                                            .OrderByDescending(x => x.Count)
                                            .ToList(),
                    DonorsByYear = donorsList.GroupBy(d => d.Year)
                                           .Select(g => new
                                           {
                                               Year = g.Key,
                                               Count = g.Count(),
                                               TotalAmount = g.Sum(d => d.MinAmount)
                                           })
                                           .OrderByDescending(x => x.Year)
                                           .ToList(),
                    RecentDonors = donorsList.Where(d => d.PostedDate >= DateTime.UtcNow.AddDays(-30))
                                           .Count(),
                    LastUpdated = DateTime.UtcNow
                };

                _logger.LogInformation("Successfully retrieved donor statistics");
                return statistics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting donor statistics");
                throw;
            }
        }

        /// <summary>
        /// Get all donors grouped by year and category
        /// </summary>
        public async Task<DonorsResponseDto> GetDonorsGroupedAsync()
        {
            try
            {
                _logger.LogInformation("Getting all donors grouped by year and category");

                var allDonors = await _donorRepository.GetAllDonorsAsync();
                var donorsList = allDonors.ToList();

                if (!donorsList.Any())
                {
                    return new DonorsResponseDto
                    {
                        DonorsByYear = new List<DonorsByYearDto>(),
                        DonorsByCategory = new List<DonorsByCategoryDto>(),
                        TotalDonors = 0,
                        TotalAmount = 0,
                        LastUpdated = DateTime.UtcNow
                    };
                }

                // Group donors by year
                var donorsByYear = donorsList
                    .GroupBy(d => d.Year)
                    .Select(g => new DonorsByYearDto
                    {
                        Year = g.Key,
                        Donors = g.Select(d => new DonorDto
                        {
                            DonorId = d.Id,
                            DonorName = d.Name,
                            DonorLevel = d.DonationLevel.ToString(),
                            Year = d.Year,
                            PostedBy = d.PostedBy,
                            PostedDate = d.PostedDate,
                            Semester = d.Semester
                        }).ToList(),
                        TotalDonors = g.Count(),
                        TotalAmount = g.Sum(d => d.MinAmount)
                    })
                    .OrderByDescending(g => g.Year)
                    .ToList();

                // Group donors by category (donor level)
                var donorsByCategory = donorsList
                    .GroupBy(d => d.DonationLevel)
                    .Select(g => new DonorsByCategoryDto
                    {
                        Category = g.Key.ToString(),
                        Donors = g.Select(d => new DonorDto
                        {
                            DonorId = d.Id,
                            DonorName = d.Name,
                            DonorLevel = d.DonationLevel.ToString(),
                            Year = d.Year,
                            PostedBy = d.PostedBy,
                            PostedDate = d.PostedDate,
                            Semester = d.Semester
                        }).ToList(),
                        TotalDonors = g.Count(),
                        TotalAmount = g.Sum(d => d.MinAmount)
                    })
                    .OrderBy(g => g.Category)
                    .ToList();

                var response = new DonorsResponseDto
                {
                    DonorsByYear = donorsByYear,
                    DonorsByCategory = donorsByCategory,
                    TotalDonors = donorsList.Count,
                    TotalAmount = donorsList.Sum(d => d.MinAmount),
                    LastUpdated = DateTime.UtcNow
                };

                _logger.LogInformation($"Successfully retrieved {donorsList.Count} donors grouped by year and category");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting donors grouped by year and category");
                throw;
            }
        }

        /// <summary>
        /// Get donors by specific year with grouping
        /// </summary>
        public async Task<DonorsByYearDto> GetDonorsByYearGroupedAsync(int year)
        {
            try
            {
                _logger.LogInformation($"Getting donors for year {year} with grouping");

                var donors = await _donorRepository.GetDonorsByYearAsync(year);
                var donorsList = donors.ToList();

                if (!donorsList.Any())
                {
                    return new DonorsByYearDto
                    {
                        Year = year,
                        Donors = new List<DonorDto>(),
                        TotalDonors = 0,
                        TotalAmount = 0
                    };
                }

                var response = new DonorsByYearDto
                {
                    Year = year,
                    Donors = donorsList.Select(d => new DonorDto
                    {
                        DonorId = d.Id,
                        DonorName = d.Name,
                        DonorLevel = d.DonationLevel.ToString(),
                        Year = d.Year,
                        PostedBy = d.PostedBy,
                        PostedDate = d.PostedDate,
                        Semester = d.Semester
                    }).ToList(),
                    TotalDonors = donorsList.Count,
                    TotalAmount = donorsList.Sum(d => d.MinAmount)
                };

                _logger.LogInformation($"Successfully retrieved {donorsList.Count} donors for year {year} with grouping");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for year {year} with grouping");
                throw;
            }
        }

        /// <summary>
        /// Get donors by specific category with grouping
        /// </summary>
        public async Task<DonorsByCategoryDto> GetDonorsByCategoryGroupedAsync(string category)
        {
            try
            {
                _logger.LogInformation($"Getting donors for category {category} with grouping");

                var donors = await _donorRepository.GetDonorsByLevelAsync(category);
                var donorsList = donors.ToList();

                if (!donorsList.Any())
                {
                    return new DonorsByCategoryDto
                    {
                        Category = category,
                        Donors = new List<DonorDto>(),
                        TotalDonors = 0,
                        TotalAmount = 0
                    };
                }

                var response = new DonorsByCategoryDto
                {
                    Category = category,
                    Donors = donorsList.Select(d => new DonorDto
                    {
                        DonorId = d.Id,
                        DonorName = d.Name,
                        DonorLevel = d.DonationLevel.ToString(),
                        Year = d.Year,
                        PostedBy = d.PostedBy,
                        PostedDate = d.PostedDate,
                        Semester = d.Semester
                    }).ToList(),
                    TotalDonors = donorsList.Count,
                    TotalAmount = donorsList.Sum(d => d.MinAmount)
                };

                _logger.LogInformation($"Successfully retrieved {donorsList.Count} donors for category {category} with grouping");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting donors for category {category} with grouping");
                throw;
            }
        }

        /// <summary>
        /// Get available years for donors
        /// </summary>
        public async Task<List<int>> GetAvailableYearsAsync()
        {
            try
            {
                _logger.LogInformation("Getting available years for donors");

                var allDonors = await _donorRepository.GetAllDonorsAsync();
                var years = allDonors.Select(d => d.Year)
                                   .Distinct()
                                   .OrderByDescending(y => y)
                                   .ToList();

                _logger.LogInformation($"Successfully retrieved {years.Count} available years");
                return years;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available years for donors");
                throw;
            }
        }

        /// <summary>
        /// Get available donor categories (levels)
        /// </summary>
        public async Task<List<string>> GetAvailableCategoriesAsync()
        {
            try
            {
                _logger.LogInformation("Getting available donor categories");

                var allDonors = await _donorRepository.GetAllDonorsAsync();
                var categories = allDonors.Select(d => d.DonationLevel.ToString())
                                        .Distinct()
                                        .OrderBy(c => c)
                                        .ToList();

                _logger.LogInformation($"Successfully retrieved {categories.Count} available categories");
                return categories;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available donor categories");
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

                // Call the repository method that uses the stored procedure
                var response = await _donorRepository.GetAllDonorsGroupedByYearAndLevelsAsync();

                // Business logic: Validate the response
                if (response == null)
                {
                    throw new InvalidOperationException("Failed to retrieve donors grouped by year and levels");
                }

                // Business logic: Log the results for monitoring
                _logger.LogInformation($"Retrieved donors for year {response.Year}: " +
                                    $"Diamond: {response.DiamondDonors.Count}, " +
                                    $"Platinum: {response.PlatinumDonors.Count}, " +
                                    $"Gold: {response.GoldDonors.Count}, " +
                                    $"Silver: {response.SilverDonors.Count}, " +
                                    $"Bronze: {response.BronzeDonors.Count}");

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
