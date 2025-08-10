# Environment Configuration Guide

## Overview

This document explains the environment configuration setup for the pStudyWare20.UI React application.

## Files

- `.env` - Environment variables for the current environment
- `.env.example` - Template file showing all available environment variables
- `src/utils/config.js` - Configuration utility for accessing environment variables

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env` for your environment**

3. **Use the configuration in your code:**
   ```javascript
   import config from './utils/config';
   
   // Access configuration values
   const apiUrl = config.api.url;
   const isDev = config.app.environment === 'development';
   ```

## Environment Variables

### API Configuration
- `VITE_API_URL` - Base URL for API calls (default: `http://localhost:5000/api`)
- `VITE_API_TIMEOUT` - API request timeout in milliseconds (default: `10000`)

### Authentication
- `VITE_AUTH_TOKEN_KEY` - LocalStorage key for auth token (default: `authToken`)
- `VITE_USER_DATA_KEY` - LocalStorage key for user data (default: `user`)
- `VITE_REFRESH_TOKEN_KEY` - LocalStorage key for refresh token (default: `refreshToken`)
- `VITE_JWT_EXPIRY_BUFFER` - JWT expiry buffer in milliseconds (default: `300000`)
- `VITE_REFRESH_TOKEN_EXPIRY` - Refresh token expiry in milliseconds (default: `604800000`)

### Application Settings
- `VITE_APP_NAME` - Application name (default: `pStudyWare20`)
- `VITE_APP_VERSION` - Application version (default: `1.0.0`)
- `VITE_APP_ENVIRONMENT` - Environment (development/production) (default: `development`)

### Security Settings
- `VITE_REFERRER_POLICY` - Referrer policy (default: `strict-origin-when-cross-origin`)
- `VITE_ENABLE_HTTPS_REDIRECT` - Enable HTTPS redirect (default: `false`)
- `VITE_ENABLE_CSP_HEADERS` - Enable Content Security Policy headers (default: `false`)
- `VITE_ENABLE_XSS_PROTECTION` - Enable XSS protection (default: `true`)
- `VITE_ENABLE_CONTENT_TYPE_NOSNIFF` - Enable content type nosniff (default: `true`)
- `VITE_ENABLE_FRAMES_DENY` - Enable frames deny (default: `true`)

### Feature Flags
- `VITE_ENABLE_ANALYTICS` - Enable analytics (default: `false`)
- `VITE_ENABLE_DEBUG_MODE` - Enable debug mode (default: `true`)
- `VITE_ENABLE_CONSOLE_LOGS` - Enable console logs (default: `true`)
- `VITE_ENABLE_LAZY_LOADING` - Enable lazy loading (default: `true`)
- `VITE_ENABLE_IMAGE_OPTIMIZATION` - Enable image optimization (default: `true`)
- `VITE_ENABLE_CACHING` - Enable caching (default: `true`)
- `VITE_ENABLE_ANIMATIONS` - Enable animations (default: `true`)
- `VITE_ENABLE_REDUCED_MOTION` - Enable reduced motion (default: `false`)

### External Services
- `VITE_GOOGLE_ANALYTICS_ID` - Google Analytics ID
- `VITE_SENTRY_DSN` - Sentry DSN for error tracking

### Social Media Links
- `VITE_FACEBOOK_URL` - Facebook URL
- `VITE_TWITTER_URL` - Twitter URL
- `VITE_LINKEDIN_URL` - LinkedIn URL
- `VITE_INSTAGRAM_URL` - Instagram URL
- `VITE_YOUTUBE_URL` - YouTube URL

### Contact Information
- `VITE_CONTACT_EMAIL` - Contact email (default: `support@agouramathcircle.org`)
- `VITE_CONTACT_PHONE` - Contact phone
- `VITE_CONTACT_ADDRESS` - Contact address

### Development Settings
- `VITE_DEV_SERVER_PORT` - Development server port (default: `3000`)
- `VITE_DEV_SERVER_HOST` - Development server host (default: `localhost`)

### Production Settings
- `VITE_PRODUCTION_API_URL` - Production API URL (default: `https://api.pstudyware.com/api`)
- `VITE_PRODUCTION_DOMAIN` - Production domain (default: `https://pstudyware.com`)

