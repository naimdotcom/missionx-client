import { pgTable, text, timestamp, uuid, jsonb, varchar, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const channelTypeEnum = pgEnum('channel_type', ['facebook_page', 'instagram_business']);
export const messageDirectionEnum = pgEnum('message_direction', ['inbound', 'outbound']);
export const contentTypeEnum = pgEnum('content_type', ['text', 'image', 'video', 'audio', 'file', 'reaction', 'sticker']);
export const webhookEventStatusEnum = pgEnum('webhook_event_status', ['pending', 'processing', 'processed', 'failed']);

// Organizations table - tenant isolation
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users table - agent accounts
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Channel connections table - OAuth tokens per channel
export const channelConnections = pgTable('channel_connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  type: channelTypeEnum('type').notNull(),
  platformId: text('platform_id').notNull(), // Facebook Page ID or Instagram Business Account ID
  platformName: text('platform_name').notNull(),
  accessToken: text('access_token').notNull(),
  tokenExpiresAt: timestamp('token_expires_at'),
  refreshToken: text('refresh_token'),
  isActive: boolean('is_active').default(true).notNull(),
  metadata: jsonb('metadata'), // Store additional platform-specific data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contacts table - external customers (deduplicated by platform ID)
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  platformId: text('platform_id').notNull(), // Facebook/Instagram user ID
  platformType: text('platform_type').notNull(), // 'facebook' or 'instagram'
  name: text('name'),
  profilePicture: text('profile_picture'),
  metadata: jsonb('metadata'), // Store additional profile data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversations table - threads linking contact + channel
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  channelConnectionId: uuid('channel_connection_id').references(() => channelConnections.id).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  platformThreadId: text('platform_thread_id').notNull(), // Platform's conversation/thread ID
  lastMessageAt: timestamp('last_message_at'),
  isRead: boolean('is_read').default(false).notNull(),
  assignedToUserId: uuid('assigned_to_user_id').references(() => users.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table - unified message stream
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  platformMessageId: text('platform_message_id').notNull().unique(), // For idempotency
  direction: messageDirectionEnum('direction').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  text: text('text'),
  payload: jsonb('payload'), // Attachments, reactions, stickers, etc.
  sentByUserId: uuid('sent_by_user_id').references(() => users.id), // For outbound messages
  sentByContactId: uuid('sent_by_contact_id').references(() => contacts.id), // For inbound messages
  sentAt: timestamp('sent_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Webhook events table - raw event log for idempotency and replay
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  eventId: text('event_id').notNull().unique(), // Platform's event ID for idempotency
  source: text('source').notNull(), // 'facebook' or 'instagram'
  eventType: text('event_type').notNull(), // 'message.received', 'message.read', etc.
  payload: jsonb('payload').notNull(), // Raw webhook payload
  status: webhookEventStatusEnum('status').default('pending').notNull(),
  processedAt: timestamp('processed_at'),
  errorMessage: text('error_message'),
  retryCount: varchar('retry_count', { length: 10 }).default('0').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type ChannelConnection = typeof channelConnections.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
