import z from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_CHATBOT_STORAGE_KEY: z.string().default(""),
});
export const configSchema = z.object({
  AUTH_SECRET: z
    .string({
      message: "AUTH_SECRET is required",
    })
    .min(1, "AUTH_SECRET cannot be empty"),

  AUTH_GOOGLE_ID: z
    .string({
      message: "AUTH_GOOGLE_ID is required",
    })
    .min(1, "AUTH_GOOGLE_ID cannot be empty"),

  AUTH_GOOGLE_SECRET: z
    .string({
      message: "AUTH_GOOGLE_SECRET is required",
    })
    .min(1, "AUTH_GOOGLE_SECRET cannot be empty"),

  BACKEND_URL: z
    .string({
      message: "BACKEND_URL is required",
    })
    .min(1, "BACKEND_URL cannot be empty"),
  GEMINI_VERSION: z.string().default("gemini-3.1-flash-lite-preview"),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(
    "GOOGLE_GENERATIVE_AI_API_KEY cannot be empty",
  ),
  ...clientSchema.shape,
});
