import { describe, expect, it } from "vitest";
import { jitter, mulberry32 } from "./random.js";

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces a different first value for a different seed", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it("stays within [0, 1)", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 50; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("jitter", () => {
  it("stays within [-amount, amount]", () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 50; i++) {
      const value = jitter(rng, 10);
      expect(Math.abs(value)).toBeLessThanOrEqual(10);
    }
  });
});
