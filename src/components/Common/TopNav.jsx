export default function TopNav({ tabs, active, onChange }) {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-badge" aria-hidden />
          <h1 className="text-balance">Dashboard with Friends</h1>
        </div>
        <div className="tabs" role="tablist" aria-label="Dashboard Sections">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab ${active === t.key ? "active" : ""}`}
              role="tab"
              aria-selected={active === t.key}
              onClick={() => onChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="helper" aria-live="polite">
          Signed in
        </div>
      </div>
    </div>
  )
}
