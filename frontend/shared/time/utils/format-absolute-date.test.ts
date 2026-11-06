import { describe, expect, it } from "vitest";
import { formatAbsoluteDate } from "./format-absolute-date";

describe("formatAbsoluteDate Utility", () => {
  describe("Standard Formatting & Padding", () => {
    it("pads single-digit month and single-digit day with leading zeros", () => {
      // Jan 5, 2026
      const timestamp = new Date(2026, 0, 5).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2026-01-05");
    });

    it("pads single-digit month with double-digit day", () => {
      // Apr 18, 2026
      const timestamp = new Date(2026, 3, 18).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2026-04-18");
    });

    it("pads double-digit month with single-digit day", () => {
      // Oct 3, 2026
      const timestamp = new Date(2026, 9, 3).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2026-10-03");
    });

    it("formats double-digit month and double-digit day without adding extra zeros", () => {
      // Dec 25, 2026
      const timestamp = new Date(2026, 11, 25).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2026-12-25");
    });
  });

  describe("Calendar Boundaries & Leap Years", () => {
    it("correctly handles leap year dates (February 29)", () => {
      // Feb 29, 2024 (Leap year)
      const timestamp = new Date(2024, 1, 29).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2024-02-29");
    });

    it("formats the first day of the year (January 1)", () => {
      const timestamp = new Date(2026, 0, 1).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2026-01-01");
    });

    it("formats the last day of the year (December 31)", () => {
      const timestamp = new Date(2026, 11, 31).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2026-12-31");
    });
  });

  describe("Pre-Epoch & Extreme Dates", () => {
    it("formats dates prior to Unix Epoch (negative timestamps)", () => {
      // July 20, 1969
      const timestamp = new Date(1969, 6, 20).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("1969-07-20");
    });

    it("formats far future dates correctly", () => {
      // Aug 15, 2099
      const timestamp = new Date(2099, 7, 15).getTime();
      expect(formatAbsoluteDate(timestamp)).toBe("2099-08-15");
    });
  });

  describe("Invalid Input Handling", () => {
    it("returns NaN placeholder string when given NaN or invalid timestamp", () => {
      expect(formatAbsoluteDate(NaN)).toBe("NaN-NaN-NaN");
    });
  });
});
