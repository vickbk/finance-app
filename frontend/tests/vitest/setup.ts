import "@testing-library/jest-dom/vitest";
import { resetConsole } from "@vickbk/tests/vitest";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetConsole();
});
afterAll(() => server.close());
