# 🎁 GiftOrbit — AI-Powered Gift Discovery

An immersive, cosmic gift discovery application featuring a real-time **Three.js 3D universe**, interactive step-by-step gift finder wizard, **Gift Genie AI assistant**, responsive analytics dashboard, and persistent wishlist.

---

## 📁 Project Structure

All files are neatly decoupled and organized in this folder:

```
giftorbit/
├── index.html       # Clean HTML5 entry point loading scripts & styles
├── styles.css       # Complete application styling, variables & dark mode theme
├── constants.js     # Categories, recipient profiles, occasions, styles & seed data
├── icons.js         # Lucide-compatible SVG React icon components
├── universe.js      # Three.js 3D background animation with floating gifts & particles
├── components.js    # Subviews: NavBar, HomeView, Wizard, GiftGenie, Dashboard, Wishlist
├── app.js           # Main GiftOrbitApp component, state management & API/Genie logic
├── start.bat        # 1-Click launcher (starts local Python server & opens browser)
└── README.md        # Documentation and customization guide
```

---

## 🚀 How to Run

Because modern browsers restrict modular script loading over the raw `file:///` protocol for security reasons, run the app using any local HTTP server:

### Option 1: 1-Click Launcher (Windows)
Double-click **`start.bat`** in this folder. It will automatically start a local server and open your default browser to `http://localhost:8000`.

### Option 2: Command Line (Python)
Open a terminal in this folder and run:
```bash
python -m http.server 8000
```
Then navigate to: **[http://localhost:8000](http://localhost:8000)**

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## ⚙️ Features & Architecture

1. **Modular Architecture**:
   - `styles.css`: Dark burgundy void aesthetic (`--void: #050304`, `--cyan: #F43F5E`, `--violet: #DC2626`).
   - `constants.js`: Fully editable gift categories, recipient archetypes, budget options, and a built-in intelligent recommendation fallback engine.
   - `icons.js`: 19 lightweight, native SVG Lucide icon components with zero npm dependencies.
   - `universe.js`: High-performance Three.js 3D canvas with floating gift boxes, extruded hearts, ribbons, balloons, and starfields responding to mouse parallax.
   - `components.js`: Reusable UI modules including an interactive SVG Bar Chart with hover tooltips and dynamic highlights.
   - `app.js`: State management with automatic `localStorage` persistence for Wishlist and Gift History.

2. **AI Integration**:
   - Out of the box, **Gift Genie** uses an intelligent local recommendation engine tailored to the recipient's interests, budget, and occasion.
   - If you want live Anthropic Claude API responses, you can set your key in the browser console:
     ```javascript
     localStorage.setItem("ANTHROPIC_API_KEY", "your-sk-ant-key");
     ```
