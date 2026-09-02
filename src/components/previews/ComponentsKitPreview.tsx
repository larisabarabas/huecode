const ALERTS = [
  { title: "Payment received", text: "Halden & Co paid INV-2049.", tone: "su" },
  { title: "Sync delayed", text: "Bank feed is 40 minutes behind.", tone: "w" },
  { title: "Card declined", text: "Update the payment method on file.", tone: "e" },
  { title: "New export format", text: "Tailwind v4 themes are supported.", tone: "i" },
];

const AVATARS = [
  { initials: "MK", varStep: "p-500" },
  { initials: "JT", varStep: "s-500" },
  { initials: "RA", varStep: "a-500" },
];

export default function ComponentsKitPreview() {
  return (
    <div className="mx-auto flex max-w-275 flex-col gap-3.5 p-4 lg:min-w-220 lg:p-6">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4.5">
          <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--text-muted)]">
            Buttons
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button className="rounded-[9px] bg-[var(--p-600)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--p-50)]">
              Primary
            </button>
            <button className="rounded-[9px] bg-[var(--s-600)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--s-50)]">
              Secondary
            </button>
            <button className="rounded-[9px] border border-[var(--p-300)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--p-700)]">
              Outline
            </button>
            <button className="rounded-[9px] px-3 py-2.5 text-[13px] font-semibold text-[var(--p-700)]">
              Ghost
            </button>
            <button className="rounded-[9px] bg-[var(--e-600)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--e-50)]">
              Destructive
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button className="rounded-lg bg-[var(--p-600)] px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--p-50)]">
              Small
            </button>
            <button className="rounded-[10px] bg-[var(--p-600)] px-5 py-3 text-sm font-semibold text-[var(--p-50)]">
              Large
            </button>
            <button className="cursor-not-allowed rounded-[9px] bg-[var(--n-200)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--n-400)]">
              Disabled
            </button>
            <button
              className="rounded-[9px] bg-[var(--p-600)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--p-50)]"
              style={{ boxShadow: "0 0 0 3px var(--p-200)" }}
            >
              Focused
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4.5">
          <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--text-muted)]">Form</div>
          <div className="mt-3.5 flex flex-col gap-2.5">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--text)]">Workspace name</span>
              <input
                readOnly
                value="Northwind"
                className="rounded-[9px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-2.5 text-[13px] text-[var(--text)] outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--text)]">Billing email</span>
              <input
                readOnly
                value="billing@northwind.co"
                className="rounded-[9px] border border-[var(--p-500)] bg-[var(--bg)] px-2.5 py-2.5 text-[13px] text-[var(--text)] outline-none"
                style={{ boxShadow: "0 0 0 3px var(--p-100)" }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--text)]">Plan</span>
              <select className="rounded-[9px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-2.5 text-[13px] text-[var(--text)] outline-none">
                <option>Team — $24 / seat</option>
                <option>Business — $48 / seat</option>
              </select>
            </label>
            <div className="flex items-center gap-4 pt-0.5">
              <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--text)]">
                <span className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-[var(--p-600)] text-[10px] font-bold text-[var(--p-50)]">
                  ✓
                </span>
                Weekly digest
              </label>
              <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--text-muted)]">
                <span className="inline-block h-4 w-4 rounded-[5px] border border-[var(--n-300)]" />
                SMS alerts
              </label>
              <span className="relative ml-auto inline-block h-5.5 w-9.5 rounded-full bg-[var(--p-600)]">
                <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4.5">
          <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--text-muted)]">
            Feedback
          </div>
          {ALERTS.map((a) => (
            <div
              key={a.title}
              className="flex gap-2.5 rounded-[9px] border p-2.5"
              style={{ backgroundColor: `var(--${a.tone}-50)`, borderColor: `var(--${a.tone}-200)` }}
            >
              <span
                className="mt-1 h-2 w-2 flex-none rounded-full"
                style={{ backgroundColor: `var(--${a.tone}-500)` }}
              />
              <div>
                <div className="text-[12.5px] font-semibold" style={{ color: `var(--${a.tone}-900)` }}>
                  {a.title}
                </div>
                <div className="mt-0.5 text-[11.5px]" style={{ color: `var(--${a.tone}-700)` }}>
                  {a.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4.5">
          <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--text-muted)]">
            Navigation
          </div>
          <div className="flex gap-4.5 border-b border-[var(--border)]">
            <span className="border-b-2 border-[var(--p-600)] pb-2 text-[12.5px] font-semibold text-[var(--p-700)]">
              Activity
            </span>
            <span className="pb-2 text-[12.5px] font-medium text-[var(--text-muted)]">Members</span>
            <span className="pb-2 text-[12.5px] font-medium text-[var(--text-muted)]">Billing</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[var(--p-100)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--p-800)]">
              Design
            </span>
            <span className="rounded-full bg-[var(--s-100)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--s-800)]">
              Research
            </span>
            <span className="rounded-full bg-[var(--a-100)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--a-800)]">
              Ops
            </span>
            <span className="rounded-full bg-[var(--n-100)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--text-muted)]">
              +4
            </span>
          </div>
          <div className="flex items-center">
            {AVATARS.map((av) => (
              <div
                key={av.initials}
                className="-mr-2 flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 border-[var(--surface)] text-[11px] font-semibold text-white"
                style={{ backgroundColor: `var(--${av.varStep})` }}
              >
                {av.initials}
              </div>
            ))}
            <div className="-mr-2 flex h-7.5 w-7.5 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--n-200)] text-[11px] font-semibold text-[var(--text-muted)]">
              +6
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4.5">
          <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--text-muted)]">
            Overlay
          </div>
          <div
            className="rounded-[11px] border border-[var(--border)] bg-[var(--bg)] p-3.5"
            style={{ boxShadow: "0 12px 30px rgba(15,15,20,.10)" }}
          >
            <div className="text-[13.5px] font-bold text-[var(--text)]">Delete workspace?</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              This removes all 12 projects and cannot be undone.
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                Cancel
              </button>
              <button className="rounded-lg bg-[var(--e-600)] px-3 py-1.5 text-xs font-semibold text-[var(--e-50)]">
                Delete
              </button>
            </div>
          </div>
          <div
            className="rounded-[11px] border border-[var(--border)] bg-[var(--bg)] p-1.5"
            style={{ boxShadow: "0 12px 30px rgba(15,15,20,.08)" }}
          >
            <div className="rounded-md bg-[var(--p-50)] px-2.5 py-1.5 text-[12.5px] font-semibold text-[var(--p-800)]">
              Duplicate
            </div>
            <div className="rounded-md px-2.5 py-1.5 text-[12.5px] text-[var(--text)]">Move to…</div>
            <div className="rounded-md px-2.5 py-1.5 text-[12.5px] text-[var(--e-600)]">Delete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
