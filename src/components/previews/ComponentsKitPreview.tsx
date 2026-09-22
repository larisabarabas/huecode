import { useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";

const label9: CSSProperties = {
  fontFamily: "'JetBrains Mono',ui-monospace,monospace",
  fontSize: 9.5,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

const sectionStyle: CSSProperties = {
  breakInside: "avoid",
  margin: "0 0 14px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  padding: 16,
  border: "1px solid var(--border)",
  borderRadius: "var(--r-lg)",
  background: "var(--surface)",
};

function Section({ title, gap = 14, children }: { title: string; gap?: number; children: ReactNode }) {
  return (
    <section style={{ ...sectionStyle, gap }}>
      <span style={label9}>{title}</span>
      {children}
    </section>
  );
}

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <span
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      style={{
        position: "relative",
        display: "block",
        width: 34,
        height: 19,
        flex: "none",
        borderRadius: 999,
        cursor: "pointer",
        background: on ? "var(--accent)" : "var(--surface-3)",
        boxShadow: on ? "none" : "inset 0 0 0 1px var(--border-strong)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? "calc(100% - 17px)" : 2,
          width: 15,
          height: 15,
          borderRadius: 999,
          background: "var(--surface)",
          boxShadow: "var(--shadow-sm)",
        }}
      />
    </span>
  );
}

const CAL_DAYS = Array.from({ length: 35 }, (_, i) => {
  const day = i - 1;
  const inMonth = day >= 1 && day <= 30;
  const inRange = day >= 8 && day <= 14;
  const edge = day === 8 || day === 14;
  return {
    label: inMonth ? String(day) : "",
    edge,
    inRange,
    inMonth,
  };
});

