# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within Lumina Chepauk, please report it responsibly.

### How to Report

1. **Email**: Send details to the project maintainer via GitHub Issues with the `[SECURITY]` prefix.
2. **Do NOT** file a public issue for security vulnerabilities.
3. Include as much detail as possible: reproduction steps, impact assessment, and suggested fix.

### Response Timeline

| Action | Timeline |
|--------|----------|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix deployed | Within 14 business days (for critical issues) |

## Security Measures Implemented

### API Key Management
- All API keys are loaded from environment variables (`VITE_*` prefix)
- `.env` files are git-ignored; `.env.example` provides a safe template
- Application functions in **demo mode** without any API keys configured

### Input Sanitization
- All user inputs to the AI Concierge are sanitized before processing:
  - HTML tags are stripped (`<script>`, `<img>`, etc.)
  - Special characters (`<`, `>`, `'`, `"`, `&`) are removed
  - Whitespace is normalized
  - Input is truncated to **500 characters** maximum
- Sanitization is implemented in `GeminiService.sanitizeInput()`

### Rate Limiting
- AI Concierge requests are rate-limited to **1 request per 2 seconds**
- Prevents abuse and excessive API consumption

### Content Security Policy (CSP)
Strict CSP headers are configured in `index.html`:
- `default-src 'self'` — Only load resources from same origin
- `script-src` — Restricted to self, GA4, and inline scripts
- `connect-src` — Whitelisted: Gemini API, Firebase services, Google Analytics
- `frame-src` — Only Google Maps embeds allowed

### Security Headers
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — Controls referrer data
- `X-Frame-Options: DENY` — Prevents clickjacking (via App Engine config)

### Error Handling
- `ErrorBoundary` component catches runtime errors gracefully
- Stack traces are **never exposed** to end users in production
- Error details are logged to console only in development mode

### Dependencies
- Dependencies are audited regularly with `npm audit`
- Current status: **0 vulnerabilities** (as of latest build)

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x.x   | ✅ Active |
| 1.x.x   | ❌ No longer supported |

## Third-Party Services

| Service | Data Sent | Purpose |
|---------|-----------|---------|
| Google Gemini API | Sanitized user queries + stadium telemetry | AI routing responses |
| Firebase Analytics | Anonymous event data | Usage analytics |
| Firebase Performance | Page load metrics | Performance monitoring |
| Google Analytics 4 | Anonymous usage data (IP anonymized) | Web analytics |
| Google Maps Embed | None (read-only embed) | Stadium location display |
