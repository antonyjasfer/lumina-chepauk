# Contributing to Lumina Chepauk

Thank you for your interest in contributing to Lumina! 🏟️

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/antonyjasfer/lumina-chepauk.git
cd lumina-chepauk

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

## Development Workflow

### Branch Strategy
All development occurs on the `main` branch (single branch rule per hackathon requirements).

### Code Standards

#### JavaScript/JSX
- **JSDoc**: All public functions, methods, and components must have JSDoc comments with `@param`, `@returns`, and `@example` tags.
- **Constants**: No magic numbers — use `src/constants/index.js` for all configuration values.
- **PropTypes**: All React components must have PropTypes validation.
- **React.memo**: Performance-sensitive components should be wrapped in `React.memo`.

#### CSS
- Use CSS custom properties (variables) defined in `src/index.css`.
- Follow the glassmorphism design system with the Chepauk color palette.
- All animations must respect `prefers-reduced-motion`.

#### Testing
- Write tests for all new utilities, services, and components.
- Use Vitest + React Testing Library.
- Run tests: `npm run test`
- Run linter: `npx eslint .`

### Before Submitting

1. ✅ All tests pass: `npm run test`
2. ✅ No lint errors: `npx eslint .`
3. ✅ Production build succeeds: `npm run build`
4. ✅ No `console.log` statements in production code (use `console.info`/`console.warn` for services)

## Architecture Overview

```
src/
├── components/          # React UI components
│   ├── AiConcierge.jsx  # Chat interface (Google Gemini)
│   ├── Scorecard.jsx    # Live cricket scorecard
│   ├── StadiumMap.jsx   # SVG heatmap visualization
│   ├── GoogleMapsEmbed.jsx  # Google Maps integration
│   └── ErrorBoundary.jsx    # Error recovery
├── constants/           # Named constants and config
│   └── index.js
├── engine/              # Simulation logic
│   └── StadiumEngine.js # 1000+ line simulation engine
├── hooks/               # Custom React hooks
│   └── useSimulationTimer.js
├── services/            # External service integrations
│   ├── GeminiService.js     # Google Gemini AI
│   ├── FirebaseService.js   # Firebase Analytics/Performance/Config
│   └── AnalyticsService.js  # Unified GA4 + Firebase analytics
├── utils/               # Utility functions
│   └── formatters.js
├── App.jsx              # Root orchestrator
└── index.css            # Design system
```

## Google Services

When adding new Google service integrations:
1. Add environment variables to `.env.example`
2. Update CSP in `index.html` with required domains
3. Add service documentation to `README.md`
4. Write tests that verify graceful fallback in demo mode

## Reporting Issues

- Use GitHub Issues for bug reports
- For security vulnerabilities, see [SECURITY.md](./SECURITY.md)
