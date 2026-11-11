import { describe, it, expect } from "vitest";
import { formatARS, formatDate, daysUntil, getStatus, cn, slugify, truncate, generateId } from "@/lib/utils";

describe("lib/utils", () => {
  describe("formatARS", () => {
    it("formats positive numbers as ARS currency", () => {
      expect(formatARS(28000)).toContain("$");
      expect(formatARS(28000)).toContain("28");
    });

    it("formats zero", () => {
      expect(formatARS(0)).toBe("$0");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date to Spanish locale", () => {
      const result = formatDate("2026-01-15");
      expect(result).toContain("ene");
      expect(result).toContain("2026");
    });
  });

  describe("daysUntil", () => {
    it("returns positive for future dates", () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const iso = future.toISOString().split("T")[0];
      expect(daysUntil(iso)).toBeGreaterThan(0);
    });

    it("returns negative for past dates", () => {
      const past = new Date();
      past.setDate(past.getDate() - 5);
      const iso = past.toISOString().split("T")[0];
      expect(daysUntil(iso)).toBeLessThan(0);
    });
  });

  describe("getStatus", () => {
    it("returns vencida for overdue", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const iso = past.toISOString().split("T")[0];
      expect(getStatus(iso)).toBe("vencida");
    });

    it("returns por_vencer for within 7 days", () => {
      const soon = new Date();
      soon.setDate(soon.getDate() + 3);
      const iso = soon.toISOString().split("T")[0];
      expect(getStatus(iso)).toBe("por_vencer");
    });

    it("returns al_dia for beyond 7 days", () => {
      const later = new Date();
      later.setDate(later.getDate() + 15);
      const iso = later.toISOString().split("T")[0];
      expect(getStatus(iso)).toBe("al_dia");
    });
  });

  describe("cn", () => {
    it("joins class names", () => {
      expect(cn("a", "b", "c")).toBe("a b c");
    });

    it("filters falsy values", () => {
      expect(cn("a", false && "b", null, "c")).toBe("a c");
    });
  });

  describe("slugify", () => {
    it("converts to lowercase and replaces spaces", () => {
      expect(slugify("Hola Mundo")).toBe("hola-mundo");
    });

    it("removes accents", () => {
      expect(slugify("Música")).toBe("musica");
    });

    it("handles special chars", () => {
      expect(slugify("Test@#$%")).toBe("test");
    });
  });

  describe("truncate", () => {
    it("truncates long strings", () => {
      expect(truncate("Hello World", 8)).toBe("Hello…");
    });

    it("returns original if shorter", () => {
      expect(truncate("Hi", 10)).toBe("Hi");
    });
  });

  describe("generateId", () => {
    it("generates unique ids", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });

    it("includes prefix", () => {
      expect(generateId("user")).toMatch(/^user_\d+_[a-z0-9]+$/);
    });
  });
});