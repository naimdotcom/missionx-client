// Core API types and utilities
export * from "./core/api.types";
export { APIClient, type APIClientConfig } from "./core/api-client";
export { serviceRegistry, type ServiceName } from "./core/service-registry";
export { initializeAPIClients } from "./core/init";

// Endpoints and query keys
export { API_ENDPOINTS, PUBLIC_ROUTES } from "./endpoints";
export * from "./query-keys";

// Auth Domain
export * from "./services/auth/auth.hooks";
export * from "./services/auth/auth.service";
export * from "./services/auth/auth.types";

// Channels Domain
export * from "./services/channels";

// CRM Domain
export * from "./services/crm";

// Apps Domain
export * from "./services/apps/apps.service";
export * from "./services/apps/apps.hook";
export * from "./services/apps/apps.type";

// Users Domain
export * from "./services/user/user.service";
export * from "./services/user/user.type";

// Inbox Domain
export * from "./services/inbox/inbox.service";
export * from "./services/inbox/inbox.hook";
export * from "./services/inbox/inbox.type";

// Media/Upload Domain
export * from "./services/media/media.service";
export * from "./services/media/media.hook";
export * from "./services/media/media.type";

// Soketi Domain
export * from "./services/soketi/soketi.service";
