export const env = {
  authUrl: import.meta.env.VITE_AUTH_URL,
  appUrl: import.meta.env.VITE_APP_URL,
  apiTimeout: import.meta.env.VITE_API_TIMEOUT
    ? parseInt(import.meta.env.VITE_API_TIMEOUT, 10)
    : 30000,
  enableApiLogging: import.meta.env.VITE_ENABLE_API_LOGGING === "true",
  openAllRoutes: import.meta.env.VITE_OPEN_ALL_ROUTES === "true",
  isDev: import.meta.env.MODE === "development",
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
} as const;
