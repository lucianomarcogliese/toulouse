import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getSessionFromToken: vi.fn(),
}));

const { cookies } = await import("next/headers");
const { getSessionFromToken } = await import("@/lib/auth");
const { requireAdmin } = await import("@/lib/requireAdmin");

type CookieStore = Awaited<ReturnType<typeof cookies>>;

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns ok: false when no cookie", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => undefined,
      has: () => false,
      set: () => {},
      delete: () => {},
      getAll: () => [],
    } as CookieStore);
    vi.mocked(getSessionFromToken).mockResolvedValue(null);

    const result = await requireAdmin();
    expect(result.ok).toBe(false);
    expect(result.session).toBeNull();
  });

  it("returns ok: false when token present but session invalid", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) => (name === "admin_session" ? { value: "abc" } : undefined),
      has: () => true,
      set: () => {},
      delete: () => {},
      getAll: () => [],
    } as CookieStore);
    vi.mocked(getSessionFromToken).mockResolvedValue(null);

    const result = await requireAdmin();
    expect(result.ok).toBe(false);
    expect(result.session).toBeNull();
  });

  it("returns ok: true when cookie and valid session", async () => {
    const mockSession = { id: "1", userId: "u1", user: { email: "a@b.com" } };
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) => (name === "admin_session" ? { value: "valid-token" } : undefined),
      has: () => true,
      set: () => {},
      delete: () => {},
      getAll: () => [],
    } as CookieStore);
    vi.mocked(getSessionFromToken).mockResolvedValue(mockSession as Awaited<ReturnType<typeof getSessionFromToken>>);

    const result = await requireAdmin();
    expect(result.ok).toBe(true);
    expect(result.session).toEqual(mockSession);
  });
});
