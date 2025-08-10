import api from "./api";
import config from "../utils/config";

class PayPalService {
  /**
   * Initialize PayPal payment
   * @param {Object} donationData - Donation information
   * @param {string} donationData.amount - Donation amount
   * @param {string} donationData.currency - Currency code (default: USD)
   * @param {string} donationData.description - Donation description
   * @param {string} donationData.level - Donation level (Diamond, Platinum, etc.)
   * @param {string} donationData.donorName - Donor's name
   * @param {string} donationData.donorEmail - Donor's email
   * @returns {Promise<Object>} PayPal payment response
   */
  async createPayment(donationData) {
    try {
      const response = await api.post("/paypal/create-payment", {
        amount: donationData.amount,
        currency: donationData.currency || "USD",
        description:
          donationData.description ||
          `AMC ${donationData.level} Level Donation`,
        level: donationData.level,
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail,
        returnUrl: `${window.location.origin}/donate/success`,
        cancelUrl: `${window.location.origin}/donate/cancel`,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating PayPal payment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create PayPal payment"
      );
    }
  }

  /**
   * Execute PayPal payment after approval
   * @param {string} paymentId - PayPal payment ID
   * @param {string} payerId - PayPal payer ID
   * @returns {Promise<Object>} Payment execution response
   */
  async executePayment(paymentId, payerId) {
    try {
      const response = await api.post("/paypal/execute-payment", {
        paymentId,
        payerId,
      });

      return response.data;
    } catch (error) {
      console.error("Error executing PayPal payment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to execute PayPal payment"
      );
    }
  }

  /**
   * Get PayPal client configuration
   * @returns {Object} PayPal configuration
   */
  getPayPalConfig() {
    return {
      clientId: config.thirdParty.paypalClientId,
      currency: "USD",
      intent: "capture",
      environment:
        config.app.environment === "production" ? "production" : "sandbox",
    };
  }

  /**
   * Validate donation amount
   * @param {string} amount - Donation amount
   * @returns {boolean} Whether amount is valid
   */
  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 100000;
  }

  /**
   * Format amount for PayPal
   * @param {string|number} amount - Raw amount
   * @returns {string} Formatted amount
   */
  formatAmount(amount) {
    return parseFloat(amount).toFixed(2);
  }

  /**
   * Get donation level amount range
   * @param {string} level - Donation level
   * @returns {Object} Amount range for the level
   */
  getLevelAmountRange(level) {
    const ranges = {
      Diamond: { min: 10000, max: 100000 },
      Platinum: { min: 5000, max: 9999 },
      Gold: { min: 2500, max: 4999 },
      Silver: { min: 1000, max: 2499 },
      Bronze: { min: 500, max: 999 },
    };
    return ranges[level] || { min: 1, max: 100000 };
  }

  /**
   * Check if amount matches donation level
   * @param {string|number} amount - Donation amount
   * @param {string} level - Donation level
   * @returns {boolean} Whether amount matches level
   */
  isAmountValidForLevel(amount, level) {
    const range = this.getLevelAmountRange(level);
    const numAmount = parseFloat(amount);
    return numAmount >= range.min && numAmount <= range.max;
  }
}

export default new PayPalService();
