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

We built `StadiumEngine`, a 1000+ line simulation logic engine that generates telemetry for **23 authentic Chepauk stands** (J-Stand, Anna Pavilion, KMK Stand, C–L sections), **10 official IPL sponsor stalls** (Chai Kings, EAM, Dream11, JioCinema, CEAT, CSK SuperStore), and **4 free British Empire water stations**. When an event is triggered, congestion spikes realistically and decays over time.

This telemetry is fed in real-time as context to **Google Gemini 2.0 Flash**, creating an elite "AI Concierge" capable of routing fans away from overwhelmed concessions and towards clear routes — all tailored with authentic Chepauk context.

### Architecture
```
index.html → main.jsx → App.jsx (orchestrator)
                          ├── StadiumEngine.js    (simulation logic — 1037 lines)
                          ├── GeminiService.js     (Google Gemini integration)
                          ├── FirebaseService.js   (Firebase Analytics + Performance + Remote Config)
                          ├── AnalyticsService.js  (Unified GA4 + Firebase analytics layer)
                          ├── StadiumMap.jsx        (SVG heatmap visualization)
                          ├── Scorecard.jsx          (live cricket scorecard)
                          ├── AiConcierge.jsx        (chat interface)
                          ├── GoogleMapsEmbed.jsx     (Google Maps integration)
                          ├── ErrorBoundary.jsx      (crash recovery)
                          ├── constants/index.js     (central configuration)
                          ├── utils/formatters.js    (utility functions)
                          └── hooks/useSimulationTimer.js (custom hooks)
```

---

## How the Solution Works

1. **The Heatmap UI**: Pure SVG + Math to visualize dynamic crowd density across 23 stands. Color-coded: 🟢 <60% | 🟡 60–85% | 🔴 >85%.
2. **The Gemini Concierge**: Chat with Lumina to get live, contextual routing. E.g., if you ask for food during an innings break, she reads the `StadiumEngine` stall queues and steers you to the quietest option.
3. **Event Triggers**: Simulation controls trigger Strategic Timeouts (2:30) and Innings Breaks (15 min) — instantly demonstrating Lumina's dynamic responsiveness.
4. **Ball-by-Ball Cricket Simulation**: Full IPL match simulation with DRS reviews, wickets, boundaries, run rates, and crowd excitement reactions.
5. **Next Match Mode**: After a match completes and the stadium empties, start a new match against a randomly selected opponent.

---

## Google Services Integration (Deep Multi-Service)

| # | Service | Usage | Integration Depth |
|---|---------|-------|-------------------|
| 1 | **Google Gemini 2.0 Flash** | AI Concierge — receives live stadium telemetry (crowd zones, stall queues, water station loads, match score) and generates contextual routing guidance | Deep — structured prompts with real-time data context |
| 2 | **`@google/generative-ai` SDK** | Official npm package for programmatic Gemini API integration | SDK-level integration |
| 3 | **Google Maps Embed API** | Interactive embedded map showing M.A. Chidambaram Stadium location with satellite view and directions | Embed with CSP-secured iframe |
| 4 | **Firebase Analytics** | Custom event tracking: match_started, match_completed, innings_break, strategic_timeout, drs_review, chat_message_sent, boundary_hit, wicket_fallen | 12+ custom events with structured parameters |
| 5 | **Firebase Performance Monitoring** | Real-time performance traces: gemini_response_time, engine_tick_duration, match_duration | Custom traces with attributes |
| 6 | **Firebase Remote Config** | Cloud-controlled feature flags: simulation_tick_speed, crowd_surge_multiplier, ai_temperature, enable_drs_system | Dynamic configuration with defaults |
| 7 | **Google Analytics 4 (gtag.js)** | Global analytics with page views, session tracking, and privacy-conscious defaults (anonymize_ip, SameSite cookies) | Full GA4 property configuration |
| 8 | **Google Fonts** | Inter + Outfit typography for premium UI | Design system integration |
| 9 | **Google Cloud Build** | CI/CD pipeline: install → lint → test → build → Docker → deploy to Cloud Run | Full `cloudbuild.yaml` configuration |
| 10 | **Google Cloud Run** | Containerized production deployment with auto-scaling, asia-south1 region | Docker + nginx serving |
| 11 | **Google App Engine** | Alternative deployment target with `app.yaml` configuration | Static file serving with security headers |
| 12 | **Google Container Registry** | Docker image storage for Cloud Run deployments | Image tagging with commit SHA |

### Gemini Prompt Engineering
The Gemini prompt includes rich, structured telemetry:
- Busiest/quietest stalls with sponsor names and crowd percentages
- Water station crowd counts
- Live match score and run rates
- Crowd zone breakdown (in-seats, at-amenities, roaming)
- Match status awareness (break vs in-play routing behavior)

### Firebase Analytics Events
```
match_started          → team1, team2, venue, attendance, toss
match_completed        → result, team1, team2
innings_break_triggered → innings, runs, wickets
strategic_timeout      → innings, over
drs_review_initiated   → team, review_type, batsman, bowler
chat_message_sent      → message_type (food/water/score/etc.)
chat_response_received → response_length, is_mock
boundary_hit           → boundary_type, batsman, bowler
wicket_fallen          → batsman, bowler, dismissal
page_view              → page_title, page_location
```

