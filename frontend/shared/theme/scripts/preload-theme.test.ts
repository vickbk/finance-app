import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock handle-theme BEFORE top-level module import to capture immediate side effects
vi.mock("./handle-theme", () => ({
  applyTheme: vi.fn(),
  getSavedTheme: vi.fn(),
}));

describe("Theme Preload Script Side-Effects", () => {
  beforeEach(() => {
    // Reset module registry and mock state so top-level evaluation re-runs per test
    vi.resetModules();
    vi.clearAllMocks();
  });

  async function executePreloadScript() {
    // Dynamic import triggers top-level code execution on each call after vi.resetModules()
    await import("./preload-theme");
  }

  describe("Theme Initialization Sequence", () => {
    it("retrieves the saved theme and applies it immediately on script load", async () => {
      const { applyTheme, getSavedTheme } = await import("./handle-theme");
      vi.mocked(getSavedTheme).mockReturnValue("dark");

      await executePreloadScript();

      expect(getSavedTheme).toHaveBeenCalledTimes(1);
      expect(applyTheme).toHaveBeenCalledTimes(1);
      expect(applyTheme).toHaveBeenCalledWith("dark");
    });

    it("guarantees getSavedTheme executes before applyTheme", async () => {
      const { applyTheme, getSavedTheme } = await import("./handle-theme");
      const executionOrder: string[] = [];

      vi.mocked(getSavedTheme).mockImplementation(() => {
        executionOrder.push("getSavedTheme");
        return "light";
      });

      vi.mocked(applyTheme).mockImplementation(() => {
        executionOrder.push("applyTheme");
      });

      await executePreloadScript();

      expect(executionOrder).toEqual(["getSavedTheme", "applyTheme"]);
    });
  });

  describe("Theme Value Propagation", () => {
    it("pipes 'light' theme selection to applyTheme", async () => {
      const { applyTheme, getSavedTheme } = await import("./handle-theme");
      vi.mocked(getSavedTheme).mockReturnValue("light");

      await executePreloadScript();

      expect(applyTheme).toHaveBeenCalledWith("light");
    });

    it("pipes 'system' theme selection to applyTheme", async () => {
      const { applyTheme, getSavedTheme } = await import("./handle-theme");
      vi.mocked(getSavedTheme).mockReturnValue("system");

      await executePreloadScript();

      expect(applyTheme).toHaveBeenCalledWith("system");
    });

    it("handles fallback or default theme return values (e.g. undefined)", async () => {
      const { applyTheme, getSavedTheme } = await import("./handle-theme");
      vi.mocked(getSavedTheme).mockReturnValue(undefined as never);

      await executePreloadScript();

      expect(applyTheme).toHaveBeenCalledWith(undefined);
    });
  });
});
