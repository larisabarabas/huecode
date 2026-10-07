import { useState, type CSSProperties, type ReactNode } from "react";
import { Activity, BarChart3, Bell, CircleHelp, Download, Home, LayoutGrid, Plus, Search, Settings, User } from "lucide-react";
import { PREVIEW_WIDE_MIN, useContainerWide } from "../../hooks/useContainerWide";

const NAV_WORKSPACE = [
  { label: "Overview", icon: Home, active: true, badge: null },
  { label: "Projects", icon: LayoutGrid, active: false, badge: "18" },
  { label: "Activity", icon: Activity, active: false, badge: "dot" },
  { label: "Insights", icon: BarChart3, active: false, badge: null },
] as const;

const NAV_ACCOUNT = [
  { label: "Members", icon: User },
  { label: "Settings", icon: Settings },
] as const;

const PAGE_TABS = ["Overview", "Activity", "Usage", "Audit log"];

const STATS = [
  { label: "Active runs", value: "1,284", delta: "+14.2%", deltaColor: "var(--ok)", spark: "M1 14L9 11L17 12L25 7L33 9L41 4L49 6L57 2", sparkColor: "var(--accent)" },
  { label: "Success rate", value: "99.1%", delta: "+0.3%", deltaColor: "var(--text-3)", spark: "M1 6L9 5L17 8L25 6L33 5L41 7L49 4L57 5", sparkColor: "var(--text-3)" },
  { label: "p95 latency", value: "412", unit: "ms", delta: "+38ms", deltaColor: "var(--err)", spark: "M1 9L9 8L17 6L25 9L33 7L41 11L49 10L57 13", sparkColor: "var(--text-3)" },
  { label: "Spend", value: "$2,940", delta: "on pace", deltaColor: "var(--text-3)", spark: "M1 13L9 12L17 13L25 10L33 11L41 8L49 9L57 6", sparkColor: "var(--text-3)" },
];

const ACTIVITY = [
  { dot: "var(--ok)", text: <><b style={{ fontWeight: 600 }}>Jules T.</b> deployed <span style={mono(11.5, "var(--text-2)")}>api-gateway</span></>, time: "4 minutes ago" },
  { dot: "var(--warn)", text: <>Retry budget at <b style={{ fontWeight: 600 }}>80%</b> on Ingest</>, time: "26 minutes ago" },
  { dot: "var(--text-3)", text: <><b style={{ fontWeight: 600 }}>Rae A.</b> invited two members</>, time: "1 hour ago" },
  { dot: "var(--err)", text: <>3 runs failed in <span style={mono(11.5, "var(--text-2)")}>nightly-sync</span></>, time: "2 hours ago" },
];

const PROJECTS = [
  { name: "api-gateway", status: "Healthy", dot: "var(--ok)", owner: "Jules T.", runs: "4,180", updated: "4m ago" },
  { name: "ingest-worker", status: "Degraded", dot: "var(--warn)", owner: "Rae A.", runs: "2,904", updated: "26m ago" },
  { name: "nightly-sync", status: "Failing", dot: "var(--err)", owner: "Ola B.", runs: "312", updated: "2h ago" },
  { name: "web-app", status: "Healthy", dot: "var(--ok)", owner: "Mara K.", runs: "1,067", updated: "yesterday" },
  { name: "docs-site", status: "Paused", dot: "var(--text-3)", owner: "Jules T.", runs: "0", updated: "3d ago" },
];

function mono(size: number, color: string): CSSProperties {
  return { fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: size, color };
}

const label9: CSSProperties = {
  fontFamily: "'JetBrains Mono',ui-monospace,monospace",
  fontSize: 9.5,
  letterSpacing: ".13em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

const cardStyle: CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "var(--r-lg)",
  background: "var(--surface)",
  padding: 16,
};

