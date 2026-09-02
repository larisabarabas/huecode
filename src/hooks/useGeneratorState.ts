import { useCallback, useEffect, useRef, useState } from "react";
import { paletteFromThemeText } from "../lib/textToPalette";
import { ImagePaletteError, paletteFromImage } from "../lib/imageToPalette";
import { AiPaletteError, fetchAiAvailability, paletteFromThemeTextAI } from "../lib/aiPalette";
import type { Palette, PaletteSource } from "../lib/types";

export const DEFAULT_THEME = "sage botanical minimal";

/** Reject images larger than this before we try to decode them. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.userAgent);
export const UNDO_SHORTCUT_LABEL = IS_MAC ? "⌘Z" : "Ctrl+Z";

/** How long the "Reset" toast stays up and ⌘Z keeps working, in ms. */
export const UNDO_WINDOW_MS = 10_000;

interface Snapshot {
  palette: Palette;
  source: PaletteSource;
  text: string;
}

interface UseGeneratorStateArgs {
  onGenerate: (palette: Palette, source: PaletteSource) => void;
  /** Live view of what's on screen now, so Reset can snapshot it for undo. */
  current: { palette: Palette; source: PaletteSource };
}

export function useGeneratorState({ onGenerate, current }: UseGeneratorStateArgs) {
  const [inputMode, setInputMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const imageFileRef = useRef<File | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);

  const currentRef = useRef(current);
  currentRef.current = current;

  const [undoSnapshot, setUndoSnapshot] = useState<Snapshot | null>(null);
  const undoSnapshotRef = useRef<Snapshot | null>(null);
  undoSnapshotRef.current = undoSnapshot;
  const undoTimerRef = useRef<number | null>(null);

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  /** Theme name that Reset would discard — shown in the confirm modal. */
  const resetLabel = text.trim() || current.source.label;

  function stopUndoTimer() {
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  }

  useEffect(() => {
    fetchAiAvailability().then(setAiAvailable);
    return () => aiAbortRef.current?.abort();
  }, []);

  /** Push a freshly generated palette and cancel any pending Reset-undo. */
  function emit(palette: Palette, source: PaletteSource) {
    setUndoSnapshot(null);
    stopUndoTimer();
    onGenerate(palette, source);
  }

  async function generateFromText() {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!useAi) {
      setError(null);
      emit(paletteFromThemeText(trimmed), { kind: "text", label: trimmed });
      return;
    }

    aiAbortRef.current?.abort();
    const controller = new AbortController();
    aiAbortRef.current = controller;

    setError(null);
    setIsProcessing(true);
    try {
      const { palette, proposedColors, rationale } = await paletteFromThemeTextAI(trimmed, controller.signal);
      if (aiAbortRef.current !== controller) return; // superseded or cancelled mid-flight
      emit(palette, {
        kind: "text",
        label: trimmed,
        note: rationale || "AI-generated",
        proposedColors,
      });
    } catch (err) {
      // A superseded / cancelled request must not overwrite the UI for the live one.
      if (aiAbortRef.current !== controller) return;
      setError(err instanceof AiPaletteError ? err.message : "AI generation failed. Try again.");
    } finally {
      if (aiAbortRef.current === controller) {
        aiAbortRef.current = null;
        setIsProcessing(false);
      }
    }
  }

  /** Stages an image file for preview — does not generate a palette yet, that happens on Generate. */
  function selectImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      setError(`That image is ${mb} MB. Please choose one under ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`);
      return;
    }
    setError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    imageFileRef.current = file;
    setImagePreview(URL.createObjectURL(file));
  }

  /** Remove the staged image without touching the current palette. */
  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    imageFileRef.current = null;
    setError(null);
  }

  async function generateFromImage() {
    const file = imageFileRef.current;
    if (!file) return;
    setError(null);
    setIsProcessing(true);
    try {
      const palette = await paletteFromImage(file);
      emit(palette, { kind: "image", label: file.name });
    } catch (err) {
      setError(
        err instanceof ImagePaletteError
          ? err.message
          : "Couldn't read colors from that image. Try a different file.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  /** Generate from whichever input mode is active. */
  function generate() {
    if (inputMode === "text") return generateFromText();
    return generateFromImage();
  }

  /** Wipe the inputs and drop the palette back to the default. Internal — callers use reset(). */
  function wipe() {
    aiAbortRef.current?.abort();
    aiAbortRef.current = null;
    setIsProcessing(false);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    imageFileRef.current = null;
    setText("");
    setError(null);
    onGenerate(paletteFromThemeText(DEFAULT_THEME), { kind: "text", label: DEFAULT_THEME });
  }

  /** Open the confirm modal. The actual reset happens in confirmReset(). */
  function reset() {
    setResetConfirmOpen(true);
  }

  const cancelReset = useCallback(() => setResetConfirmOpen(false), []);

  /** Reset to the default palette after the modal is confirmed, keeping a short undo window. */
  function confirmReset() {
    setResetConfirmOpen(false);
    const { palette, source } = currentRef.current;

    setUndoSnapshot({ palette, source, text });
    wipe();

    stopUndoTimer();
    undoTimerRef.current = window.setTimeout(() => setUndoSnapshot(null), UNDO_WINDOW_MS);
  }

  /** Restore the palette, source and text captured by the last reset(). */
  const undoReset = useCallback(() => {
    const snap = undoSnapshotRef.current;
    if (!snap) return;
    onGenerate(snap.palette, snap.source);
    setText(snap.text);
    setUndoSnapshot(null);
    stopUndoTimer();
  }, [onGenerate]);

  const dismissUndo = useCallback(() => {
    setUndoSnapshot(null);
    stopUndoTimer();
  }, []);

  // ⌘Z / Ctrl+Z restores the palette while the undo window is open.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!undoSnapshotRef.current) return;
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoReset();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      stopUndoTimer();
    };
  }, [undoReset]);

  return {
    inputMode,
    setInputMode,
    text,
    setText,
    useAi,
    setUseAi,
    aiAvailable,
    imagePreview,
    isProcessing,
    error,
    selectImage,
    clearImage,
    generate,
    reset,
    resetConfirmOpen,
    resetLabel,
    confirmReset,
    cancelReset,
    undoReset,
    dismissUndo,
    canUndo: undoSnapshot !== null,
  };
}
