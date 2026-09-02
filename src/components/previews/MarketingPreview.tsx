const FEATURES = [
  { title: "Chase automatically", text: "Reminders go out on your schedule, in your tone of voice." },
  { title: "Reconcile in one pass", text: "Bank feeds match against invoices before you open the ledger." },
  { title: "Close with confidence", text: "Every adjustment is logged, attributed and reversible." },
];

const PLANS = [
  {
    name: "Starter",
    price: "$12",
    items: ["25 invoices / month", "Email reminders", "1 workspace"],
    highlight: false,
  },
  {
    name: "Team",
    price: "$24",
    items: ["Unlimited invoices", "Automatic tax checks", "5 workspaces"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$48",
    items: ["SSO and audit log", "Dedicated success lead", "Unlimited workspaces"],
    highlight: false,
  },
];

export default function MarketingPreview() {
  return (
    <div className="lg:min-w-220">
      <div className="flex items-center gap-6.5 bg-[var(--brand-deep)] px-4 py-3 lg:px-10 lg:py-4">
        <span className="text-sm font-bold text-[var(--brand-fg)]">Northwind</span>
        <span className="hidden text-[12.5px] text-[var(--brand-fg-2)] lg:inline">Product</span>
        <span className="hidden text-[12.5px] text-[var(--brand-fg-2)] lg:inline">Pricing</span>
        <span className="hidden text-[12.5px] text-[var(--brand-fg-2)] lg:inline">Docs</span>
        <button className="ml-auto rounded-lg bg-[var(--cta-bg)] px-3.5 py-2 text-[12.5px] font-bold text-[var(--cta-fg)]">
          Start free
        </button>
      </div>

      <div className="bg-[var(--brand-deep-2)] px-5 pb-10 pt-9 text-center lg:px-10 lg:pb-18 lg:pt-16">
        <span className="inline-block rounded-full bg-[var(--brand-deep-3)] px-3 py-1.5 text-[11.5px] font-semibold text-[var(--brand-fg-2)]">
          New — automatic tax checks
        </span>
        <h1 className="mx-auto mt-4 max-w-160 text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--brand-fg)] lg:text-[44px]">
          Invoicing that closes the month for you
        </h1>
        <p className="mx-auto mt-3.5 max-w-120 text-[15px] leading-relaxed text-[var(--brand-fg-2)]">
          Send, chase and reconcile invoices in one place. Built for finance teams who would rather be doing
          something else.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <button className="rounded-[10px] bg-[var(--cta-bg)] px-5.5 py-3 text-sm font-bold text-[var(--cta-fg)]">
            Start free trial
          </button>
          <button className="rounded-[10px] border border-[var(--brand-deep-bd)] px-5.5 py-3 text-sm font-semibold text-[var(--brand-fg-3)]">
            Book a demo
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-270 grid-cols-1 gap-5 bg-[var(--bg)] px-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <div className="h-8.5 w-8.5 rounded-[10px] border border-[var(--p-200)] bg-[var(--p-100)]" />
            <div className="mt-3 text-[15px] font-semibold text-[var(--text)]">{f.title}</div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">{f.text}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg)] px-10 pb-14 pt-2">
        <div className="mx-auto grid max-w-270 grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border p-5"
              style={{
                borderColor: p.highlight ? "var(--p-500)" : "var(--border)",
                backgroundColor: p.highlight ? "var(--p-50)" : "var(--pricing-surface)",
              }}
            >
              <div
                className="text-[13px] font-bold"
                style={{ color: p.highlight ? "var(--p-700)" : "var(--text-muted)" }}
              >
                {p.name}
              </div>
              <div
                className="mt-2.5 text-[32px] font-bold tracking-tight"
                style={{ color: p.highlight ? "var(--p-900)" : "var(--text)" }}
              >
                {p.price}
              </div>
              <div className="text-xs" style={{ color: p.highlight ? "var(--p-700)" : "var(--text-muted)" }}>
                per seat, monthly
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                {p.items.map((item) => (
                  <div
                    key={item}
                    className="text-[12.5px]"
                    style={{ color: p.highlight ? "var(--p-700)" : "var(--text-muted)" }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button
                className="mt-4 w-full rounded-[9px] py-2.5 text-[13px] font-semibold"
                style={{
                  backgroundColor: p.highlight ? "var(--p-600)" : "var(--n-100)",
                  color: p.highlight ? "var(--p-50)" : "var(--n-800)",
                }}
              >
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
