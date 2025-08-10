# Services Documentation

This directory contains API service modules for the React application.

## Structure

```
services/
├── api.js              # Base axios configuration
├── authService.js      # Authentication related API calls
├── userService.js      # User profile and data API calls
├── index.js           # Service exports
└── README.md          # This documentation
```

## Usage

### Importing Services

```javascript
import { authService, userService, api } from "../services";
```

### Authentication Service

The `authService` provides the following methods:

- `login(email, password)` - Authenticate user
- `logout()` - Logout user and clear tokens
- `forgotPassword(email)` - Send password reset email
- `resetPassword(token, newPassword)` - Reset password with token
- `getCurrentUser()` - Get current user from localStorage
- `isAuthenticated()` - Check if user is authenticated
- `getToken()` - Get current auth token
- `refreshToken()` - Refresh authentication token
- `validateToken()` - Validate current token

### User Service

The `userService` provides the following methods:

- `getUserProfile()` - Get user profile data
- `updateUserProfile(userData)` - Update user profile
- `changePassword(currentPassword, newPassword)` - Change user password
- `getDashboardData()` - Get dashboard data
- `getNotifications()` - Get user notifications
- `markNotificationAsRead(notificationId)` - Mark notification as read
- `getUserSettings()` - Get user settings
- `updateUserSettings(settings)` - Update user settings

### API Configuration

The `api.js` file configures axios with:

- Base URL configuration
- Request interceptors for authentication
- Response interceptors for error handling
- Automatic token management
- Automatic redirect on 401 errors

## Error Handling

All services include comprehensive error handling:

- Network errors
- HTTP status code errors
- Validation errors
- Server errors

## Authentication Flow

1. User submits login form
2. `authService.login()` is called
3. On success, token is stored in localStorage
4. User is redirected to dashboard
5. Protected routes check authentication
6. API calls automatically include auth token

## Environment Variables

Set the following environment variables:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Example Usage

```javascript
// Login
try {
  const response = await authService.login(email, password);
  console.log("Login successful:", response);
} catch (error) {
  console.error("Login failed:", error.message);
}

// Get user profile
try {
  const profile = await userService.getUserProfile();
  console.log("User profile:", profile);
} catch (error) {
  console.error("Failed to get profile:", error.message);
}
```
