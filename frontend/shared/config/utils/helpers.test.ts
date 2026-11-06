import { describe, expect, it } from "vitest";
import { buildRequired } from "./helpers";

describe("buildRequired Utility", () => {
  describe("When value is provided (Truthy Strings)", () => {
    it("returns the exact value during the build phase", () => {
      expect(buildRequired(true, "secret-api-key")).toBe("secret-api-key");
    });

    it("returns the exact value outside of the build phase (runtime)", () => {
      expect(buildRequired(false, "secret-api-key")).toBe("secret-api-key");
    });

    it("returns non-empty string variations regardless of build phase flag", () => {
      expect(buildRequired(true, "https://api.example.com")).toBe(
        "https://api.example.com",
      );
      expect(buildRequired(false, "https://api.example.com")).toBe(
        "https://api.example.com",
      );
    });
  });

  describe("When value is undefined or omitted", () => {
    it("returns the fallback placeholder string during the build phase", () => {
      expect(buildRequired(true, undefined)).toBe("build-placeholder");
    });

    it("returns undefined outside of the build phase when value is undefined", () => {
      expect(buildRequired(false, undefined)).toBeUndefined();
    });

    it("returns the fallback placeholder when value argument is omitted entirely", () => {
      expect(buildRequired(true)).toBe("build-placeholder");
    });

    it("returns undefined when value argument is omitted outside the build phase", () => {
      expect(buildRequired(false)).toBeUndefined();
    });
  });

  describe("Falsy Value Fallbacks (Empty Strings)", () => {
    it("falls back to build-placeholder when value is an empty string during build phase", () => {
      expect(buildRequired(true, "")).toBe("build-placeholder");
    });

    it("falls back to undefined when value is an empty string outside build phase", () => {
      expect(buildRequired(false, "")).toBeUndefined();
    });
  });

  describe("Edge Cases & Special String Values", () => {
    it("treats whitespace-only strings as truthy values", () => {
      expect(buildRequired(true, "   ")).toBe("   ");
      expect(buildRequired(false, "   ")).toBe("   ");
    });

    it("treats literal falsy-sounding strings as truthy values", () => {
      expect(buildRequired(true, "0")).toBe("0");
      expect(buildRequired(false, "false")).toBe("false");
      expect(buildRequired(true, "null")).toBe("null");
      expect(buildRequired(false, "undefined")).toBe("undefined");
    });
  });
});
