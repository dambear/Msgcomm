import { db } from "~/server/db";
import { conversations } from "~/server/db/schema";

interface CreateConversationParams {
  user1_id: number;
  user2_id: number;
}

// Function to create a new conversation
export async function createConversation({
  user1_id,
  user2_id,
}: CreateConversationParams): Promise<void> {
  try {
    // Ensure user1_id is always less than user2_id to handle duplicates consistently
    const [minUserId, maxUserId] = user1_id < user2_id ? [user1_id, user2_id] : [user2_id, user1_id];
    
    // Check if a conversation already exists with the given user IDs
    const existingConversation = await db
      .select(conversations)
      .where({ user1_id: minUserId, user2_id: maxUserId })
      .first();

    // If a conversation exists, do not create a new one
    if (existingConversation) {
      console.log('Conversation already exists.');
      return;
    }

    // Insert new conversation with all fields
    await db.insert(conversations).values({
      user1_id: minUserId,
      user2_id: maxUserId,
      // Use default values for timestamps and archived status
    });

    console.log('New conversation created.');
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}
