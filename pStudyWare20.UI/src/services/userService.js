import api from './api';

class UserService {
  // Get user profile
  async getUserProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateUserProfile(userData) {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/user/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user dashboard data
  async getDashboardData() {
    try {
      const response = await api.get('/user/dashboard');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user notifications
  async getNotifications() {
    try {
      const response = await api.get('/user/notifications');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/user/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user settings
  async getUserSettings() {
    try {
      const response = await api.get('/user/settings');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user settings
  async updateUserSettings(settings) {
    try {
      const response = await api.put('/user/settings', settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid request data');
        case 401:
          return new Error(data.message || 'Unauthorized access');
        case 403:
          return new Error(data.message || 'Access denied');
        case 404:
          return new Error(data.message || 'Resource not found');
        case 422:
          return new Error(data.message || 'Validation failed');
        case 500:
          return new Error(data.message || 'Internal server error');
        default:
          return new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new UserService(); 