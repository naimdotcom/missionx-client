/**
 * Token Store
 *
 * Stores the access token in memory for use across API requests.
 * This is necessary for localhost development where cookies from port 8000
 * won't be sent to requests on port 8500.
 *
 * In production with proper domain setup, cookies can be shared across subdomains.
 */

import { getCookie } from "@/lib/cookies";

let storedAccessToken: string | null = null;

export const tokenStore = {
  /**
   * Set the access token
   */
  setAccessToken: (token: string | null) => {
    storedAccessToken = token;
    if (token) {
      console.log("[TokenStore] Token stored");
    } else {
      console.log("[TokenStore] Token cleared");
    }
  },

  /**
   * Get the access token
   */
  getAccessToken: (): string | null => {
    if (!storedAccessToken) {
      // Try to rehydrate from cookie (persistence for localhost)
      const cookieToken = getCookie("access_token");
      console.log("[TokenStore] Rehydrating. Cookie found:", !!cookieToken);
      if (cookieToken) {
         storedAccessToken = cookieToken;
      }
    }
    return storedAccessToken;
  },

  /**
   * Clear the access token
   */
  clearAccessToken: () => {
    storedAccessToken = null;
  },
};
