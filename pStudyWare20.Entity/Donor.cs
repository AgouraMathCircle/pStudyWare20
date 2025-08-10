using System;

namespace pStudyWare20.Entity
{
    /// <summary>
    /// Represents a donor entity for Agoura Math Circle
    /// </summary>
    public class Donor
    {
        /// <summary>
        /// Unique identifier for the donor
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the donor
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Year of the donation
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// Donation level (Diamond, Platinum, Gold, Silver, Bronze)
        /// </summary>
        public DonationLevel DonationLevel { get; set; }

        /// <summary>
        /// Name of the person who posted the donor record
        /// </summary>
        public string PostedBy { get; set; } = string.Empty;

        /// <summary>
        /// Date when the donor record was posted
        /// </summary>
        public DateTime? PostedDate { get; set; }

        /// <summary>
        /// Semester when the donation was made (e.g., Fall, Spring, Summer)
        /// </summary>
        public string Semester { get; set; } = string.Empty;

        /// <summary>
        /// Gets the display name for the donation level
        /// </summary>
        public string DonationLevelDisplayName => DonationLevel.ToString();

        /// <summary>
        /// Gets the minimum amount for the donation level
        /// </summary>
        public decimal MinAmount => DonationLevel switch
        {
            DonationLevel.Bronze => 500m,
            DonationLevel.Silver => 1000m,
            DonationLevel.Gold => 2500m,
            DonationLevel.Platinum => 5000m,
            DonationLevel.Diamond => 10000m,
            _ => 0m
        };

        /// <summary>
        /// Gets the maximum amount for the donation level
        /// </summary>
        public decimal MaxAmount => DonationLevel switch
        {
            DonationLevel.Bronze => 999m,
            DonationLevel.Silver => 2499m,
            DonationLevel.Gold => 4999m,
            DonationLevel.Platinum => 9999m,
            DonationLevel.Diamond => 100000m, // No upper limit for Diamond
            _ => 0m
        };

        /// <summary>
        /// Gets the formatted amount range for the donation level
        /// </summary>
        public string AmountRange => DonationLevel switch
        {
            DonationLevel.Bronze => "$500 - $999",
            DonationLevel.Silver => "$1,000 - $2,499",
            DonationLevel.Gold => "$2,500 - $4,999",
            DonationLevel.Platinum => "$5,000 - $9,999",
            DonationLevel.Diamond => "$10,000+",
            _ => "N/A"
        };

        /// <summary>
        /// Gets the color associated with the donation level
        /// </summary>
        public string LevelColor => DonationLevel switch
        {
            DonationLevel.Bronze => "#CD7F32",
            DonationLevel.Silver => "#C0C0C0",
            DonationLevel.Gold => "#FFD700",
            DonationLevel.Platinum => "#E5E4E2",
            DonationLevel.Diamond => "#B9F2FF",
            _ => "#666666"
        };

        /// <summary>
        /// Gets the background color for the donation level
        /// </summary>
        public string LevelBackgroundColor => DonationLevel switch
        {
            DonationLevel.Bronze => "#FDF5E6",
            DonationLevel.Silver => "#FAFAFA",
            DonationLevel.Gold => "#FFF8E1",
            DonationLevel.Platinum => "#F5F5F5",
            DonationLevel.Diamond => "#E3F2FD",
            _ => "#F8F9FA"
        };

        /// <summary>
        /// Converts a string donation level to the DonationLevel enum
        /// </summary>
        /// <param name="levelString">The donation level as a string</param>
        /// <returns>The corresponding DonationLevel enum value</returns>
        public static DonationLevel ParseDonationLevel(string levelString)
        {
            return levelString?.ToLower() switch
            {
                "bronze" => DonationLevel.Bronze,
                "silver" => DonationLevel.Silver,
                "gold" => DonationLevel.Gold,
                "platinum" => DonationLevel.Platinum,
                "diamond" => DonationLevel.Diamond,
                _ => DonationLevel.Bronze // Default fallback
            };
        }

        /// <summary>
        /// Converts the DonationLevel enum to a string
        /// </summary>
        /// <param name="level">The DonationLevel enum value</param>
        /// <returns>The donation level as a string</returns>
        public static string DonationLevelToString(DonationLevel level)
        {
            return level.ToString();
        }
    }
}
