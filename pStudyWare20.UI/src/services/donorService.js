import api from "./api";

class DonorService {
  /**
   * Get current year donors
   * @param {number} year - Current year
   * @returns {Promise<Array>} Array of current year donors
   */
  async getCurrentYearDonors(year) {
    try {
      const response = await api.get(`/donors/current/${year}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching current year donors:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch current year donors"
      );
    }
  }

  /**
   * Get past year donors
   * @param {number} year - Past year
   * @returns {Promise<Array>} Array of past year donors
   */
  async getPastYearDonors(year) {
    try {
      const response = await api.get(`/donors/past/${year}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching past year donors:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch past year donors"
      );
    }
  }

  /**
   * Get all donors for a specific year
   * @param {number} year - Year to fetch donors for
   * @returns {Promise<Array>} Array of donors for the specified year
   */
  async getDonorsByYear(year) {
    try {
      const response = await api.get(`/donors/year/${year}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching donors by year:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch donors by year"
      );
    }
  }

  /**
   * Get donors by donation level
   * @param {string} level - Donation level (Diamond, Platinum, Gold, Silver, Bronze)
   * @returns {Promise<Array>} Array of donors for the specified level
   */
  async getDonorsByLevel(level) {
    try {
      const response = await api.get(`/donors/level/${level}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching donors by level:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch donors by level"
      );
    }
  }

  /**
   * Get donor statistics
   * @returns {Promise<Object>} Donor statistics
   */
  async getDonorStatistics() {
    try {
      const response = await api.get("/donors/statistics");
      return response.data || {};
    } catch (error) {
      console.error("Error fetching donor statistics:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch donor statistics"
      );
    }
  }

  /**
   * Get donor by ID
   * @param {string|number} id - Donor ID
   * @returns {Promise<Object>} Donor object
   */
  async getDonorById(id) {
    try {
      const response = await api.get(`/donors/${id}`);
      return response.data || {};
    } catch (error) {
      console.error("Error fetching donor by ID:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch donor");
    }
  }

  /**
   * Create new donor
   * @param {Object} donorData - Donor data to create
   * @returns {Promise<Object>} Created donor object
   */
  async createDonor(donorData) {
    try {
      const response = await api.post("/donors", donorData);
      return response.data || {};
    } catch (error) {
      console.error("Error creating donor:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create donor"
      );
    }
  }

  /**
   * Update donor
   * @param {string|number} id - Donor ID
   * @param {Object} donorData - Updated donor data
   * @returns {Promise<Object>} Updated donor object
   */
  async updateDonor(id, donorData) {
    try {
      const response = await api.put(`/donors/${id}`, donorData);
      return response.data || {};
    } catch (error) {
      console.error("Error updating donor:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update donor"
      );
    }
  }

  /**
   * Delete donor
   * @param {string|number} id - Donor ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteDonor(id) {
    try {
      await api.delete(`/donors/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting donor:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete donor"
      );
    }
  }

  /**
   * Group donors by donation level
   * @param {Array} donors - Array of donor objects
   * @returns {Object} Grouped donors by level
   */
  groupDonorsByLevel(donors) {
    const levels = ["Diamond", "Platinum", "Gold", "Silver", "Bronze"];
    const grouped = {};

    levels.forEach((level) => {
      grouped[level] = donors.filter(
        (donor) =>
          donor.donationLevel &&
          donor.donationLevel.toLowerCase() === level.toLowerCase()
      );
    });

    return grouped;
  }

  /**
   * Get color for donation level
   * @param {string} level - Donation level
   * @returns {string} Color hex code
   */
  getLevelColor(level) {
    switch (level.toLowerCase()) {
      case "diamond":
        return "#b9f2ff";
      case "platinum":
        return "#e5e4e2";
      case "gold":
        return "#ffd700";
      case "silver":
        return "#c0c0c0";
      case "bronze":
        return "#cd7f32";
      default:
        return "primary";
    }
  }

  /**
   * Get text color for donation level
   * @param {string} level - Donation level
   * @returns {string} Text color
   */
  getLevelTextColor(level) {
    switch (level.toLowerCase()) {
      case "diamond":
        return "#000";
      case "platinum":
        return "#000";
      case "gold":
        return "#000";
      case "silver":
        return "#000";
      case "bronze":
        return "#fff";
      default:
        return "inherit";
    }
  }

  /**
   * Format donation amount
   * @param {number} amount - Donation amount
   * @returns {string} Formatted amount
   */
  formatAmount(amount) {
    if (!amount) return "";
    return `$${amount.toLocaleString()}`;
  }

  /**
   * Format donation date
   * @param {string|Date} date - Donation date
   * @returns {string} Formatted date
   */
  formatDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  }
}

export default new DonorService();