### Unified Analytics Architecture
```
User Action → AnalyticsService.track()
                 ├── GA4 (window.gtag)
                 └── Firebase Analytics (logEvent)
```

---

## Evaluation Criteria Addressed

### Code Quality
- **Modular architecture**: Engine, Service, Component, Constants, Hooks, Utils separation
- **JSDoc comments** on all public methods, classes, and modules with `@param`, `@returns`, `@example`, `@throws`
- **`@typedef`** definitions for complex data structures (InningsData, BatsmanData, FirebaseConfig)
- **React.memo** on expensive components to prevent unnecessary re-renders
- **useMemo/useCallback** for optimized rendering
- **PropTypes validation** on all React components
- **Constants extraction** — all magic numbers in `src/constants/index.js`
- **Custom hooks** — `useSimulationTimer` for clean state management
- **Utility functions** — `formatTime`, `formatNumber`, `calculatePercentage`, `clamp`
- Clean ESLint configuration

### Security
- **`.env` for API keys** — Git-ignored with comprehensive `.env.example` template
- **Input sanitization** — HTML stripping, special char removal, 500-char limit on all user inputs
- **Rate limiting** — 2-second cooldown between AI requests to prevent abuse
- **Content Security Policy** — CSP meta tag restricting scripts, styles, API connections, Firebase domains, and GA4
- **Security headers** — X-Content-Type-Options, Referrer-Policy, X-Frame-Options (in app.yaml)
- **ErrorBoundary** — Catches runtime crashes gracefully, prevents stack trace exposure
- **Mock fallback** — UI remains fully functional without API keys
- **Google App Engine security headers** — Strict transport security on all static assets

### Efficiency
- **Zero heavy assets** — No PNG/JPG/SVG files. All visuals are pure CSS glassmorphism + inline SVG math
- **`structuredClone`** for immutable state management
- **React.memo** prevents re-renders on StadiumMap, Scorecard, AiConcierge
- **`prefers-reduced-motion`** media query for users who need reduced animations
- **Lazy loading** — Firebase SDK loaded via dynamic import() to avoid bundle bloat
- **Google Maps iframe** uses `loading="lazy"` attribute
- Total repo size: **under 2 MB**

### Testing
- **90+ unit + component tests** via Vitest covering:
  - Stadium initialization (stands, stalls, water stations, attendance)
  - Bounds checking and clamping
  - Ball simulation and run rate calculation
  - Crowd surge dynamics (innings break, strategic timeout)
  - DRS review system
  - Match lifecycle (next match, innings switch)
  - State immutability
- **13 GeminiService tests** covering:
  - Input sanitization (XSS, HTML stripping, length limits)
  - Mock response routing (food, water, merch, crowd, score queries)
  - Rate limiting
  - Edge cases (empty input, non-string input)
- **14 Component render tests** (React Testing Library):
  - Scorecard rendering (scores, batsmen, bowler, ball indicators, commentary, DRS, match result)
  - ErrorBoundary crash recovery and fallback UI
  - GoogleMapsEmbed rendering and accessibility
- **30+ Firebase/Analytics tests**:
  - Firebase service initialization in demo mode
  - All analytics event types tracked without errors
  - Performance trace lifecycle (start/stop)
  - Remote Config value retrieval
  - AnalyticsService unified tracking
  - Graceful degradation for all services
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
- **PropTypes** for component contract enforcement

### Google Services
- **12 Google services** integrated across the application stack
- Deep integration with **Google Gemini 2.0 Flash** — telemetry-aware routing engine with structured prompts
- **Firebase Analytics** — 12+ custom events with structured parameters
- **Firebase Performance Monitoring** — custom traces for API response time and engine performance
- **Firebase Remote Config** — cloud-controlled feature flags and simulation parameters
- **Google Analytics 4 (gtag.js)** — global analytics with privacy-conscious configuration
- **Google Maps Embed API** — interactive stadium location map
- **Google Cloud Build** — full CI/CD pipeline (install → lint → test → build → deploy)
- **Google Cloud Run** — containerized production deployment
- **Google App Engine** — alternative static deployment option
- **Google Fonts** — Inter + Outfit for premium typography
- Fallback mock engine ensures UI works identically without any API keys

---

## Google Cloud Deployment Options

### Option 1: Google Cloud Run (Recommended)
```bash
# Build and deploy via Cloud Build
gcloud builds submit --config cloudbuild.yaml .
```

### Option 2: Google App Engine
```bash
npm run build
gcloud app deploy
```

### Option 3: Vercel (Current)
```bash
vercel --prod
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# Production build
npm run build
```

### Environment Variables
```bash
# Copy the template
cp .env.example .env

# Add your keys (all optional — mock mode works without them)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Impact & Real-World Value

Lumina demonstrates how AI-powered crowd management can transform the physical event experience:
- **Reduced queue wait times** by routing fans to quietest amenities
- **Improved safety** through real-time congestion monitoring across 23 stadium zones
- **Enhanced fan satisfaction** with personalized, contextual recommendations
- **Data-driven operations** via Firebase Analytics and GA4 for venue management insights
- **Scalable architecture** — deployable to any stadium with capacity configuration changes

---

## Single Branch Rule
All work committed directly and solely to `main`.