export default function ComponentsKitPreview() {
  const [view, setView] = useState<"List" | "Board" | "Timeline">("List");
  const [alertOnFailure, setAlertOnFailure] = useState(true);
  const [navTab, setNavTab] = useState<"Activity" | "Members" | "Billing">("Activity");

  return (
    <div style={{ columns: "320px 3", columnGap: 14, padding: 20 }}>
      <Section title="Buttons">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            className="bg-[var(--accent)] transition-colors hover:bg-[var(--accent-hover)]"
            style={{
              padding: "8px 13px",
              border: "1px solid transparent",
              borderRadius: "var(--r-sm)",
              color: "var(--accent-fg)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            Primary
          </button>
          <button
            type="button"
            style={{
              padding: "8px 13px",
              border: "1px solid transparent",
              borderRadius: "var(--r-sm)",
              background: "var(--accent-soft)",
              color: "var(--accent-soft-fg)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Soft
          </button>
          <button
            type="button"
            className="border-[var(--border)] transition-colors hover:border-[var(--border-strong)]"
            style={{
              padding: "8px 13px",
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: "var(--r-sm)",
              background: "var(--surface)",
              color: "var(--text)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Outline
          </button>
          <button
            type="button"
            className="bg-transparent text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text)]"
            style={{
              padding: "8px 11px",
              border: "1px solid transparent",
              borderRadius: "var(--r-sm)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Ghost
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            style={{
              padding: "8px 13px",
              border: "1px solid transparent",
              borderRadius: "var(--r-sm)",
              background: "var(--err)",
              color: "var(--err-fg)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          <button
            type="button"
            disabled
            style={{
              padding: "8px 13px",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-3)",
              color: "var(--text-3)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "not-allowed",
            }}
          >
            Disabled
          </button>
          <button
            type="button"
            style={{
              padding: "8px 13px",
              border: "1px solid var(--accent)",
              borderRadius: "var(--r-sm)",
              background: "var(--surface)",
              color: "var(--text)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 0 0 3px var(--ring)",
            }}
          >
            Focused
          </button>
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 13px",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              background: "var(--surface)",
              color: "var(--text-2)",
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "wait",
            }}
          >
            {/* Animate the wrapper, not the <svg> itself — most browsers can't hardware-
                accelerate CSS animations applied directly to an SVG element. */}
            <span style={{ display: "inline-flex", animation: "preview-shimmer 1.4s ease-in-out infinite" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
              </svg>
            </span>
            Working
          </button>
        </div>
      </Section>

      <Section title="Inputs" gap={12}>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)" }}>Workspace</span>
          <input
            readOnly
            value="Northline"
            style={{
              padding: "9px 11px",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              color: "var(--text)",
              font: "inherit",
              fontSize: 12.5,
              outline: "none",
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)" }}>Billing email</span>
          <input
            readOnly
            value="ops@northline.dev"
            style={{
              padding: "9px 11px",
              border: "1px solid var(--accent)",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              color: "var(--text)",
              font: "inherit",
              fontSize: 12.5,
              outline: "none",
              boxShadow: "0 0 0 3px var(--ring)",
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)" }}>Region</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 11px",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              fontSize: 12.5,
              color: "var(--text)",
            }}
          >
            eu-west-1
            <ChevronDown size={12} strokeWidth={2.4} aria-hidden="true" style={{ marginLeft: "auto", color: "var(--text-3)" }} />
          </span>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--err)" }}>Slug</span>
          <input
            readOnly
            value="north line"
            style={{
              padding: "9px 11px",
              border: "1px solid var(--err)",
              borderRadius: "var(--r-sm)",
              background: "var(--err-soft)",
              color: "var(--text)",
              font: "inherit",
              fontSize: 12.5,
              outline: "none",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--err)" }}>Slugs can&rsquo;t contain spaces.</span>
        </label>
      </Section>

      <Section title="Selection">
        <div style={{ display: "flex", gap: 2, padding: 3, background: "var(--surface-3)", borderRadius: "var(--r-sm)" }}>
          {(["List", "Board", "Timeline"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setView(opt)}
              style={{
                padding: "6px 13px",
                border: 0,
                borderRadius: 7,
                background: view === opt ? "var(--surface)" : "transparent",
                color: view === opt ? "var(--text)" : "var(--text-3)",
                boxShadow: view === opt ? "var(--shadow-sm)" : "none",
                font: "inherit",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <Switch on={alertOnFailure} onToggle={() => setAlertOnFailure((v) => !v)} label="Alert on failure" />
          <span style={{ fontSize: 12.5, color: "var(--text)" }}>Alert on failure</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text)" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: 5,
                background: "var(--accent)",
                color: "var(--accent-fg)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4 10-10" />
              </svg>
            </span>
            Include archived
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-2)" }}>
            <span style={{ width: 16, height: 16, border: "1px solid var(--border-strong)", borderRadius: 5, background: "var(--surface-2)" }} />
            Group by owner
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text)" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                border: "1px solid var(--accent)",
                borderRadius: 999,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }} />
            </span>
            Every environment
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <span style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-2)" }}>
            Concurrency <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", color: "var(--text)" }}>24</span>
          </span>
          <span style={{ position: "relative", display: "block", height: 4, borderRadius: 999, background: "var(--surface-3)" }}>
            <span style={{ display: "block", width: "48%", height: "100%", borderRadius: 999, background: "var(--accent)" }} />
            <span
              style={{
                position: "absolute",
                left: "48%",
                top: "50%",
                width: 14,
                height: 14,
                margin: "-7px 0 0 -7px",
                border: "1px solid var(--border-strong)",
                borderRadius: 999,
                background: "var(--surface)",
                boxShadow: "var(--shadow-sm)",
              }}
            />
          </span>
        </div>
      </Section>

      <Section title="Status" gap={13}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { label: "Live", dot: "var(--ok)" },
            { label: "Degraded", dot: "var(--warn)" },
            { label: "Failing", dot: "var(--err)" },
          ].map((s) => (
            <span
              key={s.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                border: "1px solid var(--border)",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 500,
                color: "var(--text-2)",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 999, background: s.dot }} />
              {s.label}
            </span>
          ))}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 8px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              color: "var(--accent-soft-fg)",
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            Beta
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 8px",
              borderRadius: 999,
              background: "var(--surface-3)",
              color: "var(--text-3)",
              fontFamily: "'JetBrains Mono',ui-monospace,monospace",
              fontSize: 11,
            }}
          >
            v4.1.0
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: 11,
            border: "1px solid var(--border)",
            borderLeft: "2px solid var(--info)",
            borderRadius: "var(--r-sm)",
            background: "var(--info-soft)",
          }}
        >
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>Tailwind v4 export is ready</span>
            <span style={{ fontSize: 11.5, color: "var(--text-2)" }}>
              Themes now emit <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 11 }}>@theme</span> blocks.
            </span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 12px",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            background: "var(--surface-2)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              flex: "none",
              borderRadius: 999,
              background: "var(--ok-soft)",
              color: "var(--ok)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4 10-10" />
            </svg>
          </span>
          <span style={{ fontSize: 12.5, color: "var(--text)" }}>Palette copied to clipboard</span>
          <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--text-3)" }}>Undo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <span style={{ height: 9, width: "70%", borderRadius: 999, background: "var(--surface-3)", animation: "preview-shimmer 1.6s ease-in-out infinite" }} />
          <span style={{ height: 9, width: "92%", borderRadius: 999, background: "var(--surface-3)", animation: "preview-shimmer 1.6s ease-in-out infinite .2s" }} />
          <span style={{ height: 9, width: "44%", borderRadius: 999, background: "var(--surface-3)", animation: "preview-shimmer 1.6s ease-in-out infinite .4s" }} />
        </div>
      </Section>

      <Section title="Navigation">
        <div style={{ display: "flex", gap: 16, borderBottom: "1px solid var(--border)" }}>
          {(["Activity", "Members", "Billing"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setNavTab(tab)}
              style={{
                padding: "0 0 9px",
                border: 0,
                borderBottom: navTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                background: "transparent",
                font: "inherit",
                fontSize: 12.5,
                fontWeight: navTab === tab ? 600 : 500,
                color: navTab === tab ? "var(--text)" : "var(--text-3)",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-3)" }}>
          <span>Workspace</span>
          <ChevronRight size={11} strokeWidth={2.4} aria-hidden="true" />
          <span>Projects</span>
          <ChevronRight size={11} strokeWidth={2.4} aria-hidden="true" />
          <span style={{ color: "var(--text)", fontWeight: 600 }}>api-gateway</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {[
            { i: "MK", bg: "var(--accent)", fg: "var(--accent-fg)" },
            { i: "JT", bg: "var(--surface-3)", fg: "var(--text-2)" },
            { i: "RA", bg: "var(--surface-3)", fg: "var(--text-2)" },
          ].map((a) => (
            <span
              key={a.i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                marginRight: -8,
                border: "2px solid var(--surface)",
                borderRadius: 999,
                background: a.bg,
                color: a.fg,
                fontSize: 10.5,
                fontWeight: 600,
              }}
            >
              {a.i}
            </span>
          ))}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              border: "2px solid var(--surface)",
              borderRadius: 999,
              background: "var(--surface-3)",
              color: "var(--text-3)",
              fontFamily: "'JetBrains Mono',ui-monospace,monospace",
              fontSize: 10,
            }}
          >
            +6
          </span>
          <span style={{ marginLeft: 14, fontSize: 11.5, color: "var(--text-3)" }}>9 members</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 5,
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            background: "var(--surface-2)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 9px",
              borderRadius: "var(--r-xs)",
              background: "var(--surface-3)",
              fontSize: 12.5,
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            Duplicate <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10, color: "var(--text-3)" }}>⌘D</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: "var(--r-xs)", fontSize: 12.5, color: "var(--text-2)" }}>
            Move to…
          </span>
          <span style={{ height: 1, margin: "4px 2px", background: "var(--border)" }} />
          <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: "var(--r-xs)", fontSize: 12.5, color: "var(--err)" }}>
            Delete project
          </span>
        </div>
      </Section>

      <Section title="Overlays & empty states">
        <div style={{ padding: 15, border: "1px solid var(--border)", borderRadius: "var(--r-md)", background: "var(--surface-2)", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>Delete api-gateway?</div>
          <div style={{ marginTop: 5, fontSize: 12, lineHeight: 1.5, color: "var(--text-2)" }}>
            This removes 4,180 runs and every stored secret. The action can&rsquo;t be undone.
          </div>
          <div style={{ marginTop: 13, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              style={{
                padding: "7px 11px",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                background: "var(--surface)",
                color: "var(--text)",
                font: "inherit",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              style={{
                padding: "7px 11px",
                border: "1px solid transparent",
                borderRadius: "var(--r-sm)",
                background: "var(--err)",
                color: "var(--err-fg)",
                font: "inherit",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 9,
            padding: "22px 16px",
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--r-md)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--r-sm)",
              background: "var(--surface-3)",
              color: "var(--text-3)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="5" width="16" height="14" rx="2" />
              <path d="M4 10h16M10 19V10" />
            </svg>
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>No runs yet</span>
          <span style={{ maxWidth: 230, fontSize: 11.5, lineHeight: 1.5, color: "var(--text-3)" }}>
            Trigger the pipeline once and history will show up here.
          </span>
          <button
            type="button"
            style={{
              marginTop: 2,
              padding: "7px 12px",
              border: "1px solid transparent",
              borderRadius: "var(--r-sm)",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              font: "inherit",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Run pipeline
          </button>
        </div>
      </Section>

      <Section title="Data display">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 74,
              height: 74,
              flex: "none",
              borderRadius: 999,
              background: "conic-gradient(var(--accent) 0 72%, var(--surface-3) 72% 100%)",
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 999,
                background: "var(--surface)",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-.02em", color: "var(--text)" }}>72%</span>
              <span style={{ fontSize: 9.5, color: "var(--text-3)" }}>budget</span>
            </span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1, minWidth: 0 }}>
            {[
              { label: "Compute", value: 64, color: "var(--accent)" },
              { label: "Storage", value: 88, color: "var(--warn)" },
              { label: "Egress", value: 21, color: "var(--ok)" },
            ].map((m) => (
              <span key={m.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-2)" }}>
                  {m.label} <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", color: "var(--text)" }}>{m.value}%</span>
                </span>
                <span style={{ display: "block", height: 5, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
                  <span style={{ display: "block", width: `${m.value}%`, height: "100%", background: m.color }} />
                </span>
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 64, paddingTop: 4 }}>
          {[38, 55, 44, 72, 100, 61, 48, 33].map((h, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: "3px 3px 0 0",
                background: i === 3 || i === 4 ? "var(--accent)" : "var(--surface-3)",
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Progress & steps" gap={16}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              flex: "none",
              borderRadius: 999,
              background: "var(--accent)",
              color: "var(--accent-fg)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4 10-10" />
            </svg>
          </span>
          <span style={{ flex: 1, height: 2, background: "var(--accent)" }} />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              flex: "none",
              borderRadius: 999,
              border: "2px solid var(--accent)",
              background: "var(--surface)",
              color: "var(--accent)",
              fontFamily: "'JetBrains Mono',ui-monospace,monospace",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            2
          </span>
          <span style={{ flex: 1, height: 2, background: "var(--surface-3)" }} />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              flex: "none",
              borderRadius: 999,
              border: "2px solid var(--border-strong)",
              background: "var(--surface)",
              color: "var(--text-3)",
              fontFamily: "'JetBrains Mono',ui-monospace,monospace",
              fontSize: 10,
            }}
          >
            3
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)" }}>
          <span>Connect</span>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>Configure</span>
          <span>Deploy</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { label: "Build queued", meta: "14:02:11", dot: "var(--accent)", last: false },
            { label: "Tests passed", meta: "14:04:47 · 212 specs", dot: "var(--ok)", last: false },
          ].map((step) => (
            <div key={step.label} style={{ display: "flex", gap: 11 }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none", width: 14 }}>
                <span style={{ width: 8, height: 8, marginTop: 4, borderRadius: 999, background: step.dot }} />
                <span style={{ flex: 1, width: 1, background: "var(--border)" }} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{step.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10.5, color: "var(--text-3)" }}>{step.meta}</span>
              </span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 11 }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none", width: 14 }}>
              <span style={{ width: 8, height: 8, marginTop: 4, borderRadius: 999, background: "var(--surface-3)", boxShadow: "inset 0 0 0 1px var(--border-strong)" }} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-2)" }}>Awaiting approval</span>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10.5, color: "var(--text-3)" }}>Mara K.</span>
            </span>
          </div>
        </div>
      </Section>

      <Section title="Date picker" gap={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>September 2026</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid var(--border)", borderRadius: "var(--r-xs)", color: "var(--text-2)" }}>
              <ChevronLeft size={12} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid var(--border)", borderRadius: "var(--r-xs)", color: "var(--text-2)" }}>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" />
            </span>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9.5, textAlign: "center", color: "var(--text-3)" }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, fontSize: 11.5, textAlign: "center" }}>
          {CAL_DAYS.map((d, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 26,
                borderRadius: d.edge ? "var(--r-xs)" : d.inRange ? 0 : "var(--r-xs)",
                background: d.edge ? "var(--accent)" : d.inRange ? "var(--accent-soft)" : "transparent",
                color: d.edge ? "var(--accent-fg)" : d.inRange ? "var(--accent-soft-fg)" : d.inMonth ? "var(--text-2)" : "transparent",
                fontWeight: d.edge ? 600 : 400,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {d.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 2, borderTop: "1px solid var(--border)" }}>
          <span style={{ paddingTop: 10, fontSize: 11.5, color: "var(--text-2)" }}>Sep 8 – Sep 14</span>
          <button
            type="button"
            className="bg-[var(--accent)] transition-colors hover:bg-[var(--accent-hover)]"
            style={{
              margin: "10px 0 0 auto",
              padding: "6px 11px",
              border: "1px solid transparent",
              borderRadius: "var(--r-sm)",
              color: "var(--accent-fg)",
              font: "inherit",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
      </Section>

      <Section title="Command palette">
        <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "var(--r-md)", background: "var(--surface-2)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 12px", borderBottom: "1px solid var(--border)" }}>
            <Search size={14} aria-hidden="true" style={{ color: "var(--text-3)" }} />
            <span style={{ fontSize: 12.5, color: "var(--text)" }}>
              deploy<span style={{ display: "inline-block", width: 1, height: 13, marginLeft: 1, verticalAlign: -2, background: "var(--accent)" }} />
            </span>
            <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10, padding: "1px 5px", borderRadius: 4, background: "var(--surface-3)", color: "var(--text-3)" }}>
              esc
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: 5 }}>
            <span style={{ padding: "5px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-3)" }}>
              Actions
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 9px",
                borderRadius: "var(--r-xs)",
                background: "var(--accent-soft)",
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--accent-soft-fg)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
              Deploy api-gateway
              <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10, opacity: 0.8 }}>⏎</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: "var(--r-xs)", fontSize: 12.5, color: "var(--text-2)" }}>
              <RotateCcw size={14} aria-hidden="true" />
              Redeploy last build
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: "var(--r-xs)", fontSize: 12.5, color: "var(--text-2)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M4 12h10M4 17h7" />
              </svg>
              Open deploy logs
            </span>
            <span style={{ height: 1, margin: "4px 2px", background: "var(--border)" }} />
            <span style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: "var(--r-xs)", fontSize: 12.5, color: "var(--text-2)" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  flex: "none",
                  borderRadius: 5,
                  background: "var(--surface-3)",
                  fontSize: 9.5,
                  fontWeight: 600,
                  color: "var(--text-2)",
                }}
              >
                JT
              </span>
              Ask Jules T. to review
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7, fontSize: 11.5, color: "var(--text-3)" }}>
          Trigger with
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10.5, padding: "2px 6px", border: "1px solid var(--border)", borderRadius: 5, background: "var(--surface-2)", color: "var(--text-2)" }}>
            ⌘
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10.5, padding: "2px 6px", border: "1px solid var(--border)", borderRadius: 5, background: "var(--surface-2)", color: "var(--text-2)" }}>
            K
          </span>
          anywhere in the app
        </div>
      </Section>
    </div>
  );
}
