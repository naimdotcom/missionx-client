export const env = {
  authUrl: import.meta.env.VITE_AUTH_URL,
  channelUrl: import.meta.env.VITE_CHANNEL_URL,
  socketUrl: import.meta.env.VITE_CHANNEL_URL,
  mediaServiceUrl: import.meta.env.VITE_MEDIA_SERVICE_URL,
  metaAppId: import.meta.env.VITE_META_APP_ID,
  appUrl: import.meta.env.VITE_APP_URL,
  apiTimeout: import.meta.env.VITE_API_TIMEOUT
    ? parseInt(import.meta.env.VITE_API_TIMEOUT, 10)
    : 30000,
  isOpenAllRoutes: import.meta.env.VITE_OPEN_ALL_ROUTES,
  environment: import.meta.env.ENVIRONMENT,
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  pusherAppKey: import.meta.env.VITE_PUSHER_APP_KEY,
  pusherHost: import.meta.env.VITE_PUSHER_HOST,
  crmUrl: import.meta.env.VITE_CRM_URL,
} as const;
