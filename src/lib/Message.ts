import { db } from "~/server/db";
import { messages } from "~/server/db/schema";

// Define an interface for the message parameters
interface CreateMessageParams {
  conversation_id: number;
  sender_id: number;
  recipient_id: number;
  message_text: string;
}

// Function to create a new message
export async function createMessage({
  conversation_id,
  sender_id,
  recipient_id,
  message_text,
}: CreateMessageParams): Promise<void> {
  try {
    await db.insert(messages).values({
      conversation_id,
      sender_id,
      recipient_id,
      message_text,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}