### File Upload Configuration
- `VITE_MAX_FILE_SIZE` - Maximum file size in bytes (default: `10485760`)
- `VITE_ALLOWED_FILE_TYPES` - Allowed file types (default: `image/jpeg,image/png,image/gif,application/pdf`)
- `VITE_UPLOAD_ENDPOINT` - Upload endpoint (default: `/api/upload`)

### Notification Settings
- `VITE_ENABLE_PUSH_NOTIFICATIONS` - Enable push notifications (default: `false`)
- `VITE_PUSH_NOTIFICATION_PUBLIC_KEY` - Push notification public key

### Localization Settings
- `VITE_DEFAULT_LOCALE` - Default locale (default: `en`)
- `VITE_SUPPORTED_LOCALES` - Supported locales (default: `en,es,fr`)

### Theme Configuration
- `VITE_PRIMARY_COLOR` - Primary color (default: `#53b50a`)
- `VITE_SECONDARY_COLOR` - Secondary color (default: `#4a7c59`)
- `VITE_ACCENT_COLOR` - Accent color (default: `#007bff`)
- `VITE_ERROR_COLOR` - Error color (default: `#dc3545`)
- `VITE_SUCCESS_COLOR` - Success color (default: `#28a745`)
- `VITE_WARNING_COLOR` - Warning color (default: `#ffc107`)
- `VITE_INFO_COLOR` - Info color (default: `#17a2b8`)

### Animation Settings
- `VITE_ANIMATION_DURATION` - Animation duration in milliseconds (default: `300`)

### Error Handling
- `VITE_ERROR_REPORTING_ENABLED` - Enable error reporting (default: `false`)
- `VITE_ERROR_REPORTING_URL` - Error reporting URL

### Third-party API Keys
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID

### Database Configuration
- `VITE_DB_CONNECTION_STRING` - Database connection string (if needed for frontend)

## Usage Examples

### In Components
```javascript
import config from '../utils/config';

function MyComponent() {
  const apiUrl = config.api.url;
  const isDev = config.app.environment === 'development';
  const primaryColor = config.theme.primaryColor;
  
  return (
    <div style={{ color: primaryColor }}>
      API URL: {apiUrl}
    </div>
  );
}
```

### In Services
```javascript
import config from '../utils/config';

class MyService {
  constructor() {
    this.baseUrl = config.api.url;
    this.timeout = config.api.timeout;
  }
  
  async makeRequest() {
    // Use config values
  }
}
```

### Using Helper Functions
```javascript
import { getConfig, isDevelopment, getApiUrl, getThemeColor } from '../utils/config';

// Get nested config values
const apiTimeout = getConfig('api.timeout');

// Check environment
if (isDevelopment()) {
  console.log('Running in development mode');
}

// Get API URL based on environment
const apiUrl = getApiUrl();

// Get theme color
const primaryColor = getThemeColor('primaryColor');
```

## Security Considerations

### Referrer Policy
The default referrer policy is set to `strict-origin-when-cross-origin` which:
- Sends the full referrer to same-origin requests
- Sends only the origin to cross-origin requests
- Sends no referrer to less secure destinations (HTTP → HTTPS)

### Environment-specific Settings
- **Development**: Debug mode enabled, console logs enabled
- **Production**: Debug mode disabled, console logs disabled, HTTPS redirect enabled

## Best Practices

1. **Never commit `.env` files** - They contain sensitive information
2. **Use `.env.example`** - As a template for required environment variables
3. **Validate environment variables** - Check for required variables on app startup
4. **Use TypeScript** - For better type safety with configuration values
5. **Document changes** - Update this README when adding new environment variables

## Troubleshooting

### Environment Variables Not Loading
1. Ensure the variable name starts with `VITE_`
2. Restart the development server after changing `.env`
3. Check for typos in variable names

### Configuration Not Working
1. Import the config utility correctly
2. Use the correct property path
3. Check that the environment variable is set

### Security Issues
1. Verify referrer policy settings
2. Check HTTPS redirect configuration
3. Ensure sensitive data is not exposed in client-side code

## Migration from Direct Environment Variable Access

If you're migrating from direct `import.meta.env` access:

**Before:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**After:**
```javascript
import config from '../utils/config';
const apiUrl = config.api.url;
```

This provides better type safety, centralized configuration, and easier testing. 