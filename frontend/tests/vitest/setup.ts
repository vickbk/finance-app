import "@testing-library/jest-dom/vitest";
import { resetConsole } from "@vickbk/tests/vitest";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { installCommandInvokers } from "./utils/command-invokers";

export const server = setupServer();
let cleanupCommandInvokers: (() => void) | undefined;

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
  cleanupCommandInvokers = installCommandInvokers();
});

afterEach(() => {
  server.resetHandlers();
  resetConsole();
});

afterAll(() => {
  server.close();
  if (cleanupCommandInvokers) {
    cleanupCommandInvokers();
  }
});
