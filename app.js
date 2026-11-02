/* ==========================================================================
   GiftOrbit Main Application Component & Root Mount
   ========================================================================== */

function GiftOrbitApp() {
  const [view, setView] = React.useState("home");
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const [wishlist, setWishlist] = React.useState(SEED_WISHLIST);
  const [history, setHistory] = React.useState(SEED_HISTORY);

  const [step, setStep] = React.useState(0);
  const [finderData, setFinderData] = React.useState({
    recipient: "",
    occasion: "",
    interests: [],
    budget: 150,
    style: "",
  });
  const [finderComplete, setFinderComplete] = React.useState(false);

  const [messages, setMessages] = React.useState([]);
  const [chatInput, setChatInput] = React.useState("");
  const [chatLoading, setChatLoading] = React.useState(false);

  // Restore persisted state from localStorage or window.storage
  React.useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("giftorbit:wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      const storedHistory = localStorage.getItem("giftorbit:history");
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } catch (e) {
      // Fallback for sandboxed environments
      if (typeof window !== "undefined" && window.storage) {
        window.storage.get("giftorbit:wishlist").then((w) => {
          if (w && w.value) setWishlist(JSON.parse(w.value));
        }).catch(() => {});
        window.storage.get("giftorbit:history").then((h) => {
          if (h && h.value) setHistory(JSON.parse(h.value));
        }).catch(() => {});
      }
    }
  }, []);

  function persistWishlist(next) {
    setWishlist(next);
    try {
      localStorage.setItem("giftorbit:wishlist", JSON.stringify(next));
    } catch (e) {
      if (typeof window !== "undefined" && window.storage) {
        window.storage.set("giftorbit:wishlist", JSON.stringify(next)).catch(() => {});
      }
    }
  }

  function persistHistory(next) {
    setHistory(next);
    try {
      localStorage.setItem("giftorbit:history", JSON.stringify(next));
    } catch (e) {
      if (typeof window !== "undefined" && window.storage) {
        window.storage.set("giftorbit:history", JSON.stringify(next)).catch(() => {});
      }
    }
  }

  function addToWishlist(item) {
    if (wishlist.some((w) => w.name === item.name)) return;
    persistWishlist([
      ...wishlist,
      { name: item.name, price: item.price, blurb: item.blurb || "" },
    ]);
  }

  function removeFromWishlist(name) {
    persistWishlist(wishlist.filter((w) => w.name !== name));
  }

  function markGifted(item) {
    persistHistory([
      {
        name: item.name,
        price: item.price,
        recipient: finderData.recipient || "someone",
        date: new Date().toISOString().slice(0, 10),
      },
      ...history,
    ]);
    removeFromWishlist(item.name);
  }

  async function askGenie(userText, profileOverride) {
    const profile = profileOverride || finderData;
    const history_ = [...messages, { role: "user", content: userText }];
    setMessages(history_);
    setChatLoading(true);

    try {
      // If an Anthropic API Key is configured in localStorage or environment, use direct API
      const apiKey = localStorage.getItem("ANTHROPIC_API_KEY");
      if (!apiKey) {
        // Use smart intelligent recommendation fallback
        await new Promise((r) => setTimeout(r, 600)); // natural typing delay
        const fallback = window.getSmartFallbackSuggestions(profile, userText);
        setMessages([
          ...history_,
          { role: "assistant", content: fallback.reply, suggestions: fallback.suggestions },
        ]);
        return;
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content:
                "You are Gift Genie, a witty and concise AI gift concierge inside the GiftOrbit app.\n" +
                "Recipient profile: " + JSON.stringify(profile) + "\n" +
                "Conversation so far (oldest first): " + JSON.stringify(history_) + "\n\n" +
                "Reply with STRICT JSON only — no markdown fences, no preamble, no trailing text — in exactly this shape:\n" +
                '{"reply": "one or two warm, conversational sentences", "suggestions": [{"name": "product name", "price": "$XX", "blurb": "one short sentence"}]}\n' +
                "Give up to 3 suggestions that fit the budget and interests. If the user is just chatting with no new ask, you may return an empty suggestions array.",
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("API call returned " + res.status);
      const data = await res.json();
      const text = (data.content || []).map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setMessages([
        ...history_,
        { role: "assistant", content: parsed.reply, suggestions: parsed.suggestions || [] },
      ]);
    } catch (e) {
      // Graceful fallback to smart local recommendation engine
      const fallback = window.getSmartFallbackSuggestions(profile, userText);
      setMessages([
        ...history_,
        { role: "assistant", content: fallback.reply, suggestions: fallback.suggestions },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleSend() {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput("");
    askGenie(text);
  }

  function completeFinder() {
    setFinderComplete(true);
    setMessages([]);
    askGenie(
      `Here's who I'm shopping for: ${finderData.recipient || "someone"}, for ${finderData.occasion || "an occasion"}, into ${finderData.interests.join(", ") || "a variety of things"}, budget up to $${finderData.budget}, style: ${finderData.style || "open"}. What do you recommend?`,
      finderData
    );
  }

  function startSurprise() {
    const random = {
      recipient: RECIPIENTS[Math.floor(Math.random() * RECIPIENTS.length)].key,
      occasion: OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)],
      interests: [
        INTERESTS[Math.floor(Math.random() * INTERESTS.length)],
        INTERESTS[Math.floor(Math.random() * INTERESTS.length)],
      ],
      budget: [50, 100, 150, 250][Math.floor(Math.random() * 4)],
      style: STYLES[Math.floor(Math.random() * STYLES.length)],
    };
    setFinderData(random);
    setView("finder");
    setFinderComplete(true);
    setMessages([]);
    askGenie("Surprise me with something great based on this profile.", random);
  }

  function restartFinder() {
    setFinderComplete(false);
    setStep(0);
    setMessages([]);
    setFinderData({ recipient: "", occasion: "", interests: [], budget: 150, style: "" });
  }

  return (
    <div className="go-root">
      <GiftUniverseBackground />
      <div className="go-content">
        <NavBar view={view} setView={setView} wishlistCount={wishlist.length} />
        <main className="go-main">
          {view === "home" && (
            <HomeView
              setView={setView}
              selected={selectedCategory}
              setSelected={setSelectedCategory}
              startSurprise={startSurprise}
            />
          )}
          {view === "finder" && (
            finderComplete ? (
              <ResultsView
                messages={messages}
                loading={chatLoading}
                input={chatInput}
                setInput={setChatInput}
                onSend={handleSend}
                onAdd={addToWishlist}
                wishlist={wishlist}
                finderData={finderData}
                onRestart={restartFinder}
              />
            ) : (
              <Wizard
                finderData={finderData}
                setFinderData={setFinderData}
                step={step}
                setStep={setStep}
                onComplete={completeFinder}
              />
            )
          )}
          {view === "dashboard" && (
            <DashboardView wishlist={wishlist} history={history} onAdd={addToWishlist} />
          )}
          {view === "wishlist" && (
            <WishlistView
              wishlist={wishlist}
              onRemove={removeFromWishlist}
              onGifted={markGifted}
            />
          )}
        </main>
        <footer className="go-footer">
          <div className="go-logo">
            <span className="go-logo-mark" /> GiftOrbit
          </div>
          <div className="go-footer-links">
            <span>Contact</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Shipping</span>
          </div>
          <small>© 2026 GiftOrbit. Powered by AI.</small>
        </footer>
      </div>
    </div>
  );
}

// Mount to DOM root
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<GiftOrbitApp />);
}
