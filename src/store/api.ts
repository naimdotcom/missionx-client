export * from "./api/baseApi";
export * from "./api/authApi";
export * from "./api/instagramApi";
export * from "./api/appsApi";
export * from "./api/customerApi";
export * from "./api/webhookApi";

// For backward compatibility if anything still imports 'api' specifically
import { baseApi as api } from "./api/baseApi";
export { api };
