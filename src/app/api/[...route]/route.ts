import { handle } from "hono/vercel";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// Create an instance of OpenAPIHono
const app = new OpenAPIHono();

// Define your OpenAPI specification
app.doc("/api/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

// Define Swagger UI endpoint
app.get("/api/ui", swaggerUI({ url: "/api/doc" }));

const basicRoute = createRoute({
  method: "get",
  path: "/basic/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            hello: z.string(),
          }),
        },
      },
      description: "say hello",
    },
  },
});

// Example endpoint
app.openapi(basicRoute, (c) => {
  return c.json({
    hello: "Hello from Hono with OpenAPI!",
  });
});

// Export handler for Vercel Edge Functions
export const GET = handle(app);
