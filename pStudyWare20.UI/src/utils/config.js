// Configuration utility for environment variables
const config = {
  // API Configuration
  api: {
    url: import.meta.env.VITE_API_URL || "https://localhost:7146/api",
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // Authentication
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || "authToken",
    userDataKey: import.meta.env.VITE_USER_DATA_KEY || "user",
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || "refreshToken",
    jwtExpiryBuffer: parseInt(import.meta.env.VITE_JWT_EXPIRY_BUFFER) || 300000,
    refreshTokenExpiry:
      parseInt(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY) || 604800000,
  },

  // Application
  app: {
    name: import.meta.env.VITE_APP_NAME || "pStudyWare20",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.VITE_APP_ENVIRONMENT || "development",
  },

  // Security
  security: {
    referrerPolicy:
      import.meta.env.VITE_REFERRER_POLICY || "strict-origin-when-cross-origin",
    enableHttpsRedirect: import.meta.env.VITE_ENABLE_HTTPS_REDIRECT === "true",
    enableCspHeaders: import.meta.env.VITE_ENABLE_CSP_HEADERS === "true",
    enableXssProtection: import.meta.env.VITE_ENABLE_XSS_PROTECTION !== "false",
    enableContentTypeNosniff:
      import.meta.env.VITE_ENABLE_CONTENT_TYPE_NOSNIFF !== "false",
    enableFramesDeny: import.meta.env.VITE_ENABLE_FRAMES_DENY !== "false",
  },

  // Features
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
    enableConsoleLogs: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === "true",
    enableLazyLoading: import.meta.env.VITE_ENABLE_LAZY_LOADING !== "false",
    enableImageOptimization:
      import.meta.env.VITE_ENABLE_IMAGE_OPTIMIZATION !== "false",
    enableCaching: import.meta.env.VITE_ENABLE_CACHING !== "false",
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS !== "false",
    enableReducedMotion: import.meta.env.VITE_ENABLE_REDUCED_MOTION === "true",
  },

  // External Services
  external: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },

  // Social Media
  social: {
    facebook:
      import.meta.env.VITE_FACEBOOK_URL ||
      "https://www.facebook.com/profile.php?id=100010784343153",
    twitter:
      import.meta.env.VITE_TWITTER_URL || "https://twitter.com/Agouramathcirle",
    linkedin:
      import.meta.env.VITE_LINKEDIN_URL ||
      "https://www.linkedin.com/in/agouramathcircle/",
    instagram:
      import.meta.env.VITE_INSTAGRAM_URL ||
      "https://www.instagram.com/agouramathcircle/",
    youtube:
      import.meta.env.VITE_YOUTUBE_URL ||
      "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos",
  },

  // Contact
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || "support@agouramathcircle.org",
    phone: import.meta.env.VITE_CONTACT_PHONE,
    address: import.meta.env.VITE_CONTACT_ADDRESS,
  },

  // Development
  dev: {
    serverPort: parseInt(import.meta.env.VITE_DEV_SERVER_PORT) || 3000,
    serverHost: import.meta.env.VITE_DEV_SERVER_HOST || "localhost",
  },

  // Production
  production: {
    apiUrl:
      import.meta.env.VITE_PRODUCTION_API_URL ||
      "https://api.pstudyware.com/api",
    domain: import.meta.env.VITE_PRODUCTION_DOMAIN || "https://pstudyware.com",
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
    allowedFileTypes:
      import.meta.env.VITE_ALLOWED_FILE_TYPES ||
      "image/jpeg,image/png,image/gif,application/pdf",
    endpoint: import.meta.env.VITE_UPLOAD_ENDPOINT || "/api/upload",
  },

  // Notifications
  notifications: {
    enablePush: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === "true",
    pushPublicKey: import.meta.env.VITE_PUSH_NOTIFICATION_PUBLIC_KEY,
  },

  // Localization
  localization: {
    defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE || "en",
    supportedLocales: import.meta.env.VITE_SUPPORTED_LOCALES?.split(",") || [
      "en",
    ],
  },

  // Theme
  theme: {
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR || "#53b50a",
    secondaryColor: import.meta.env.VITE_SECONDARY_COLOR || "#4a7c59",
    accentColor: import.meta.env.VITE_ACCENT_COLOR || "#007bff",
    errorColor: import.meta.env.VITE_ERROR_COLOR || "#dc3545",
    successColor: import.meta.env.VITE_SUCCESS_COLOR || "#28a745",
    warningColor: import.meta.env.VITE_WARNING_COLOR || "#ffc107",
    infoColor: import.meta.env.VITE_INFO_COLOR || "#17a2b8",
  },

  // Animation
  animation: {
    duration: parseInt(import.meta.env.VITE_ANIMATION_DURATION) || 300,
  },

  // Error Handling
  error: {
    reportingEnabled: import.meta.env.VITE_ERROR_REPORTING_ENABLED === "true",
    reportingUrl: import.meta.env.VITE_ERROR_REPORTING_URL,
  },

  // Third-party APIs
  thirdParty: {
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  },

  // Database (if needed for frontend)
  database: {
    connectionString: import.meta.env.VITE_DB_CONNECTION_STRING,
  },
};

// Helper function to get nested config values
export const getConfig = (path) => {
  return path.split(".").reduce((obj, key) => obj?.[key], config);
};

// Helper function to check if we're in development mode
export const isDevelopment = () => {
  return config.app.environment === "development";
};

// Helper function to check if we're in production mode
export const isProduction = () => {
  return config.app.environment === "production";
};

// Helper function to get API URL based on environment
export const getApiUrl = () => {
  return isProduction() ? config.production.apiUrl : config.api.url;
};

// Helper function to get theme color
export const getThemeColor = (colorName) => {
  return config.theme[colorName] || config.theme.primaryColor;
};

export default config;