export default function AppPreview() {
  const [rootRef, wide] = useContainerWide(PREVIEW_WIDE_MIN);
  // Explicit 4-up or 2x2 (never auto-fit's 3+1 orphan); 560px is where four cells stay >= 140px.
  const [statsRef, statsFour] = useContainerWide(560);
  const statCols = statsFour ? 4 : 2;
  const [autoRetry, setAutoRetry] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <div
      ref={rootRef}
      style={{
        display: "flex",
        flexDirection: wide ? "row" : "column",
        alignItems: "stretch",
        minHeight: wide ? 720 : 0,
      }}
    >
      {wide && (
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          width: 236,
          flex: "none",
          padding: "14px 12px",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <button
          type="button"
          className="bg-transparent transition-colors hover:bg-[var(--surface-3)]"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            width: "100%",
            padding: 6,
            border: "1px solid transparent",
            borderRadius: "var(--r-md)",
            cursor: "pointer",
            font: "inherit",
            textAlign: "left",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              flex: "none",
              borderRadius: "var(--r-sm)",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            N
          </span>
          <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.25 }}>Northline</span>
            <span style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.25 }}>Team plan</span>
          </span>
          <ChevronIcon />
        </button>

        <button
          type="button"
          className="border-[var(--border)] text-[var(--text-3)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-2)]"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 8px",
            borderWidth: 1,
            borderStyle: "solid",
            background: "var(--surface-2)",
            borderRadius: "var(--r-sm)",
            cursor: "pointer",
            font: "inherit",
            fontSize: 12.5,
            textAlign: "left",
          }}
        >
          <Search size={14} aria-hidden="true" />
          Search
          <span
            style={{
              marginLeft: "auto",
              ...mono(10.5, "var(--text-3)"),
              padding: "1px 5px",
              borderRadius: 4,
              background: "var(--surface-3)",
            }}
          >
            ⌘K
          </span>
        </button>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ padding: "0 8px 6px", ...mono(9.5, "var(--text-3)"), letterSpacing: ".14em", textTransform: "uppercase" }}>
            Workspace
          </div>
          {NAV_WORKSPACE.map(({ label, icon: Icon, active, badge }) => (
            <a
              key={label}
              href="#"
              className={
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent-soft-fg)]"
                  : "bg-transparent text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text)]"
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 8px",
                borderRadius: "var(--r-sm)",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
              }}
            >
              <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
              {label}
              {badge === "dot" && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
              )}
              {badge && badge !== "dot" && <span style={{ marginLeft: "auto", ...mono(10.5, "var(--text-3)") }}>{badge}</span>}
            </a>
          ))}
          <div style={{ padding: "14px 8px 6px", ...mono(9.5, "var(--text-3)"), letterSpacing: ".14em", textTransform: "uppercase" }}>
            Account
          </div>
          {NAV_ACCOUNT.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              className="bg-transparent text-[var(--text-2)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text)]"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 8px",
                borderRadius: "var(--r-sm)",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 11,
            border: "1px solid var(--border)",
            borderRadius: "var(--r-md)",
            background: "var(--surface-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)" }}>Included runs</span>
            <span style={mono(11, "var(--text-3)")}>6.2k / 10k</span>
          </div>
          <span style={{ display: "block", height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
            <span style={{ display: "block", width: "62%", height: "100%", borderRadius: 999, background: "var(--accent)" }} />
          </span>
          <span style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.4 }}>Resets in 12 days</span>
        </div>
      </aside>
      )}

      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Northline</span>
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>/</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>Overview</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <IconGhostButton>
              <Bell size={16} strokeWidth={1.9} aria-hidden="true" />
            </IconGhostButton>
            <IconGhostButton>
              <CircleHelp size={16} strokeWidth={1.9} aria-hidden="true" />
            </IconGhostButton>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "var(--surface-3)",
                color: "var(--text-2)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              MK
            </span>
          </div>
        </header>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 12, padding: "22px 20px 0" }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 23, fontWeight: 600, letterSpacing: "-.02em", color: "var(--text)" }}>Overview</h1>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "var(--text-2)" }}>
              Everything running across your workspace this month.
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              type="button"
              className="border-[var(--border)] transition-colors hover:border-[var(--border-strong)]"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderWidth: 1,
                borderStyle: "solid",
                background: "var(--surface)",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                font: "inherit",
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              <Download size={14} aria-hidden="true" />
              Export
            </button>
            <button
              type="button"
              className="bg-[var(--accent)] transition-colors hover:bg-[var(--accent-hover)]"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 13px",
                border: "1px solid transparent",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                font: "inherit",
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--accent-fg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Plus size={14} strokeWidth={2.2} aria-hidden="true" />
              New project
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, padding: "16px 20px 0", borderBottom: "1px solid var(--border)" }}>
          {PAGE_TABS.map((tab, i) => (
            <span
              key={tab}
              style={{
                paddingBottom: 9,
                borderBottom: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
                fontSize: 13,
                fontWeight: i === 0 ? 600 : 500,
                color: i === 0 ? "var(--text)" : "var(--text-3)",
              }}
            >
              {tab}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "18px 20px 28px" }}>
          <div
            ref={statsRef}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${statCols},1fr)`,
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              background: "var(--surface)",
              overflow: "hidden",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  padding: "15px 16px",
                  borderRight: (i + 1) % statCols !== 0 ? "1px solid var(--border)" : undefined,
                  borderBottom: i < STATS.length - statCols ? "1px solid var(--border)" : undefined,
                }}
              >
                <span style={label9}>{s.label}</span>
                <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: "var(--text)" }}>
                  {s.value}
                  {s.unit && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-3)" }}>{s.unit}</span>}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="58" height="18" viewBox="0 0 58 18" fill="none" preserveAspectRatio="none">
                    <path d={s.spark} stroke={s.sparkColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ ...mono(11, s.deltaColor), fontWeight: 500 }}>{s.delta}</span>
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14, alignItems: "start" }}>
            <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Throughput</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--text-3)" }}>
                  <span style={{ width: 7, height: 2, borderRadius: 2, background: "var(--accent)" }} />
                  this period
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--text-3)" }}>
                  <span style={{ width: 7, height: 2, borderRadius: 2, background: "var(--border-strong)" }} />
                  previous
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 2, padding: 3, background: "var(--surface-3)", borderRadius: "var(--r-sm)" }}>
                  {["7d", "30d", "90d"].map((seg) => (
                    <span
                      key={seg}
                      style={{
                        padding: "5px 11px",
                        borderRadius: "calc(var(--r-sm) - 2px)",
                        fontSize: 12,
                        fontWeight: seg === "30d" ? 600 : 500,
                        background: seg === "30d" ? "var(--surface)" : "transparent",
                        color: seg === "30d" ? "var(--text)" : "var(--text-3)",
                        boxShadow: seg === "30d" ? "var(--shadow-sm)" : undefined,
                      }}
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 560 170" width="100%" height="170" fill="none" preserveAspectRatio="none" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="ps-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 42H560M0 84H560M0 126H560" stroke="var(--border)" strokeWidth="1" />
                <path
                  d="M0 118L47 104L93 110L140 86L186 92L233 66L279 74L326 52L372 58L419 36L465 44L512 24L560 30V170H0Z"
                  fill="url(#ps-area)"
                />
                <path
                  d="M0 118L47 104L93 110L140 86L186 92L233 66L279 74L326 52L372 58L419 36L465 44L512 24L560 30"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 138L47 132L93 136L140 124L186 128L233 118L279 122L326 110L372 114L419 104L465 108L512 98L560 102"
                  stroke="var(--border-strong)"
                  strokeWidth="1.6"
                  strokeDasharray="4 5"
                  strokeLinecap="round"
                />
                <circle cx="512" cy="24" r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.4" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", ...mono(10, "var(--text-3)") }}>
                <span>Aug 10</span>
                <span>Aug 17</span>
                <span>Aug 24</span>
                <span>Aug 31</span>
                <span>Sep 07</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 11 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Activity</span>
                  <a
                    href="#"
                    className="text-[var(--text-3)] transition-colors hover:text-[var(--text)]"
                    style={{ fontSize: 11.5, fontWeight: 500, textDecoration: "none" }}
                  >
                    View all
                  </a>
                </div>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 9 }}>
                    <span style={{ marginTop: 5, width: 6, height: 6, flex: "none", borderRadius: 999, background: a.dot }} />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <span style={{ fontSize: 12.5, color: "var(--text)" }}>{a.text}</span>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>{a.time}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Automations</span>
                <AutomationRow label="Auto-retry failures" sub="Up to three attempts" on={autoRetry} onChange={setAutoRetry} />
                <AutomationRow label="Weekly digest" sub="Mondays, 9am" on={weeklyDigest} onChange={setWeeklyDigest} />
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", background: "var(--surface)", overflow: "hidden" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Projects</span>
              <span style={{ ...mono(11, "var(--text-3)"), padding: "1px 6px", borderRadius: 999, background: "var(--surface-3)" }}>18</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 9px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--text-3)" }}>
                  <Search size={13} aria-hidden="true" />
                  Filter
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 9px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--text-3)" }}>
                  Updated
                </span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Project", "Status", "Owner", "Runs", "Updated"].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: "9px 16px",
                          textAlign: i >= 3 ? "right" : "left",
                          ...mono(9.5, "var(--text-3)"),
                          letterSpacing: ".13em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROJECTS.map((p, i) => (
                    <tr
                      key={p.name}
                      className="transition-colors hover:bg-[var(--surface-2)]"
                      style={{ borderBottom: i < PROJECTS.length - 1 ? "1px solid var(--border)" : undefined }}
                    >
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{p.name}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: p.dot }} />
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: 12.5, color: "var(--text-2)" }}>{p.owner}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", ...mono(12, "var(--text-2)") }}>{p.runs}</td>
                      <td style={{ padding: "11px 16px", textAlign: "right", fontSize: 12, color: "var(--text-3)" }}>{p.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ marginLeft: "auto", color: "var(--text-3)" }}>
      <path d="M7 9l5 5 5-5" />
    </svg>
  );
}

function IconGhostButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="bg-transparent transition-colors hover:bg-[var(--surface-3)]"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        border: "1px solid transparent",
        borderRadius: "var(--r-sm)",
        color: "var(--text-2)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function AutomationRow({
  label,
  sub,
  on,
  onChange,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text)" }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>{sub}</span>
      </span>
      <span
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
          onChange(!on);
        }}
        style={{
          marginLeft: "auto",
          position: "relative",
          display: "block",
          width: 34,
          height: 19,
          flex: "none",
          borderRadius: 999,
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
    </label>
  );
}
