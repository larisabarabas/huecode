import type { CSSProperties } from "react";
import { AlignLeft } from "lucide-react";
import { useWideViewport } from "../../hooks/useShellLayout";

const NAV_LINKS = ["Product", "Docs", "Pricing", "Changelog"];
const LOGOS = ["Kestrel", "Foundry", "Ovid Labs", "Marrow", "Tessellate"];

const FEATURES = [
  { n: "01", title: "Retries you don't have to write", body: "Set a backoff policy once and every job inherits it, with a dead-letter queue behind it." },
  { n: "02", title: "A trace for every run", body: "Step timings, inputs and logs stay attached to the run for 30 days." },
  { n: "03", title: "Alerts with a threshold", body: "Page someone when p95 or failure rate crosses a line you set, not on every blip." },
];

const PLANS = [
  { tier: "Free", price: "$0", cadence: "forever", perks: ["10,000 runs / month", "One environment", "7-day trace history"], cta: "Start free", highlight: false },
  { tier: "Pro", price: "$9", cadence: "per month", perks: ["Unlimited runs", "Scheduled pipelines", "30-day traces"], cta: "Upgrade", highlight: true },
  { tier: "Team", price: "$24", cadence: "per seat, monthly", perks: ["Unlimited environments", "SSO and audit log", "99.9% uptime SLA"], cta: "Contact sales", highlight: false },
];

const HERO_STATS = [
  { label: "Runs today", value: "1,284", meta: "+14.2%", metaColor: "var(--ok)" },
  { label: "Success", value: "99.1%", meta: "+0.3%", metaColor: "var(--text-3)" },
  { label: "p95", value: "412", unit: "ms", meta: "+38ms", metaColor: "var(--err)" },
];

const mono10: CSSProperties = { fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10, color: "var(--text-3)" };

const ACCENT_BTN_CLASS = "bg-[var(--accent)] transition-colors hover:bg-[var(--accent-hover)]";

function accentButton(large = false): CSSProperties {
  return {
    padding: large ? "11px 18px" : "7px 12px",
    border: "1px solid transparent",
    borderRadius: "var(--r-md)",
    color: "var(--accent-fg)",
    font: "inherit",
    fontSize: large ? 13.5 : 12.5,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: large ? "var(--shadow-sm)" : undefined,
  };
}

