// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AiToggle, { AiNote, NOTE_ID, hasAiNote } from "./AiToggle";

afterEach(cleanup);

describe("AiNote", () => {
  it("names the provider", () => {
    render(<AiNote provider="openai" demo={false} />);
    expect(screen.getByText(/Powered by OpenAI/)).toBeTruthy();
    expect(screen.queryByText(/shared key/)).toBeNull();
  });

  it("adds the shared-key notice on the demo", () => {
    render(<AiNote provider="gemini" demo />);
    const note = document.getElementById(NOTE_ID)!;
    expect(note.textContent).toContain("Powered by Google Gemini.");
    expect(note.textContent).toContain("shared key");
  });

  it("falls back to the demo notice alone for an unknown provider", () => {
    render(<AiNote provider="mystery" demo />);
    const note = document.getElementById(NOTE_ID)!;
    expect(note.textContent).not.toContain("Powered by");
    expect(note.textContent).toContain("shared key");
  });

  it("renders nothing for an unknown provider outside the demo", () => {
    const { container } = render(<AiNote provider="mystery" demo={false} />);
    expect(container.innerHTML).toBe("");
    expect(hasAiNote("mystery", false)).toBe(false);
    expect(hasAiNote(null, false)).toBe(false);
  });
});

describe("AiToggle", () => {
  it("is described by the note only when there is one", () => {
    const { rerender } = render(<AiToggle checked={false} onChange={() => {}} hasNote />);
    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBe(NOTE_ID);

    rerender(<AiToggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBeNull();
  });
});
