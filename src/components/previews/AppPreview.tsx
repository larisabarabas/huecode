const NAV_ITEMS = ["Overview", "Customers", "Invoices", "Reports", "Settings"];

const STATS = [
  { label: "Outstanding", value: "$48,220", delta: "+12.4%", tone: "success" as const },
  { label: "Paid this month", value: "$126,900", delta: "+3.1%", tone: "success" as const },
  { label: "Overdue", value: "$7,410", delta: "−2 invoices", tone: "error" as const },
  { label: "Avg. days to pay", value: "19.2", delta: "+1.5 days", tone: "warning" as const },
];

const BAR_HEIGHTS = [46, 62, 54, 78, 70, 88, 74, 96, 84, 100, 92, 112];

const PROGRESS = [
  { label: "Within terms", value: 78, tone: "success" as const },
  { label: "1–30 days late", value: 46, tone: "warning" as const },
  { label: "Over 30 days", value: 18, tone: "error" as const },
];

const INVOICE_ROWS = [
  { client: "Halden & Co", number: "INV-2049", status: "Paid", amount: "$4,200", tone: "success" as const },
  { client: "Ferro Logistics", number: "INV-2048", status: "Pending", amount: "$18,900", tone: "warning" as const },
  { client: "Vela Studio", number: "INV-2047", status: "Overdue", amount: "$2,150", tone: "error" as const },
  { client: "Northbeam", number: "INV-2046", status: "Draft", amount: "$9,600", tone: "neutral" as const },
  { client: "Quarry Labs", number: "INV-2045", status: "Paid", amount: "$12,480", tone: "success" as const },
];

const TONE_PREFIX = { success: "su", warning: "w", error: "e", neutral: "n" } as const;

export default function AppPreview() {
  return (
    <div className="flex min-h-full flex-col lg:min-w-220 lg:flex-row">
      <div className="flex flex-col gap-2.5 border-b border-[var(--border)] bg-[var(--surface)] p-3.5 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-6.5 w-6.5 rounded-lg bg-[var(--p-600)]" />
          <span className="text-sm font-semibold text-[var(--text)]">Demo App</span>
          <span className="ml-auto flex flex-col gap-[3px]">
            <span className="h-0.5 w-4 rounded bg-[var(--text-muted)]" />
            <span className="h-0.5 w-4 rounded bg-[var(--text-muted)]" />
            <span className="h-0.5 w-4 rounded bg-[var(--text-muted)]" />
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["Overview", "Customers", "Invoices", "Reports"].map((item, i) => (
            <span
              key={item}
              className="flex-none rounded-full px-2.5 py-1.5 text-[12px] font-semibold"
              style={{
                backgroundColor: i === 0 ? "var(--p-50)" : "var(--n-100)",
                color: i === 0 ? "var(--p-700)" : "var(--text-muted)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <aside className="hidden w-52.5 flex-none flex-col gap-4.5 border-r border-[var(--border)] bg-[var(--surface)] p-3 lg:flex">
        <div className="flex items-center gap-2 px-2">
          <div className="h-6.5 w-6.5 rounded-lg bg-[var(--p-600)]" />
          <span className="text-sm font-semibold text-[var(--text)]">Demo App</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium ${
                i === 0 ? "bg-[var(--p-50)] font-semibold text-[var(--p-700)]" : "text-[var(--text-muted)]"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-sm"
                style={{ backgroundColor: i === 0 ? "var(--p-600)" : "var(--n-300)" }}
              />
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2.5 rounded-[10px] bg-[var(--n-100)] p-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--a-500)] text-[11px] font-semibold text-[var(--a-50)]">
            MK
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[var(--text)]">Mara Kell</span>
            <span className="text-[11px] text-[var(--text-muted)]">Admin</span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3">
          <div className="flex max-w-80 flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[12.5px] text-[var(--text-muted)]">
            Search invoices…
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--text)]">
              Invite
            </button>
            <button className="rounded-lg bg-[var(--p-600)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--p-50)]">
              New invoice
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-4 p-3.5 lg:p-5">
          <div className="flex items-start gap-2.5 rounded-[10px] border border-[var(--i-200)] bg-[var(--i-50)] px-3.5 py-2.5">
            <span className="mt-0.5 h-4 w-4 flex-none rounded-full bg-[var(--i-500)]" />
            <div>
              <div className="text-[12.5px] font-semibold text-[var(--i-900)]">Two invoices need review</div>
              <div className="mt-0.5 text-xs text-[var(--i-700)]">They were flagged by the automatic tax check.</div>
            </div>
            <button className="ml-auto px-1 text-xs font-semibold text-[var(--i-700)]">Review</button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
                <div className="text-[11.5px] font-medium uppercase tracking-[.02em] text-[var(--text-muted)]">
                  {s.label}
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)]">{s.value}</div>
                <div
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: `var(--${TONE_PREFIX[s.tone]}-50)`,
                    color: `var(--${TONE_PREFIX[s.tone]}-700)`,
                  }}
                >
                  {s.delta}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-baseline justify-between">
                <div className="text-[13.5px] font-semibold text-[var(--text)]">Revenue</div>
                <div className="text-[11.5px] text-[var(--text-muted)]">Last 12 weeks</div>
              </div>
              <div className="mt-4 flex h-29.5 items-end gap-1.5">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}px`,
                      backgroundColor: i > 8 ? "var(--p-600)" : i % 2 ? "var(--p-300)" : "var(--p-200)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="text-[13.5px] font-semibold text-[var(--text)]">Collection rate</div>
              {PROGRESS.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-[11.5px] font-medium text-[var(--text-muted)]">
                    <span>{p.label}</span>
                    <span>{p.value}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--n-200)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.value}%`, backgroundColor: `var(--${TONE_PREFIX[p.tone]}-500)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="text-[13.5px] font-semibold text-[var(--text)]">Recent invoices</div>
              <div className="flex gap-1.5">
                <span className="rounded-full bg-[var(--p-600)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--p-50)]">
                  All
                </span>
                <span className="rounded-full bg-[var(--n-100)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--text-muted)]">
                  Open
                </span>
                <span className="rounded-full bg-[var(--n-100)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--text-muted)]">
                  Paid
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="bg-[var(--n-50)]">
                  {["Client", "Number", "Status", "Amount"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[.04em] text-[var(--text-muted)] ${
                        i === 3 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICE_ROWS.map((r) => (
                  <tr key={r.number} className="border-t border-[var(--border)]">
                    <td className="px-4 py-2.5 text-[12.5px] font-medium text-[var(--text)]">{r.client}</td>
                    <td className="px-4 py-2.5 font-mono text-[12.5px] text-[var(--text-muted)]">{r.number}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={
                          r.tone === "neutral"
                            ? { backgroundColor: "var(--n-100)", color: "var(--text)" }
                            : {
                                backgroundColor: `var(--${TONE_PREFIX[r.tone]}-50)`,
                                color: `var(--${TONE_PREFIX[r.tone]}-700)`,
                              }
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12.5px] font-semibold text-[var(--text)]">
                      {r.amount}
                    </td>
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
