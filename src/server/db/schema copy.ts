import {
  pgTableCreator,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

// Function to create tables with a specific prefix
export const createTable = pgTableCreator((name) => `msgcomm_${name}`);

// Define the User table
export const user = createTable("user", {
  user_id: serial("user_id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Define the UserStatus table
const UserStatus = createTable("user_status", {
  user_id: integer("user_id").notNull().references(() => user.user_id), // Foreign key
  is_online: boolean("is_online").notNull().default(false), // Boolean for online status
  last_seen: timestamp("last_seen").notNull().defaultNow(),
});

// Define the Messages table
export const messages = createTable("messages", {
  message_id: serial("message_id").primaryKey(), // Serial for auto-incrementing primary key
  conversation_id: integer("conversation_id").notNull().references(() => conversations.conversation_id), // Foreign key
  sender_id: integer("sender_id").notNull().references(() => user.user_id), // Foreign key
  recipient_id: integer("recipient_id").notNull().references(() => user.user_id), // Foreign key
  message_text: text("message_text").notNull(), // Text for the message content
  sent_at: timestamp("sent_at").defaultNow(),
  is_read: boolean("is_read").default(false), // Boolean to indicate if the message is read
  is_deleted: boolean("is_deleted").default(false), // Boolean to indicate if the message is deleted
});

// Define the Conversations table
export const conversations = createTable("conversations", {
  conversation_id: serial("conversation_id").primaryKey(), // Serial for auto-incrementing primary key
  user1_id: integer("user1_id").notNull().references(() => user.user_id), // Foreign key referencing user_id in the Users table
  user2_id: integer("user2_id").notNull().references(() => user.user_id), // Foreign key referencing user_id in the Users table
  started_at: timestamp("started_at").defaultNow(), // Timestamp with default current time
  last_message_at: timestamp("last_message_at").defaultNow(), // Timestamp with default current time
  is_archived: boolean("is_archived").default(false), // Boolean with default false
});