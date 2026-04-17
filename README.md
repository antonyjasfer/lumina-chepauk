# Lumina — AI-Powered Stadium Concierge for Chepauk

> Real-time crowd analytics & Google Gemini-driven routing for the ultimate IPL fan experience at M.A. Chidambaram Stadium.

## Live Preview
🔗 **[https://lumina-chepauk.vercel.app](https://lumina-chepauk.vercel.app)**

---

## Chosen Vertical
**Physical Event Experience** — Specifically modeled for the high-density, high-stakes environment of M.A. Chidambaram Stadium (Chepauk) during an intense IPL cricket match (37,000+ capacity).

---

## Approach and Logic

Lumina tackles the massive, instantaneous crowd surges that occur during predictable sporting events like an Innings Break or Strategic Timeout.

We built `StadiumEngine`, a 959-line simulation logic engine that generates telemetry for **23 authentic Chepauk stands** (J-Stand, Anna Pavilion, KMK Stand, C–L sections), **10 official IPL sponsor stalls** (Chai Kings, EAM, Dream11, JioCinema, CEAT, CSK SuperStore), and **4 free British Empire water stations**. When an event is triggered, congestion spikes realistically and decays over time.

This telemetry is fed in real-time as context to **Google Gemini 2.0 Flash**, creating an elite "AI Concierge" capable of routing fans away from overwhelmed concessions and towards clear routes — all tailored with authentic Chepauk context.

### Architecture
```
index.html → main.jsx → App.jsx (orchestrator)
                          ├── StadiumEngine.js    (simulation logic — 959 lines)
                          ├── GeminiService.js     (Google Gemini integration)
                          ├── StadiumMap.jsx        (SVG heatmap visualization)
                          ├── Scorecard.jsx          (live cricket scorecard)
                          ├── AiConcierge.jsx        (chat interface)
                          └── ErrorBoundary.jsx      (crash recovery)
```

---

## How the Solution Works

1. **The Heatmap UI**: Pure SVG + Math to visualize dynamic crowd density across 23 stands. Color-coded: 🟢 <60% | 🟡 60–85% | 🔴 >85%.
2. **The Gemini Concierge**: Chat with Lumina to get live, contextual routing. E.g., if you ask for food during an innings break, she reads the `StadiumEngine` stall queues and steers you to the quietest option.
3. **Event Triggers**: Simulation controls trigger Strategic Timeouts (2:30) and Innings Breaks (15 min) — instantly demonstrating Lumina's dynamic responsiveness.
4. **Ball-by-Ball Cricket Simulation**: Full IPL match simulation with DRS reviews, wickets, boundaries, run rates, and crowd excitement reactions.
5. **Next Match Mode**: After a match completes and the stadium empties, start a new match against a randomly selected opponent.

---

## Google Services Integration

| Service | Usage |
|---------|-------|
| **Google Gemini 2.0 Flash** | AI Concierge — receives live stadium telemetry (crowd zones, stall queues, water station loads, match score) and generates contextual routing guidance |
| **`@google/generative-ai` SDK** | Official npm package used for Gemini API integration |
| **Google Fonts** | Inter + Outfit typography for premium UI |

The Gemini prompt includes rich, structured telemetry:
- Busiest/quietest stalls with sponsor names and crowd percentages
- Water station crowd counts
- Live match score and run rates
- Crowd zone breakdown (in-seats, at-amenities, roaming)

---

## Evaluation Criteria Addressed

### Code Quality
- **Modular architecture**: Engine, Service, Component separation
- **JSDoc comments** on all public methods and classes
- **React.memo** on expensive components to prevent unnecessary re-renders
- **useMemo/useCallback** for optimized rendering
- Clean ESLint configuration

### Security
- **`.env` for API keys** — Git-ignored with `.env.example` template provided
- **Input sanitization** — HTML stripping, special char removal, 500-char limit on all user inputs before they reach the AI
- **Rate limiting** — 2-second cooldown between AI requests to prevent abuse
- **Content Security Policy** — CSP meta tag restricting scripts, styles, and API connections
- **ErrorBoundary** — Catches runtime crashes gracefully, prevents stack trace exposure
- **Mock fallback** — UI remains fully functional without an API key

### Efficiency
- **Zero heavy assets** — No PNG/JPG/SVG files. All visuals are pure CSS glassmorphism + inline SVG math
- **`structuredClone`** for immutable state management
- **React.memo** prevents re-renders on StadiumMap, Scorecard, AiConcierge
- **`prefers-reduced-motion`** media query for users who need reduced animations
- Total repo size: **under 1 MB**

### Testing
- **27+ unit tests** via Vitest covering:
  - Stadium initialization (stands, stalls, water stations, attendance)
  - Bounds checking and clamping
  - Ball simulation and run rate calculation
  - Crowd surge dynamics (innings break, strategic timeout)
  - DRS review system
  - Match lifecycle (next match, innings switch)
  - State immutability
- **13+ GeminiService tests** covering:
  - Input sanitization (XSS, HTML stripping, length limits)
  - Mock response routing (food, water, merch, crowd, score queries)
  - Rate limiting
  - Edge cases (empty input, non-string input)
- Run: `npm run test`

### Accessibility
- **WCAG contrast ratios**: Chepauk Yellow (#fcd500) on Midnight Sea (#051624)
- **Semantic HTML**: `<main>`, `<header>`, `<section>`, `<nav>` landmarks
- **Skip-to-content** navigation link
- **ARIA attributes**: `aria-live="polite"` on score updates, `role="log"` on chat, `role="alert"` on DRS reviews, `aria-label` on all interactive elements
- **SVG accessibility**: `role="img"`, `<title>`, `<desc>` on the heatmap SVG
- **Keyboard navigation**: All interactive elements focusable with `focus-visible` outlines
- **`prefers-reduced-motion`**: Disables animations for users who need it
- **`lang="en"`** on HTML element

### Google Services
- Deep integration with **Google Gemini 2.0 Flash** — not just a chatbot, but a telemetry-aware routing engine
- Rich, structured prompts that leverage live stadium data
- Fallback mock engine ensures the UI works identically without an API key

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Production build
npm run build
```

### Environment Variables
```bash
# Copy the template
cp .env.example .env

# Add your Gemini API key (optional — mock mode works without it)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Single Branch Rule
All work committed directly and solely to `main`.
