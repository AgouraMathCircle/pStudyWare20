import api from "./api"; // Assuming 'api' is your configured axios instance

const DONATE_API_BASE_URL = "/Donate";

const donateService = {
  /**
   * Fetches all donors, categorized by current and past years, and by donation level.
   * @returns {Promise<object>} An object containing currentYearDonors and pastYearDonors.
   */
  getDonors: async () => {
    try {
      const response = await api.get(`${DONATE_API_BASE_URL}/GetAllDonors`);
      return response.data;
    } catch (error) {
      console.error("Error fetching donors:", error);
      throw error;
    }
  },

  /**
   * Fetches donors for a specific year.
   * @param {number} year The year to fetch donors for.
   * @returns {Promise<Array>} A list of donors for the specified year.
   */
  getDonorsByYear: async (year) => {
    try {
      const response = await api.get(
        `${DONATE_API_BASE_URL}/GetDonorsByYear/${year}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching donors for year ${year}:`, error);
      throw error;
    }
  },

  /**
   * Fetches donors for a specific level and year.
   * @param {string} level The donation level (e.g., "Diamond", "Gold").
   * @param {number} year The year to fetch donors for.
   * @returns {Promise<Array>} A list of donors for the specified level and year.
   */
  getDonorsByLevel: async (level, year) => {
    try {
      const response = await api.post(
        `${DONATE_API_BASE_URL}/GetDonorsByLevel`,
        { level, year }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching donors for level ${level} in year ${year}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Fetches dashboard data for the donate page, including current year and past year donors.
   * @returns {Promise<object>} Dashboard data.
   */
  getDashboardData: async () => {
    try {
      const response = await api.get(`${DONATE_API_BASE_URL}/GetDashboard`);
      return response.data;
    } catch (error) {
      console.error("Error fetching donate dashboard data:", error);
      throw error;
    }
  },

  /**
   * Fetches donor statistics.
   * @param {number} year Optional: The year for which to fetch statistics.
   * @returns {Promise<object>} Donor statistics.
   */
  getDonateStats: async (year = new Date().getFullYear()) => {
    try {
      const response = await api.get(
        `${DONATE_API_BASE_URL}/GetStats?year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching donate statistics:", error);
      throw error;
    }
  },

  /**
   * Checks user privileges for donate functionality.
   * @returns {Promise<object>} Privilege information.
   */
  checkPrivileges: async () => {
    try {
      const response = await api.get(`${DONATE_API_BASE_URL}/CheckPrivileges`);
      return response.data;
    } catch (error) {
      console.error("Error checking donate privileges:", error);
      throw error;
    }
  },

  // Helper functions for PayPal integration (moved from component)
  validateAmount: (amount) => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  },

  formatAmount: (amount) => {
    return parseFloat(amount).toFixed(2);
  },

  getLevelAmountRange: (level) => {
    switch (level) {
      case "Diamond":
        return { min: 10000, max: Infinity };
      case "Platinum":
        return { min: 5000, max: 9999 };
      case "Gold":
        return { min: 2500, max: 4999 };
      case "Silver":
        return { min: 1000, max: 2499 };
      case "Bronze":
        return { min: 500, max: 999 };
      default:
        return { min: 1, max: Infinity }; // Default for general donations
    }
  },

  isAmountValidForLevel: (amount, level) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return false;

    const range = donateService.getLevelAmountRange(level);
    return numAmount >= range.min && numAmount <= range.max;
  },
};

export default donateService;
