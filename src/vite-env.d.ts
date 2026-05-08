/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_URL?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_CHANNEL_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_MEDIA_SERVICE_URL?: string;
  readonly VITE_META_APP_ID?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_ENABLE_API_LOGGING?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_OPEN_ALL_ROUTES?: string;
  readonly VITE_PUSHER_APP_KEY?: string;
  readonly VITE_PUSHER_HOST?: string;
  readonly VITE_CRM_URL?: string;
  readonly ENVIRONMENT?: string;
  // Add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
