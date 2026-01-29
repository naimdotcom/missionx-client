/**
 * Location Persistence Manager
 *
 * Stores the current location when authentication fails, allowing users
 * to return to their original page after re-authenticating.
 *
 * Example: User is viewing /dashboard/profile when token expires.
 * They're redirected to /login to re-authenticate.
 * After login, they're redirected back to /dashboard/profile.
 */

const RETURN_TO_KEY = "auth_return_to";

/**
 * Save the current location for return after re-auth
 */
export const saveReturnLocation = (pathname: string) => {
  if (typeof window !== "undefined") {
    // Don't save login/signup pages
    if (!pathname.includes("/login") && !pathname.includes("/auth")) {
      sessionStorage.setItem(RETURN_TO_KEY, pathname);
      console.log(`[LocationPersist] Saved return location: ${pathname}`);
    }
  }
};

/**
 * Get the saved return location
 */
export const getReturnLocation = (): string | null => {
  if (typeof window !== "undefined") {
    const location = sessionStorage.getItem(RETURN_TO_KEY);
    if (location) {
      console.log(`[LocationPersist] Retrieved return location: ${location}`);
    }
    return location;
  }
  return null;
};

/**
 * Clear the saved return location
 */
export const clearReturnLocation = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(RETURN_TO_KEY);
  }
};

/**
 * Redirect to saved location or fallback
 */
export const redirectToReturnLocation = (
  router: any,
  fallback = "/dashboard",
) => {
  const location = getReturnLocation();
  clearReturnLocation();

  const target = location || fallback;
  console.log(`[LocationPersist] Redirecting to: ${target}`);
  router.push(target);
};
