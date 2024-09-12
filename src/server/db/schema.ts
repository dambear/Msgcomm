import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
  text,
  enum as pgEnum,
} from "drizzle-orm/pg-core";

// Function to create tables with a custom prefix
export const createTable = pgTableCreator((name) => `msgcomm_${name}`);

// Users Table
export const users = createTable(
  "users",
  {
    user_id: serial("user_id").primaryKey(),
    username: varchar("username", { length: 50 }).unique().notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (example) => ({
    usernameIndex: index("idx_username").on(example.username),
  })
);

// Messages Table
export const messages = createTable(
  "messages",
  {
    message_id: serial("message_id").primaryKey(),
    conversation_id: integer("conversation_id").notNull(),
    sender_id: integer("sender_id").notNull(),
    recipient_id: integer("recipient_id").notNull(),
    message_text: text("message_text").notNull(),
    sent_at: timestamp("sent_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
    is_read: boolean("is_read").default(false),
    is_deleted: boolean("is_deleted").default(false),
  },
  (example) => ({
    senderIdIndex: index("idx_sender_id").on(example.sender_id),
    recipientIdIndex: index("idx_recipient_id").on(example.recipient_id),
  })
);

// Conversations Table
export const conversations = createTable(
  "conversations",
  {
    conversation_id: serial("conversation_id").primaryKey(),
    user1_id: integer("user1_id").notNull(),
    user2_id: integer("user2_id").notNull(),
    started_at: timestamp("started_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
    last_message_at: timestamp("last_message_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
    is_archived: boolean("is_archived").default(false),
  },
  (example) => ({
    uniqueUsers: index("unique_users").on(example.user1_id, example.user2_id),
  })
);

// User Status Table
export const userStatus = createTable(
  "user_status",
  {
    user_id: integer("user_id").primaryKey(),
    status: pgEnum("status", ['online', 'offline', 'busy', 'away'])
      .default('offline'),
    last_seen: timestamp("last_seen", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
  }
);

// User Preferences Table
export const userPreferences = createTable(
  "user_preferences",
  {
    user_id: integer("user_id").primaryKey(),
    notifications_enabled: boolean("notifications_enabled").default(true),
    theme: varchar("theme", { length: 50 }).default('light'),
  }
);
