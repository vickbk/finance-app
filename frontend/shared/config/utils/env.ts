import type { Config } from "../types";
import { buildRequired } from "./helpers";
import { configSchema } from "./schema";

let cachedConfig: Config | null = null;

const getServerConfig = (): Config => {
  if (cachedConfig) return cachedConfig;

  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  const parsed = configSchema.safeParse({
    BACKEND_URL: buildRequired(isBuildPhase, process.env.BACKEND_URL),
    AUTH_SECRET: buildRequired(isBuildPhase, process.env.AUTH_SECRET),
    AUTH_GOOGLE_ID: buildRequired(isBuildPhase, process.env.AUTH_GOOGLE_ID),
    AUTH_GOOGLE_SECRET: buildRequired(
      isBuildPhase,
      process.env.AUTH_GOOGLE_SECRET,
    ),
    AI_PROVIDER_KEY: buildRequired(isBuildPhase, process.env.AI_PROVIDER_KEY),
    GOOGLE_GENERATIVE_AI_API_KEY: buildRequired(
      isBuildPhase,
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    ),
    GEMINI_VERSION: process.env.GEMINI_VERSION,

    ...getClientConfig(),
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Environment validation failed: ${errorMessages}`);
  }

  cachedConfig = parsed.data;
  return cachedConfig as Config;
};

const getClientConfig = () => ({
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_CHATBOT_STORAGE_KEY:
    process.env.NEXT_PUBLIC_CHATBOT_STORAGE_KEY || "movie-guide-app",
});

export const config = new Proxy({} as Config, {
  get(_, prop) {
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      if (!prop.toString().includes("NEXT_PUBLIC")) {
        throw new Error(
          `Attempted to access server-side environment variable ${String(
            prop,
          )} from a Client Component.`,
        );
      }
      return getClientConfig()[
        prop as keyof ReturnType<typeof getClientConfig>
      ];
    }

    return getServerConfig()[prop as keyof Config];
  },
});
