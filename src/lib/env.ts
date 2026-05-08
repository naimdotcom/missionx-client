type KebabToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<KebabToCamelCase<U>>}`
  : Lowercase<S>;

type ViteToCamelCase<S extends string> = S extends `VITE_${infer T}`
  ? KebabToCamelCase<T>
  : never;

type DynamicEnv = {
  [K in keyof ImportMetaEnv as ViteToCamelCase<
    Extract<K, string>
  >]: ImportMetaEnv[K];
};

const getCamelCase = (str: string) =>
  str
    .replace(/^VITE_/, "")
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const rawEnv = import.meta.env;

const dynamicEnv: any = {};
Object.keys(rawEnv).forEach((key) => {
  if (key.startsWith("VITE_")) {
    dynamicEnv[getCamelCase(key)] = rawEnv[key];
  }
});

interface BaseEnv extends DynamicEnv {
  readonly socketUrl: string | undefined;
  readonly environment: string;
  readonly firebase: {
    readonly apiKey: string | undefined;
    readonly authDomain: string | undefined;
    readonly projectId: string | undefined;
    readonly storageBucket: string | undefined;
    readonly messagingSenderId: string | undefined;
    readonly appId: string | undefined;
    readonly measurementId: string | undefined;
  };
}

// Explicitly define properties that might have naming mismatches or different types
export interface Env extends Omit<BaseEnv, "apiTimeout" | "openAllRoutes"> {
  readonly apiTimeout: number;
  readonly isOpenAllRoutes: string | undefined;
}

/**
 * Dynamic environment configuration.
 * Any environment variable prefixed with VITE_ in your .env file
 * is automatically mapped to this object in camelCase.
 *
 * Example: VITE_AUTH_URL becomes env.authUrl
 */
export const env = {
  ...dynamicEnv,
  // Custom mappings or transformations
  socketUrl: rawEnv.VITE_CHANNEL_URL,
  apiTimeout: rawEnv.VITE_API_TIMEOUT
    ? parseInt(rawEnv.VITE_API_TIMEOUT, 10)
    : 30000,
  environment: rawEnv.ENVIRONMENT || rawEnv.MODE,
  isOpenAllRoutes: rawEnv.VITE_OPEN_ALL_ROUTES,
  firebase: {
    apiKey: rawEnv.VITE_FIREBASE_API_KEY,
    authDomain: rawEnv.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: rawEnv.VITE_FIREBASE_PROJECT_ID,
    storageBucket: rawEnv.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: rawEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: rawEnv.VITE_FIREBASE_APP_ID,
    measurementId: rawEnv.VITE_FIREBASE_MEASUREMENT_ID,
  },
} as unknown as Env;
