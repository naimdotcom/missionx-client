// Service registry for managing multiple API clients

import { APIClient, type APIClientConfig } from "./api-client";

export type ServiceName = "auth" | "app" | "channel" | "crm";

interface ServiceConfig {
  name: ServiceName;
  baseURL: string;
  timeout?: number;
}

/**
 * Registry for managing multiple API clients
 * Provides lazy initialization and singleton pattern per service
 */
class ServiceRegistry {
  private clients: Map<ServiceName, APIClient> = new Map();
  private configs: Map<ServiceName, APIClientConfig> = new Map();

  /**
   * Register a service configuration (does not create client yet)
   */
  register(config: ServiceConfig): void {
    this.configs.set(config.name, {
      baseURL: config.baseURL,
      timeout: config.timeout,
      withCredentials: true,
    });
  }

  /**
   * Get or create an API client for the service
   * Uses lazy initialization pattern
   */
  getClient(name: ServiceName): APIClient {
    if (!this.clients.has(name)) {
      const config = this.configs.get(name);
      if (!config) {
        throw new Error(
          `Service "${name}" not registered. Call register() first.`,
        );
      }
      const client = new APIClient(config);
      this.clients.set(name, client);
    }
    return this.clients.get(name)!;
  }

  /**
   * Get all registered service names
   */
  getRegisteredServices(): ServiceName[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Check if a service is registered
   */
  isRegistered(name: ServiceName): boolean {
    return this.configs.has(name);
  }

  /**
   * Clear all clients and configs (useful for testing)
   */
  reset(): void {
    this.clients.clear();
    this.configs.clear();
  }
}

// Singleton instance
export const serviceRegistry = new ServiceRegistry();
