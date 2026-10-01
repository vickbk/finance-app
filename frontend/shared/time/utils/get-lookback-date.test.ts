import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLookbackDate } from "./get-lookback-date";

describe("getLookbackDate Utility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Basic Lookback & Today (0 Days)", () => {
    it("returns today's formatted date when lookback is 0 days", () => {
      // Set fixed system time: May 15, 2026
      vi.setSystemTime(new Date(2026, 4, 15));

      expect(getLookbackDate(0)).toBe("2026-05-15");
    });

    it("calculates date N days in the past within the same month", () => {
      vi.setSystemTime(new Date(2026, 4, 15)); // May 15, 2026

      expect(getLookbackDate(7)).toBe("2026-05-08");
    });

    it("handles large lookback periods (e.g. 365 days)", () => {
      vi.setSystemTime(new Date(2026, 4, 15)); // May 15, 2026

      // 2025 was not a leap year, so 365 days back from May 15, 2026 is May 15, 2025
      expect(getLookbackDate(365)).toBe("2025-05-15");
    });
  });

  describe("Date Boundary Crossings", () => {
    it("crosses month boundaries into the previous month correctly", () => {
      vi.setSystemTime(new Date(2026, 4, 5)); // May 5, 2026

      // May 5 - 10 days = April 25, 2026
      expect(getLookbackDate(10)).toBe("2026-04-25");
    });

    it("crosses year boundaries into the previous year correctly", () => {
      vi.setSystemTime(new Date(2026, 0, 5)); // Jan 5, 2026

      // Jan 5, 2026 - 10 days = Dec 26, 2025
      expect(getLookbackDate(10)).toBe("2025-12-26");
    });

    it("handles leap year February lookbacks correctly", () => {
      vi.setSystemTime(new Date(2024, 2, 5)); // March 5, 2024 (Leap year)

      // March 5, 2024 - 10 days = Feb 24, 2024 (February has 29 days)
      expect(getLookbackDate(10)).toBe("2024-02-24");
    });

    it("handles non-leap year February lookbacks correctly", () => {
      vi.setSystemTime(new Date(2026, 2, 5)); // March 5, 2026 (Non-leap year)

      // March 5, 2026 - 10 days = Feb 23, 2026 (February has 28 days)
      expect(getLookbackDate(10)).toBe("2026-02-23");
    });
  });

  describe("Future Dates (Negative Days)", () => {
    it("calculates future dates when provided negative days", () => {
      vi.setSystemTime(new Date(2026, 4, 15)); // May 15, 2026

      // Look back -5 days = 5 days in the future
      expect(getLookbackDate(-5)).toBe("2026-05-20");
    });

    it("crosses month boundary into the future with negative days", () => {
      vi.setSystemTime(new Date(2026, 4, 28)); // May 28, 2026

      // May 28 + 5 days = June 2, 2026
      expect(getLookbackDate(-5)).toBe("2026-06-02");
    });
  });

  describe("Edge Cases & Special Input Values", () => {
    it("handles fractional numbers by delegating day arithmetic to Date.setDate", () => {
      vi.setSystemTime(new Date(2026, 4, 15, 12, 0, 0)); // May 15, 2026 12:00 PM

      // Passing 1.5 days subtracts 1.5 days (May 13, 12:00 PM) -> May 13
      expect(getLookbackDate(1.5)).toBe("2026-05-13");
    });

    it("returns NaN placeholder string when provided NaN", () => {
      vi.setSystemTime(new Date(2026, 4, 15));

      expect(getLookbackDate(NaN)).toBe("NaN-NaN-NaN");
    });
  });
});
