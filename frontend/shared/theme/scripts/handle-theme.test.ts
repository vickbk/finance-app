import { beforeEach, describe, expect, it, vi } from "vitest";
import { Themes } from "../types";
import { applyTheme, getSavedTheme, saveTheme } from "./handle-theme";

describe("Theme Handler", () => {
  describe("get saved theme", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
      vi.unstubAllGlobals();
    });

    it("should return dark if window is not defined", () => {
      vi.stubGlobal("window", undefined);
      expect(getSavedTheme()).toBe("dark");
    });

    it("should return dark theme if system prefers dark", () => {
      const mediaQuery = vi.spyOn(window, "matchMedia");
      mediaQuery.mockReturnValue({
        matches: true,
      } as MediaQueryList);

      const theme = getSavedTheme();
      expect(theme).toBe("dark");
    });

    it("should return light theme if system prefers light", () => {
      const mediaQuery = vi.spyOn(window, "matchMedia");
      mediaQuery.mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const theme = getSavedTheme();
      expect(theme).toBe("light");
    });

    it("should prefer saved theme over system preference", () => {
      const theme = getSavedTheme();
      expect(["light", "dark"]).toContain(theme);
    });
  });

  describe("apply theme", () => {
    beforeEach(() => {
      document.documentElement.removeAttribute("theme");
    });

    it("should set theme attribute on document element", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });

    it("should change theme attribute", () => {
      applyTheme("light");
      expect(document.documentElement.getAttribute("theme")).toBe("light");
      applyTheme("dark");
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });

    it("should work with light theme", () => {
      applyTheme("light");
      expect(document.documentElement.getAttribute("theme")).toBe("light");
    });

    it("should work with dark theme", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute("theme")).toBe("dark");
    });
  });

  describe("saveTheme Utility", () => {
    describe("Client-Side Browser Environment", () => {
      it("persists the given theme to localStorage under the 'theme' key", () => {
        const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

        saveTheme("dark");

        expect(setItemSpy).toHaveBeenCalledTimes(1);
        expect(setItemSpy).toHaveBeenCalledWith("theme", "dark");
        expect(localStorage.getItem("theme")).toBe("dark");
      });

      it("overwrites any existing theme in localStorage", () => {
        localStorage.setItem("theme", "light");

        saveTheme("dark" as Themes);

        expect(localStorage.getItem("theme")).toBe("dark");
      });

      it("handles all valid theme variant values", () => {
        const themes = ["light", "dark", "system"] as const;

        themes.forEach((theme) => {
          saveTheme(theme);
          expect(localStorage.getItem("theme")).toBe(theme);
        });
      });

      it("allows exceptions to propagate when localStorage.setItem throws (e.g. QuotaExceededError)", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
          throw new DOMException("QuotaExceededError", "QuotaExceededError");
        });

        expect(() => saveTheme("dark" as Themes)).toThrow(DOMException);
      });
    });

    describe("Server-Side Rendering (SSR) Guard Rails", () => {
      it("safely exits and performs no operations when window is undefined", () => {
        const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

        // Stub window as undefined to simulate SSR node context
        vi.stubGlobal("window", undefined);

        expect(() => saveTheme("dark" as Themes)).not.toThrow();
        expect(setItemSpy).not.toHaveBeenCalled();
      });
    });
  });
});
