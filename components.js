/* ==========================================================================
   GiftOrbit UI Sub-Components
   ========================================================================== */

const {
  Sparkles, Gift, Heart, User, Users, Briefcase, Search, ArrowRight, ArrowLeft,
  Send, Plus, Calendar, TrendingUp, LayoutDashboard, Wand2, X, Check, Loader2,
  Trash2, ICON_MAP
} = window.GiftOrbitIcons;

/* -------------------------------- NavBar --------------------------------- */

function NavBar({ view, setView, wishlistCount }) {
  const links = [
    { key: "home", label: "Orbit" },
    { key: "finder", label: "Gift Finder" },
    { key: "dashboard", label: "Dashboard" },
  ];

  return (
    <div className="go-nav">
      <div className="go-logo" onClick={() => setView("home")}>
        <span className="go-logo-mark" /> GiftOrbit
      </div>
      <div className="go-navlinks">
        {links.map((l) => (
          <button
            key={l.key}
            className={`go-navlink ${view === l.key ? "active" : ""}`}
            onClick={() => setView(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="go-navright">
        <button className="go-pill" onClick={() => setView("wishlist")}>
          <Heart size={14} /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- HomeView -------------------------------- */

function HomeView({ setView, selected, setSelected, startSurprise }) {
  const cat = CATEGORIES.find((c) => c.name === selected);

  return (
    <div>
      <div className="go-hero">
        <div className="go-eyebrow go-mono">AI-POWERED GIFTING</div>
        <h1 className="go-h1">Find the gift <span>in the universe</span> around them</h1>
        <p className="go-sub">Every great gift idea is already out there. Pick a category, and let Gift Genie pull it into view.</p>

        <div className="go-selected-banner">
          {cat ? <>Exploring <b>{cat.name}</b> — {cat.blurb}.</> : "No category selected yet."}
        </div>

        <div className="go-cta-row">
          <button className="go-btn-primary" onClick={() => setView("finder")}>
            <Sparkles size={16} /> Find My Gift
          </button>
          <button className="go-btn-ghost" onClick={startSurprise}>
            <Wand2 size={16} /> Surprise Me
          </button>
        </div>
      </div>

      <div className="go-section-head">
        <div className="go-section-title">Curated Categories</div>
        <div className="go-tag"><span className="dot" /> AI CURATED</div>
      </div>

      <div className="go-cat-grid">
        {CATEGORIES.map((c) => (
          <div
            key={c.name}
            className="go-cat-card"
            onClick={() => setSelected(c.name)}
            style={{ borderColor: selected === c.name ? c.color : undefined }}
          >
            <div className="go-cat-dot" style={{ background: `${c.color}22`, color: c.color }}>
              <Gift size={16} />
            </div>
            <div className="go-cat-name">{c.name}</div>
            <div className="go-cat-blurb">{c.blurb}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Wizard -------------------------------- */

function Wizard({ finderData, setFinderData, step, setStep, onComplete }) {
  const update = (patch) => setFinderData((d) => ({ ...d, ...patch }));

  const toggleInterest = (i) => {
    const has = finderData.interests.includes(i);
    update({ interests: has ? finderData.interests.filter((x) => x !== i) : [...finderData.interests, i] });
  };

  const canNext = [
    !!finderData.recipient,
    !!finderData.occasion,
    finderData.interests.length > 0,
    true,
    !!finderData.style,
  ][step];

  return (
    <div className="go-wizard go-panel">
      <div className="go-wizard-head">
        <div className="go-eyebrow go-mono">AI ASSISTED DISCOVERY</div>
        <h2>Configure Gift</h2>
      </div>

      <div className="go-steps">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`go-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
            <div className="go-step-line" />
            <div className="go-step-circle">{i < step ? <Check size={14} /> : i + 1}</div>
            <div className="go-step-label">{label}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <React.Fragment>
          <div className="go-q">Who are we gifting?</div>
          <div className="go-option-grid">
            {RECIPIENTS.map(({ key, sub, icon }) => {
              const IconComp = ICON_MAP[icon] || Heart;
              return (
                <div
                  key={key}
                  className={`go-option ${finderData.recipient === key ? "selected" : ""}`}
                  onClick={() => update({ recipient: key })}
                >
                  <div className="go-option-icon"><IconComp size={18} /></div>
                  <div>
                    <div className="go-option-title">{key}</div>
                    <div className="go-option-sub">{sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}

      {step === 1 && (
        <React.Fragment>
          <div className="go-q">What's the occasion?</div>
          <div className="go-chip-grid">
            {OCCASIONS.map((o) => (
              <div
                key={o}
                className={`go-chip ${finderData.occasion === o ? "selected" : ""}`}
                onClick={() => update({ occasion: o })}
              >
                {o}
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      {step === 2 && (
        <React.Fragment>
          <div className="go-q">What are they into?</div>
          <div className="go-chip-grid">
            {INTERESTS.map((i) => (
              <div
                key={i}
                className={`go-chip ${finderData.interests.includes(i) ? "selected" : ""}`}
                onClick={() => toggleInterest(i)}
              >
                {i}
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      {step === 3 && (
        <React.Fragment>
          <div className="go-q">What's the budget?</div>
          <div className="go-budget-display">${finderData.budget}<span> max</span></div>
          <input
            className="go-slider"
            type="range"
            min="20"
            max="500"
            step="10"
            value={finderData.budget}
            onChange={(e) => update({ budget: Number(e.target.value) })}
          />
        </React.Fragment>
      )}

      {step === 4 && (
        <React.Fragment>
          <div className="go-q">Pick a style</div>
          <div className="go-chip-grid">
            {STYLES.map((s) => (
              <div
                key={s}
                className={`go-chip ${finderData.style === s ? "selected" : ""}`}
                onClick={() => update({ style: s })}
              >
                {s}
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      <div className="go-wizard-nav">
        {step > 0 ? (
          <button className="go-back-link" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={15} /> Back
          </button>
        ) : <span />}
        <button
          className="go-btn-primary"
          disabled={!canNext}
          onClick={() => (step === 4 ? onComplete() : setStep(step + 1))}
        >
          {step === 4 ? "Reveal Gifts" : "Next Step"} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- GiftGenie ------------------------------- */

function GiftGenie({ messages, loading, input, setInput, onSend, onAdd, wishlist }) {
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="go-genie">
      <div className="go-genie-head">
        <div className="go-genie-avatar"><Sparkles size={15} color="#FFF7F7" /></div>
        <div className="go-genie-title">Gift Genie</div>
      </div>
      <div className="go-genie-body" ref={bodyRef}>
        {messages.length === 0 && !loading && (
          <div className="go-empty">Ask the Genie anything — "under $50?", "something for a coffee lover"...</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`go-bubble ${m.role === "user" ? "user" : "genie"}`}>
            {m.content}
            {m.suggestions && m.suggestions.length > 0 && (
              <div className="go-mini-sugg">
                {m.suggestions.map((s, i) => {
                  const added = wishlist.some((w) => w.name === s.name);
                  return (
                    <div key={i} className="go-mini-sugg-row">
                      <span>{s.name} <span style={{ color: "var(--muted)" }}>· {s.price}</span></span>
                      <button
                        className={`go-add-btn ${added ? "added" : ""}`}
                        style={{ width: 24, height: 24 }}
                        onClick={() => onAdd(s)}
                      >
                        {added ? <Check size={12} /> : <Plus size={12} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="go-bubble genie">
            <div className="go-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      <div className="go-genie-input-row">
        <input
          className="go-genie-input"
          placeholder="Ask the Genie..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) onSend();
          }}
        />
        <button
          className="go-genie-send"
          disabled={loading || !input.trim()}
          onClick={onSend}
        >
          {loading ? <Loader2 size={16} className="go-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- ResultsView ----------------------------- */

function ResultsView({ messages, loading, input, setInput, onSend, onAdd, wishlist, finderData, onRestart }) {
  const lastWithSuggestions = [...messages].reverse().find((m) => m.suggestions && m.suggestions.length > 0);

  return (
    <div>
      <div className="go-section-head">
        <div>
          <div className="go-section-title">Top Matches for {finderData.recipient || "them"}</div>
          <div className="go-empty" style={{ textAlign: "left", padding: 0 }}>
            We cross-referenced their profile against live trends to find these.
          </div>
        </div>
        <button className="go-back-link" onClick={onRestart}>
          <ArrowLeft size={15} /> Start over
        </button>
      </div>
      <div className="go-results">
        <div>
          {lastWithSuggestions ? lastWithSuggestions.suggestions.map((s, i) => {
            const added = wishlist.some((w) => w.name === s.name);
            return (
              <div key={i} className="go-suggestion">
                <div className="go-suggestion-thumb"><Gift size={22} color="#FFF7F7" /></div>
                <div className="go-suggestion-body">
                  <div className="go-suggestion-name">{s.name}</div>
                  <div className="go-suggestion-blurb">{s.blurb}</div>
                  <div className="go-suggestion-price">{s.price}</div>
                </div>
                <button
                  className={`go-add-btn ${added ? "added" : ""}`}
                  onClick={() => onAdd(s)}
                >
                  {added ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            );
          }) : (
            <div className="go-panel go-empty">The Genie is thinking through their profile — check the chat panel.</div>
          )}
        </div>
        <GiftGenie
          messages={messages}
          loading={loading}
          input={input}
          setInput={setInput}
          onSend={onSend}
          onAdd={onAdd}
          wishlist={wishlist}
        />
      </div>
    </div>
  );
}

/* ------------------------------ AnalyticsChart --------------------------- */

function AnalyticsBarChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = React.useState(null);
  const maxVal = Math.max(...data.map((d) => d.amount), 1);
  const width = 500;
  const height = 180;
  const paddingBottom = 26;
  const paddingTop = 20;
  const chartHeight = height - paddingBottom - paddingTop;
  const barWidth = 44;
  const spacing = (width - data.length * barWidth) / (data.length + 1);

  return (
    <div className="go-chart-container">
      <svg className="go-chart-svg" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="barGradNormal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#3B0A0A" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((r, i) => {
          const y = paddingTop + chartHeight * (1 - r);
          return (
            <line
              key={i}
              x1="10"
              y1={y}
              x2={width - 10}
              y2={y}
              stroke="var(--line)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Bars and labels */}
        {data.map((d, i) => {
          const isMax = d.amount === maxVal;
          const barH = (d.amount / maxVal) * chartHeight;
          const x = spacing + i * (barWidth + spacing);
          const y = paddingTop + chartHeight - barH;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={d.month}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={6}
                ry={6}
                fill={isMax || isHovered ? "url(#barGradActive)" : "url(#barGradNormal)"}
                className="go-chart-bar"
              />
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fill="#C4A7AD"
                fontSize="12"
                fontFamily="Inter, sans-serif"
              >
                {d.month}
              </text>
              {isHovered && (
                <g>
                  <rect
                    x={x + barWidth / 2 - 30}
                    y={Math.max(y - 28, 4)}
                    width="60"
                    height="20"
                    rx="5"
                    fill="#241017"
                    stroke="#F43F5E"
                    strokeWidth="1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(y - 14, 18)}
                    textAnchor="middle"
                    fill="#FFF7F7"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    ${d.amount}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------ DashboardView ---------------------------- */

function DashboardView({ wishlist, history, onAdd }) {
  const totalGifted = history.reduce((sum, h) => sum + (parseFloat(String(h.price).replace(/[^0-9.]/g, "")) || 0), 0);
  const recommended = [
    { name: "Ember Smart Mug 2", price: "$149.99", blurb: "Temperature-control smart mug with charging coaster." },
    { name: "NuPhy Halo75", price: "$129.00", blurb: "Wireless mechanical keyboard, premium tactile switches." },
    { name: "Bellroy Slim Sleeve", price: "$79.00", blurb: "Premium leather minimalist wallet." },
  ];

  return (
    <div>
      <h2 className="go-display" style={{ fontSize: 30, fontWeight: 700, marginTop: 30 }}>Welcome back.</h2>
      <p className="go-empty" style={{ textAlign: "left", padding: "4px 0 0" }}>Here's your gifting universe, tailored just for you.</p>

      <div className="go-dash-grid">
        <div className="go-panel">
          <div className="go-section-head" style={{ marginBottom: 6 }}>
            <div className="go-section-title" style={{ fontSize: 16 }}>Gifting Analytics</div>
            <div className="go-tag"><span className="dot" /> AI PREDICTIVE</div>
          </div>
          <AnalyticsBarChart data={CHART_DATA} />
        </div>
        <div className="go-stat-col">
          <div className="go-card">
            <div className="go-stat-label">Upcoming Events</div>
            <div className="go-stat-value">3</div>
          </div>
          <div className="go-card">
            <div className="go-stat-label">Total Gifted</div>
            <div className="go-stat-value">${totalGifted.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div className="go-section-head">
        <div className="go-section-title">AI Recommended for You</div>
      </div>
      <div className="go-rec-grid">
        {recommended.map((r) => {
          const added = wishlist.some((w) => w.name === r.name);
          return (
            <div key={r.name} className="go-card">
              <div className="go-rec-thumb"><Gift size={26} color="#FFF7F7" /></div>
              <div className="go-suggestion-name">{r.name}</div>
              <div className="go-suggestion-blurb">{r.blurb}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <div className="go-suggestion-price">{r.price}</div>
                <button
                  className={`go-add-btn ${added ? "added" : ""}`}
                  onClick={() => onAdd(r)}
                >
                  {added ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="go-two-col">
        <div className="go-panel">
          <div className="go-section-title" style={{ fontSize: 16, marginBottom: 12 }}>
            <Heart size={15} style={{ verticalAlign: -2, marginRight: 6 }} />Recent Wishlist
          </div>
          {wishlist.length === 0 ? <div className="go-empty">Nothing saved yet.</div> :
            wishlist.slice(0, 4).map((w) => (
              <div key={w.name} className="go-list-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</div>
                  <div className="go-suggestion-price">{w.price}</div>
                </div>
              </div>
            ))}
        </div>
        <div className="go-panel">
          <div className="go-section-title" style={{ fontSize: 16, marginBottom: 12 }}>
            <Calendar size={15} style={{ verticalAlign: -2, marginRight: 6 }} />Gift History
          </div>
          {history.length === 0 ? <div className="go-empty">No gifts logged yet.</div> :
            history.slice(0, 4).map((h, i) => (
              <div key={i} className="go-list-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Gifted to {h.recipient}</div>
                  <div className="go-empty" style={{ textAlign: "left", padding: 0 }}>{h.name} · {h.date}</div>
                </div>
                <div className="go-suggestion-price">{h.price}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- WishlistView ---------------------------- */

function WishlistView({ wishlist, onRemove, onGifted }) {
  return (
    <div>
      <h2 className="go-display" style={{ fontSize: 30, fontWeight: 700, marginTop: 30, marginBottom: 20 }}>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="go-panel go-empty">Nothing here yet — add gifts from the Finder or Dashboard.</div>
      ) : (
        wishlist.map((w) => (
          <div key={w.name} className="go-suggestion">
            <div className="go-suggestion-thumb"><Gift size={22} color="#FFF7F7" /></div>
            <div className="go-suggestion-body">
              <div className="go-suggestion-name">{w.name}</div>
              <div className="go-suggestion-blurb">{w.blurb}</div>
              <div className="go-suggestion-price">{w.price}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="go-add-btn" onClick={() => onGifted(w)} title="Mark as gifted">
                <Check size={16} />
              </button>
              <button className="go-add-btn" onClick={() => onRemove(w.name)} title="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Make accessible to window
if (typeof window !== "undefined") {
  window.NavBar = NavBar;
  window.HomeView = HomeView;
  window.Wizard = Wizard;
  window.GiftGenie = GiftGenie;
  window.ResultsView = ResultsView;
  window.DashboardView = DashboardView;
  window.WishlistView = WishlistView;
}
