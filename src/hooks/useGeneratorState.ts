import { useEffect, useRef, useState } from "react";
import { paletteFromThemeText } from "../lib/textToPalette";
import { paletteFromImage } from "../lib/imageToPalette";
import { AiPaletteError, fetchAiAvailability, paletteFromThemeTextAI } from "../lib/aiPalette";
import type { Palette, PaletteSource } from "../lib/types";

export const DEFAULT_THEME = "sage botanical minimal";

interface UseGeneratorStateArgs {
  onGenerate: (palette: Palette, source: PaletteSource) => void;
}

export function useGeneratorState({ onGenerate }: UseGeneratorStateArgs) {
  const [inputMode, setInputMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const imageFileRef = useRef<File | null>(null);

  useEffect(() => {
    fetchAiAvailability().then(setAiAvailable);
  }, []);

  async function generateFromText() {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!useAi) {
      setError(null);
      onGenerate(paletteFromThemeText(trimmed), { kind: "text", label: trimmed });
      return;
    }

    setError(null);
    setIsProcessing(true);
    try {
      const { palette, proposedColors, rationale } = await paletteFromThemeTextAI(trimmed);
      onGenerate(palette, {
        kind: "text",
        label: trimmed,
        note: rationale || "AI-generated",
        proposedColors,
      });
    } catch (err) {
      setError(err instanceof AiPaletteError ? err.message : "AI generation failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  /** Stages an image file for preview — does not generate a palette yet, that happens on Generate. */
  function selectImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    imageFileRef.current = file;
    setImagePreview(URL.createObjectURL(file));
  }

  async function generateFromImage() {
    const file = imageFileRef.current;
    if (!file) return;
    setError(null);
    setIsProcessing(true);
    try {
      const palette = await paletteFromImage(file);
      onGenerate(palette, { kind: "image", label: file.name });
    } catch {
      setError("Couldn't read colors from that image. Try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }

  /** Generate from whichever input mode is active. */
  function generate() {
    if (inputMode === "text") return generateFromText();
    return generateFromImage();
  }

  function clear() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    imageFileRef.current = null;
    setText("");
    setError(null);
    onGenerate(paletteFromThemeText(DEFAULT_THEME), { kind: "text", label: DEFAULT_THEME });
  }

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
    generate,
    clear,
  };
}