export default function MarketingPreview() {
  const wide = useWideViewport();

  return (
    <div>
      <div
        style={
          wide
            ? {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "14px 22px",
                padding: "14px 24px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface)",
              }
            : {
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface)",
              }
        }
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "var(--r-xs)",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            N
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>Northline</span>
        </span>
        {wide &&
          NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
              style={{ fontSize: 12.5, textDecoration: "none" }}
            >
              {link}
            </a>
          ))}
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="#"
            className="text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
            style={{ whiteSpace: "nowrap", fontSize: 12.5, fontWeight: 500, textDecoration: "none" }}
          >
            Sign in
          </a>
          <button type="button" className={ACCENT_BTN_CLASS} style={{ ...accentButton(), whiteSpace: "nowrap", boxShadow: "var(--shadow-sm)" }}>
            Start building
          </button>
        </span>
      </div>

      <div style={{ padding: "64px 24px 0", textAlign: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 10px 4px 7px",
            border: "1px solid var(--border)",
            borderRadius: 999,
            background: "var(--surface)",
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--text-2)",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--ok)" }} />
          Scheduled pipelines are now GA
          <span style={{ color: "var(--text-3)" }}>→</span>
        </span>
        <h1
          style={{
            margin: "20px auto 0",
            maxWidth: 660,
            fontSize: "clamp(34px, 5.2vw, 54px)",
            lineHeight: 1.04,
            fontWeight: 600,
            letterSpacing: "-.035em",
            color: "var(--text)",
          }}
        >
          Every background job, on one screen
        </h1>
        <p style={{ margin: "16px auto 0", maxWidth: 470, fontSize: 15, lineHeight: 1.6, color: "var(--text-2)" }}>
          Northline runs your pipelines and deploys, retries what fails, and tells you the moment latency moves —
          before your customers notice.
        </p>
        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 9 }}>
          <button type="button" className={ACCENT_BTN_CLASS} style={accentButton(true)}>
            Start free
          </button>
          <button
            type="button"
            className="border-[var(--border)] transition-colors hover:border-[var(--border-strong)]"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 16px",
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: "var(--r-md)",
              background: "var(--surface)",
              color: "var(--text)",
              font: "inherit",
              fontSize: 13.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <AlignLeft size={14} aria-hidden="true" />
            Read the docs
          </button>
        </div>
        <div style={{ marginTop: 14, ...mono10 }}>Free for the first 10,000 runs · No card required</div>
      </div>

      <div style={{ maxWidth: 1000, margin: "44px auto 0", padding: "0 24px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 13px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
            <span style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: "var(--border-strong)" }} />
              ))}
            </span>
            <span
              style={{
                margin: "0 auto",
                padding: "3px 12px",
                borderRadius: 999,
                background: "var(--surface-3)",
                fontFamily: "'JetBrains Mono',ui-monospace,monospace",
                fontSize: 10.5,
                color: "var(--text-3)",
              }}
            >
              app.northline.dev/overview
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 250, background: "var(--bg)" }}>
            {wide && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  width: 132,
                  flex: "none",
                  padding: "13px 10px",
                  borderRight: "1px solid var(--border)",
                  background: "var(--surface)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 5, background: "var(--accent)" }} />
                  <span style={{ height: 7, width: 46, borderRadius: 999, background: "var(--surface-3)" }} />
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 7px", borderRadius: "var(--r-xs)", background: "var(--accent-soft)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--accent)" }} />
                  <span style={{ height: 6, width: 44, borderRadius: 999, background: "var(--accent-soft-fg)", opacity: 0.5 }} />
                </span>
                {[52, 38, 48].map((w, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 7px" }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--border-strong)" }} />
                    <span style={{ height: 6, width: w, borderRadius: 999, background: "var(--surface-3)" }} />
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, flex: 1, padding: 14 }}>
              <div style={wide ? { display: "flex", alignItems: "center", gap: 10 } : { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 10px" }}>
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-.015em", color: "var(--text)" }}>Overview</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "2px 8px",
                    border: "1px solid var(--border)",
                    borderRadius: 999,
                    fontSize: 10.5,
                    whiteSpace: "nowrap",
                    color: "var(--text-2)",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--ok)" }} />
                  All systems normal
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    padding: "5px 10px",
                    borderRadius: "var(--r-xs)",
                    background: "var(--accent)",
                    color: "var(--accent-fg)",
                    fontSize: 10.5,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  New pipeline
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: wide ? "repeat(3,1fr)" : "repeat(auto-fit,minmax(112px,1fr))",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-md)",
                  background: "var(--surface)",
                  overflow: "hidden",
                }}
              >
                {HERO_STATS.map((s, i) => (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 5, padding: "11px 12px", borderRight: i < HERO_STATS.length - 1 ? "1px solid var(--border)" : undefined }}>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 8.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-3)" }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: "var(--text)" }}>
                      {s.value}
                      {s.unit && <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)" }}>{s.unit}</span>}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: 10, color: s.metaColor }}>{s.meta}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: "var(--r-md)", background: "var(--surface)" }}>
                <svg viewBox="0 0 480 96" width="100%" height="96" fill="none" preserveAspectRatio="none" style={{ display: "block" }}>
                  <defs>
                    <linearGradient id="ps-hero-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 32H480M0 64H480" stroke="var(--border)" strokeWidth="1" />
                  <path d="M0 74L40 62L80 68L120 48L160 54L200 34L240 42L280 26L320 32L360 18L400 24L440 12L480 16V96H0Z" fill="url(#ps-hero-area)" />
                  <path
                    d="M0 74L40 62L80 68L120 48L160 54L200 34L240 42L280 26L320 32L360 18L400 24L440 12L480 16"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0 84L40 79L80 82L120 74L160 77L200 70L240 73L280 65L320 68L360 61L400 64L440 57L480 60"
                    stroke="var(--border-strong)"
                    strokeWidth="1.5"
                    strokeDasharray="4 5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 34, padding: "44px 24px 8px", fontSize: 13, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text-3)" }}>
        {LOGOS.map((logo) => (
          <span key={logo}>{logo}</span>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "44px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 26 }}>
          {FEATURES.map((f) => (
            <div key={f.n} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={mono10}>{f.n}</span>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>{f.title}</span>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-2)" }}>{f.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12, alignItems: "start" }}>
          {PLANS.map((p) => (
            <div
              key={p.tier}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 18,
                border: p.highlight ? "1px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                background: "var(--surface)",
                boxShadow: p.highlight ? "var(--shadow-md)" : undefined,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: p.highlight ? "var(--text)" : "var(--text-2)" }}>
                {p.tier}
                {p.highlight && (
                  <span style={{ padding: "2px 7px", borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent-soft-fg)", fontSize: 10.5, fontWeight: 600 }}>
                    Popular
                  </span>
                )}
              </span>
              <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-.035em", color: "var(--text)" }}>{p.price}</span>
              <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{p.cadence}</span>
              <span style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-2)" }}>
                {p.perks.map((perk) => (
                  <span key={perk}>{perk}</span>
                ))}
              </span>
              <button
                type="button"
                className={
                  p.highlight
                    ? ACCENT_BTN_CLASS
                    : "border-[var(--border)] transition-colors hover:border-[var(--border-strong)]"
                }
                style={
                  p.highlight
                    ? { marginTop: 4, ...accentButton(), padding: 9 }
                    : {
                        marginTop: 4,
                        padding: 9,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: "var(--r-sm)",
                        background: "var(--surface)",
                        color: "var(--text)",
                        font: "inherit",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }
                }
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, padding: "34px 24px" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em", color: "var(--text)" }}>Put your jobs somewhere you can see them</div>
            <div style={{ marginTop: 5, fontSize: 13, color: "var(--text-2)" }}>Connect a repo, point it at a command, ship the first pipeline in minutes.</div>
          </div>
          <button type="button" className={ACCENT_BTN_CLASS} style={{ marginLeft: "auto", ...accentButton(true) }}>
            Start free
          </button>
        </div>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 18, padding: "0 24px 30px", fontSize: 12, color: "var(--text-3)" }}>
          <span>© 2026 Northline</span>
          <a href="#" className="text-[var(--text-3)] transition-colors hover:text-[var(--text)]" style={{ textDecoration: "none" }}>
            Docs
          </a>
          <a href="#" className="text-[var(--text-3)] transition-colors hover:text-[var(--text)]" style={{ textDecoration: "none" }}>
            Changelog
          </a>
          <a href="#" className="text-[var(--text-3)] transition-colors hover:text-[var(--text)]" style={{ textDecoration: "none" }}>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
