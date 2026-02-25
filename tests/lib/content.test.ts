import { describe, it, expect } from "vitest";
import { pick } from "@/lib/content";

describe("pick", () => {
  it("returns value when key exists and is non-empty", () => {
    const map = { "home.title": "Mi título" };
    expect(pick(map, "home.title", "Fallback")).toBe("Mi título");
  });

  it("returns fallback when key is missing", () => {
    const map: Record<string, string> = {};
    expect(pick(map, "missing", "Fallback")).toBe("Fallback");
  });

  it("returns fallback when value is empty string", () => {
    const map = { key: "" };
    expect(pick(map, "key", "Fallback")).toBe("Fallback");
  });

  it("returns fallback when value is only whitespace", () => {
    const map = { key: "   " };
    expect(pick(map, "key", "Fallback")).toBe("Fallback");
  });

  it("returns value when trimmed is non-empty", () => {
    const map = { key: "  text  " };
    expect(pick(map, "key", "Fallback")).toBe("  text  ");
  });
});
