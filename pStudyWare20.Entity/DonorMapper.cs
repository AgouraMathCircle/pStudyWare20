using System;
using System.Collections.Generic;
using System.Linq;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Entity
{
    /// <summary>
    /// Provides mapping functionality between AMC_tblDonor database model and Donor entity
    /// </summary>
    public static class DonorMapper
    {
        /// <summary>
        /// Maps a database donor model to a Donor entity
        /// </summary>
        /// <param name="dbDonor">The database donor model</param>
        /// <returns>The mapped Donor entity</returns>
        public static Donor? MapFromDatabase(AMC_tblDonor? dbDonor)
        {
            if (dbDonor == null)
                return null;

            return new Donor
            {
                Id = dbDonor.DonorID,
                Name = dbDonor.DonorName ?? string.Empty,
                Year = dbDonor.Year,
                DonationLevel = Donor.ParseDonationLevel(dbDonor.DonorLevel ?? string.Empty),
                PostedBy = dbDonor.PostedBy ?? string.Empty,
                PostedDate = dbDonor.PostedDate,
                Semester = dbDonor.Semester ?? string.Empty
            };
        }

        /// <summary>
        /// Maps a Donor entity to a database donor model
        /// </summary>
        /// <param name="donor">The Donor entity</param>
        /// <returns>The mapped database donor model</returns>
        public static AMC_tblDonor? MapToDatabase(Donor? donor)
        {
            if (donor == null)
                return null;

            return new AMC_tblDonor
            {
                DonorID = donor.Id,
                DonorName = donor.Name,
                Year = donor.Year,
                DonorLevel = Donor.DonationLevelToString(donor.DonationLevel),
                PostedBy = donor.PostedBy,
                PostedDate = donor.PostedDate,
                Semester = donor.Semester
            };
        }

        /// <summary>
        /// Maps a collection of database donor models to Donor entities
        /// </summary>
        /// <param name="dbDonors">Collection of database donor models</param>
        /// <returns>Collection of mapped Donor entities</returns>
        public static IEnumerable<Donor> MapFromDatabase(IEnumerable<AMC_tblDonor>? dbDonors)
        {
            if (dbDonors == null)
                return Enumerable.Empty<Donor>();

            return dbDonors.Select(MapFromDatabase).Where(d => d != null)!;
        }

        /// <summary>
        /// Maps a collection of Donor entities to database donor models
        /// </summary>
        /// <param name="donors">Collection of Donor entities</param>
        /// <returns>Collection of mapped database donor models</returns>
        public static IEnumerable<AMC_tblDonor> MapToDatabase(IEnumerable<Donor>? donors)
        {
            if (donors == null)
                return Enumerable.Empty<AMC_tblDonor>();

            return donors.Select(MapToDatabase).Where(d => d != null)!;
        }

        /// <summary>
        /// Creates a new Donor entity with default values
        /// </summary>
        /// <param name="name">Donor name</param>
        /// <param name="year">Donation year</param>
        /// <param name="donationLevel">Donation level</param>
        /// <param name="postedBy">Name of person posting the record</param>
        /// <param name="semester">Semester of donation</param>
        /// <returns>New Donor entity</returns>
        public static Donor CreateNew(string name, int year, DonationLevel donationLevel, string postedBy, string semester = "")
        {
            return new Donor
            {
                Id = 0, // Will be set by database
                Name = name ?? string.Empty,
                Year = year,
                DonationLevel = donationLevel,
                PostedBy = postedBy ?? string.Empty,
                PostedDate = DateTime.UtcNow,
                Semester = semester ?? string.Empty
            };
        }

        /// <summary>
        /// Validates a Donor entity
        /// </summary>
        /// <param name="donor">The Donor entity to validate</param>
        /// <returns>True if valid, false otherwise</returns>
        public static bool IsValid(Donor donor)
        {
            if (donor == null)
                return false;

            return !string.IsNullOrWhiteSpace(donor.Name) &&
                   donor.Year > 0 &&
                   donor.Year <= DateTime.Now.Year + 1 && // Allow current year + 1 for planning
                   !string.IsNullOrWhiteSpace(donor.PostedBy);
        }

        /// <summary>
        /// Gets validation errors for a Donor entity
        /// </summary>
        /// <param name="donor">The Donor entity to validate</param>
        /// <returns>List of validation error messages</returns>
        public static List<string> GetValidationErrors(Donor donor)
        {
            var errors = new List<string>();

            if (donor == null)
            {
                errors.Add("Donor cannot be null");
                return errors;
            }

            if (string.IsNullOrWhiteSpace(donor.Name))
                errors.Add("Donor name is required");

            if (donor.Year <= 0)
                errors.Add("Year must be greater than 0");

            if (donor.Year > DateTime.Now.Year + 1)
                errors.Add("Year cannot be more than next year");

            if (string.IsNullOrWhiteSpace(donor.PostedBy))
                errors.Add("PostedBy is required");

            return errors;
        }
    }
}
