// Initialize and register all API service clients

import { env } from "@/lib/env";
import { serviceRegistry } from "./service-registry";

/**
 * Register all service clients with their configurations
 * Call this once during app initialization
 */
export function initializeAPIClients(): void {
  // Auth service client
  serviceRegistry.register({
    name: "auth",
    baseURL: env.authUrl || "",
    timeout: env.apiTimeout,
  });

  // App service client
  serviceRegistry.register({
    name: "app",
    baseURL: env.appUrl || "",
    timeout: env.apiTimeout,
  });

  // Channel service client
  serviceRegistry.register({
    name: "channel",
    baseURL: env.channelUrl || "",
    timeout: env.apiTimeout,
  });

  // CRM service client
  serviceRegistry.register({
    name: "crm",
    baseURL: env.crmUrl || "",
    timeout: env.apiTimeout,
  });
}

// Call immediately to register before clients are exported
initializeAPIClients();

export const appClient = serviceRegistry.getClient("app");
export const authClient = serviceRegistry.getClient("auth");
export const channelClient = serviceRegistry.getClient("channel");
export const crmClient = serviceRegistry.getClient("crm");
