import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Sohan Next.js API Documentation",
        version: "1.0.0",
        description: "API documentation with Swagger, Prisma, and PostgreSQL",
      },
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              email: { type: "string", format: "email", example: "john@example.com" },
              name: { type: "string", example: "John Doe" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CreateUserInput: {
            type: "object",
            required: ["email"],
            properties: {
              email: { type: "string", format: "email", example: "john@example.com" },
              name: { type: "string", example: "John Doe" },
            },
          },
        },
      },
    },
  });
  return spec;
};
