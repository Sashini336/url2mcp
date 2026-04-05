import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "../rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows first request for a user", () => {
    expect(checkRateLimit("user-1")).toEqual({ allowed: true, remaining: 1 });
  });

  it("allows second request for same user", () => {
    checkRateLimit("user-1");
    expect(checkRateLimit("user-1")).toEqual({ allowed: true, remaining: 0 });
  });

  it("blocks third request for same user", () => {
    checkRateLimit("user-1");
    checkRateLimit("user-1");
    const result = checkRateLimit("user-1");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks users independently", () => {
    checkRateLimit("user-1");
    expect(checkRateLimit("user-2")).toEqual({ allowed: true, remaining: 1 });
  });
});
