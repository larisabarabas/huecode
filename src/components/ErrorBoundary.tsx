import { Component, type ErrorInfo, type ReactNode } from "react";
import { clearStoredPalette } from "../lib/paletteStorage";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level boundary. App persists the current palette to localStorage on every
 * change, so a render crash never loses it — this screen just offers a reload.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Huecode crashed:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-5 bg-shell-bg px-6 text-center font-sans text-ink antialiased">
        <div className="max-w-sm">
          <h1 className="text-lg font-semibold">Something broke</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            The app hit an unexpected error. Your last palette is saved — reload to pick up where you left
            off.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-[9px] bg-coral px-4 py-2.5 text-[13px] font-bold text-white"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => {
              clearStoredPalette();
              window.location.reload();
            }}
            className="rounded-[9px] border border-line px-4 py-2.5 text-[13px] font-semibold text-muted hover:text-ink"
          >
            Reload with a fresh palette
          </button>
        </div>
      </div>
    );
  }
}
