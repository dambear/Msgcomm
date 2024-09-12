import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const app = new OpenAPIHono();

const createMessageSchema = z.object({
  conversation_id: z.number().int(),
  sender_id: z.number().int(),
  recipient_id: z.number().int(),
  message_text: z.string(),
});

const messageResponseSchema = z.object({
  message_id: z.number().int(),
  conversation_id: z.number().int(),
  sender_id: z.number().int(),
  recipient_id: z.number().int(),
  message_text: z.string(),
  sent_at: z.string(), // ISO date string
  is_read: z.boolean(),
  is_deleted: z.boolean(),
});

const createMessageRoute = createRoute({
  method: 'POST',
  path: '/messages',
  requestBody: {
    content: {
      'application/json': {
        schema: createMessageSchema,
      },
    },
    description: 'Send a new message within a conversation by specifying the conversation ID, sender ID, recipient ID, and the message content.',
  },
  responses: {
    201: { // 201 Created is more appropriate for a successful creation
      content: {
        'application/json': {
          schema: messageResponseSchema,
        },
      },
      description: 'Message sent successfully',
    },
  },
});

// Example endpoint integration
app.openapi(createMessageRoute, async (c) => {
  const { conversation_id, sender_id, recipient_id, message_text } = c.request.body;
  
  // Insert message into the database and fetch the created message
  const result = await db.query(
    'INSERT INTO Messages (conversation_id, sender_id, recipient_id, message_text) VALUES ($1, $2, $3, $4) RETURNING *',
    [conversation_id, sender_id, recipient_id, message_text]
  );
  
  const newMessage = result.rows[0];
  return c.json(newMessage, { status: 201 });
});

app.openapi(fooRoute, (c) => {
  return c.json({ foo: "hello foo" }, 200);
});
