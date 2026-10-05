// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Palette } from "../lib/types";

// Keep AiPaletteError / AI_PAUSE_MS real (the hook branches on them); only the network edges are faked.
vi.mock("../lib/aiPalette", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/aiPalette")>()),
  fetchAiConfig: vi.fn(),
  paletteFromThemeTextAI: vi.fn(),
}));

const { AI_PAUSE_MS, AiPaletteError, fetchAiConfig, paletteFromThemeTextAI } = await import("../lib/aiPalette");
const { paletteFromThemeText } = await import("../lib/textToPalette");
const { DEFAULT_THEME, useGeneratorState } = await import("./useGeneratorState");

const fetchConfig = vi.mocked(fetchAiConfig);
const generateAi = vi.mocked(paletteFromThemeTextAI);

const BASE_CONFIG = { available: true, provider: "openai", demo: true, paused: false };
const PROPOSED = { primary: { h: 200, s: 70, l: 45 } } as never;

function aiResult(rationale = "Calm and coastal.") {
  return { palette: paletteFromThemeText("ocean") as Palette, proposedColors: PROPOSED, rationale };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const budgetError = () =>
  new AiPaletteError("The demo's shared AI budget is used up for this month.", {
    status: 503,
    retryable: false,
    code: "budget_exhausted",
  });

async function setup(config: Partial<typeof BASE_CONFIG> = {}) {
  fetchConfig.mockResolvedValue({ ...BASE_CONFIG, ...config });
  const onGenerate = vi.fn();
  const current = {
    palette: paletteFromThemeText(DEFAULT_THEME),
    source: { kind: "text" as const, label: DEFAULT_THEME },
  };
  const hook = renderHook(() => useGeneratorState({ onGenerate, current }));
  await act(async () => {}); // let fetchAiConfig resolve
  return { ...hook, onGenerate };
}

type Hook = Awaited<ReturnType<typeof setup>>;

/** Turn AI on and type a theme, ready for generate(). */
async function armAi(h: Hook, theme = "ocean at dusk") {
  act(() => h.result.current.setUseAi(true));
  act(() => h.result.current.setText(theme));
}

beforeEach(() => {
  fetchConfig.mockReset();
  generateAi.mockReset();
});

afterEach(() => vi.useRealTimers());

describe("AI availability and the toggle", () => {
  it("exposes what /api/config reported", async () => {
    const h = await setup();
    expect(h.result.current.aiAvailable).toBe(true);
    expect(h.result.current.aiConfig?.provider).toBe("openai");
    expect(h.result.current.aiPaused).toBe(false);
  });

  it("ignores switching AI on while the server reports a pause", async () => {
    const h = await setup({ paused: true });
    expect(h.result.current.aiPaused).toBe(true);
    act(() => h.result.current.setUseAi(true));
    expect(h.result.current.useAi).toBe(false);
  });

});

describe("generating with AI", () => {
  it("applies the AI palette with its rationale as the note", async () => {
    const h = await setup();
    generateAi.mockResolvedValue(aiResult("Calm and coastal."));
    await armAi(h);

    await act(() => h.result.current.generate());

    expect(h.onGenerate).toHaveBeenCalledTimes(1);
    const [, source] = h.onGenerate.mock.calls[0];
    expect(source).toMatchObject({ kind: "text", label: "ocean at dusk", note: "Calm and coastal.", proposedColors: PROPOSED });
    expect(h.result.current.isProcessing).toBe(false);
    expect(h.result.current.error).toBeNull();
  });

  it("falls back to a generic note when the rationale is empty", async () => {
    const h = await setup();
    generateAi.mockResolvedValue(aiResult(""));
    await armAi(h);
    await act(() => h.result.current.generate());
    expect(h.onGenerate.mock.calls[0][1].note).toBe("AI-generated");
  });

  it("sends the trimmed theme and does nothing for blank text", async () => {
    const h = await setup();
    generateAi.mockResolvedValue(aiResult());
    await armAi(h, "   ");
    await act(() => h.result.current.generate());
    expect(generateAi).not.toHaveBeenCalled();
    expect(h.onGenerate).not.toHaveBeenCalled();

    act(() => h.result.current.setText("  forest  "));
    await act(() => h.result.current.generate());
    expect(generateAi.mock.calls[0][0]).toBe("forest");
  });

  it("shows a server error as an error and keeps AI on so the user can retry", async () => {
    const h = await setup();
    generateAi.mockRejectedValue(new AiPaletteError("AI palette generation failed. Try again, or generate without AI.", { status: 502 }));
    await armAi(h);

    await act(() => h.result.current.generate());

    expect(h.result.current.error).toMatch(/generation failed/);
    expect(h.result.current.aiNotice).toBeNull();
    expect(h.result.current.useAi).toBe(true);
    expect(h.result.current.aiPaused).toBe(false);
    expect(h.onGenerate).not.toHaveBeenCalled();
  });

  it("uses a generic message for an unexpected (non-AiPaletteError) failure", async () => {
    const h = await setup();
    generateAi.mockRejectedValue(new TypeError("boom"));
    await armAi(h);
    await act(() => h.result.current.generate());
    expect(h.result.current.error).toBe("AI generation failed. Try again.");
  });

  it("clears a previous error when the next attempt starts", async () => {
    const h = await setup();
    generateAi.mockRejectedValueOnce(new AiPaletteError("nope", { status: 502 }));
    await armAi(h);
    await act(() => h.result.current.generate());
    expect(h.result.current.error).toBe("nope");

    const pending = deferred<ReturnType<typeof aiResult>>();
    generateAi.mockReturnValueOnce(pending.promise);
    let run!: Promise<void>;
    act(() => {
      run = h.result.current.generate() as Promise<void>;
    });
    expect(h.result.current.error).toBeNull();
    expect(h.result.current.isProcessing).toBe(true);
    await act(async () => {
      pending.resolve(aiResult());
      await run;
    });
  });
});

describe("budget exhausted", () => {
  async function hitBudget(h: Hook) {
    generateAi.mockRejectedValueOnce(budgetError());
    await armAi(h);
    await act(() => h.result.current.generate());
  }

  it("switches AI off with a neutral notice instead of an error", async () => {
    const h = await setup();
    await hitBudget(h);

    expect(h.result.current.useAi).toBe(false);
    expect(h.result.current.aiPaused).toBe(true);
    expect(h.result.current.error).toBeNull();
    expect(h.result.current.aiNotice).toMatch(/budget is used up.*AI is switched off for now/);
    expect(h.onGenerate).not.toHaveBeenCalled();
    expect(h.result.current.isProcessing).toBe(false);
  });

  it("makes the next Generate use the built-in generator, with no further AI call", async () => {
    const h = await setup();
    await hitBudget(h);

    await act(() => h.result.current.generate());

    expect(generateAi).toHaveBeenCalledTimes(1);
    expect(h.onGenerate).toHaveBeenCalledTimes(1);
    const [, source] = h.onGenerate.mock.calls[0];
    expect(source).toEqual({ kind: "text", label: "ocean at dusk" });
  });

  it("unpauses on its own after the cooldown, and switching on then clears the notice", async () => {
    vi.useFakeTimers();
    const h = await setup();
    await hitBudget(h);
    expect(h.result.current.aiPaused).toBe(true);

    act(() => {
      vi.advanceTimersByTime(AI_PAUSE_MS - 1);
    });
    expect(h.result.current.aiPaused).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(h.result.current.aiPaused).toBe(false);

    act(() => h.result.current.setUseAi(true));
    expect(h.result.current.useAi).toBe(true);
    expect(h.result.current.aiNotice).toBeNull();
  });

});

describe("concurrency and cancellation", () => {
  it("passes an AbortSignal and aborts the previous request when a new one starts", async () => {
    const h = await setup();
    const first = deferred<ReturnType<typeof aiResult>>();
    const second = deferred<ReturnType<typeof aiResult>>();
    generateAi.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    await armAi(h);

    let run1!: Promise<void>;
    let run2!: Promise<void>;
    act(() => {
      run1 = h.result.current.generate() as Promise<void>;
    });
    const signal1 = generateAi.mock.calls[0][1] as AbortSignal;
    expect(signal1.aborted).toBe(false);

    act(() => {
      run2 = h.result.current.generate() as Promise<void>;
    });
    expect(signal1.aborted).toBe(true);

    await act(async () => {
      second.resolve(aiResult("second"));
      first.resolve(aiResult("first")); // late, superseded
      await Promise.all([run1, run2]);
    });

    expect(h.onGenerate).toHaveBeenCalledTimes(1);
    expect(h.onGenerate.mock.calls[0][1].note).toBe("second");
  });

  it("a superseded request's failure (even out-of-budget) never overwrites the live one", async () => {
    const h = await setup();
    const first = deferred<ReturnType<typeof aiResult>>();
    const second = deferred<ReturnType<typeof aiResult>>();
    generateAi.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    await armAi(h);

    let run1!: Promise<void>;
    let run2!: Promise<void>;
    act(() => {
      run1 = h.result.current.generate() as Promise<void>;
    });
    act(() => {
      run2 = h.result.current.generate() as Promise<void>;
    });

    await act(async () => {
      first.reject(budgetError()); // the worst case: a stale "out of budget" must not pause AI
      await run1;
    });
    expect(h.result.current.error).toBeNull();
    expect(h.result.current.aiPaused).toBe(false);
    expect(h.result.current.useAi).toBe(true);
    expect(h.result.current.isProcessing).toBe(true); // the live request is still running

    await act(async () => {
      second.resolve(aiResult());
      await run2;
    });
    expect(h.result.current.isProcessing).toBe(false);
  });

  it("aborts the in-flight request when the component unmounts", async () => {
    const h = await setup();
    generateAi.mockReturnValue(deferred<ReturnType<typeof aiResult>>().promise);
    await armAi(h);
    act(() => {
      void h.result.current.generate();
    });
    const signal = generateAi.mock.calls[0][1] as AbortSignal;
    h.unmount();
    expect(signal.aborted).toBe(true);
  });

  it("Reset while a request is in flight drops its late result", async () => {
    const h = await setup();
    const pending = deferred<ReturnType<typeof aiResult>>();
    generateAi.mockReturnValue(pending.promise);
    await armAi(h);

    let run!: Promise<void>;
    act(() => {
      run = h.result.current.generate() as Promise<void>;
    });
    act(() => h.result.current.confirmReset());
    const callsAfterReset = h.onGenerate.mock.calls.length;
    expect(h.result.current.isProcessing).toBe(false);

    await act(async () => {
      pending.resolve(aiResult());
      await run;
    });
    expect(h.onGenerate).toHaveBeenCalledTimes(callsAfterReset);
  });

  // The behavior found in the browser pass: the user opts out of AI while a request is running.
  it("switching AI off mid-request cancels it, so a late AI palette is not applied", async () => {
    const h = await setup();
    const pending = deferred<ReturnType<typeof aiResult>>();
    generateAi.mockReturnValue(pending.promise);
    await armAi(h);

    let run!: Promise<void>;
    act(() => {
      run = h.result.current.generate() as Promise<void>;
    });
    const signal = generateAi.mock.calls[0][1] as AbortSignal;

    act(() => h.result.current.setUseAi(false));

    expect(signal.aborted).toBe(true);
    expect(h.result.current.isProcessing).toBe(false);

    await act(async () => {
      pending.resolve(aiResult());
      await run;
    });
    expect(h.onGenerate).not.toHaveBeenCalled();
  });

});
