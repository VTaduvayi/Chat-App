# Doodle Chat

A real-time chat interface built with React and TypeScript for the Doodle frontend engineering challenge.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** — fast dev server, instant HMR, zero-config TypeScript
- **CSS Modules** — scoped styles, zero runtime cost
- **Native Fetch API** — typed wrapper with Bearer auth
- **Vitest** — unit testing for the API layer

### Why these choices?

- **Vite over Next.js** — single authenticated view with no SEO or SSR requirements. Faster dev loop with less abstraction for this scope.
- **CSS Modules over Tailwind/CSS-in-JS** — native to Vite, no runtime cost, scoped per component, standard CSS syntax.
- **useState over React Query/Redux** — single data source, one feature. No premature abstraction.
- **Native fetch over Axios** — zero dependencies, typed wrapper provides the same DX.

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for the backend API)

### 1. Start the backend API

```bash
git clone https://github.com/DoodleScheduling/frontend-challenge-chat-api.git
cd frontend-challenge-chat-api
docker compose up
```

The API will be available at `http://localhost:3000`.

### 2. Start the frontend

```bash
git clone https://github.com/VTaduvayi/Chat-App.git
cd Chat-App
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Copy `.env.example` to `.env`:

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api/v1` |
| `VITE_API_TOKEN` | Bearer auth token | `super-secret-doodle-token` |

## Features

- Send and receive chat messages in real time
- Messages poll every 3 seconds, pausing when the tab is hidden
- Self/other message distinction with different bubble styles
- Author name persisted across sessions via localStorage
- Responsive layout optimized for mobile, tablet, and desktop
- Keyboard accessible — Tab navigation, Enter to send, focus management after send
- Screen reader support — aria-live region announces new messages automatically
- Graceful error handling — retry button on load failure, inline send errors, 3s request timeout
- Smooth message slide-in animations with prefers-reduced-motion support

## Project Structure

```
src/
  features/chat/          — Chat-specific components
    components/
      MessageBubble.tsx   — Memoized message display component
      MessageInput.tsx    — Message composition form with local error state
  lib/
    api.ts                — Typed fetch wrapper with Bearer auth and timeout
    api.test.ts           — API unit tests (Vitest)
  styles/
    tokens.css            — Design tokens as CSS custom properties
    reset.css             — Browser normalization, focus-visible, reduced-motion
    global.css            — Body background, font setup
  utils/
    decodeHtml.ts         — HTML entity decoder for API responses
  types.ts                — Shared TypeScript interfaces
  App.tsx                 — Root component, message state, polling logic
  main.tsx                — React entry point
```

## Performance

- **React.memo** on MessageBubble prevents unnecessary re-renders during polling
- **Smart polling** pauses when the browser tab is hidden, resumes and fetches immediately on return
- **AbortController** with 3-second timeout on all API requests prevents hung connections
- **CSS Modules** compiled at build time — zero runtime styling cost
- **CSS custom properties** for responsive tokens — no JavaScript needed for layout changes
- **System font stack** — no web font downloads

## Accessibility

- Semantic HTML throughout: `<main>`, `<article>`, `<time>`, `<ul>`, `<form>`
- `aria-live="polite"` on message list — screen readers announce new messages
- `aria-label` on interactive regions
- Visible focus indicators via `:focus-visible`
- Hidden labels (sr-only) for all form inputs
- `prefers-reduced-motion` disables animations for users who prefer it
- Keyboard-only navigation: Tab through inputs, Enter to send

## Scaling to 10,000+ Messages

The current implementation fetches all messages on load and replaces the full list every poll cycle. This is correct for the seed data size. For production scale, I would make these changes:

**Incremental polling** — The API already supports `after` and `before` date parameters. Instead of fetching all messages, poll only for messages created after the latest one we have. This reduces payload from O(n) to O(new messages).

**Virtualized rendering** — With thousands of DOM nodes, scrolling becomes sluggish. A library like `react-window` renders only the messages visible in the viewport (~15-20 at a time), keeping DOM size constant regardless of total message count.

**Pagination on initial load** — Load the most recent 50 messages first, then fetch older messages on scroll-up using the `before` parameter. This gives instant initial load time.

**WebSocket connection** — Replace polling with a persistent WebSocket connection for true real-time delivery. Eliminates the 3-second delay and removes unnecessary network requests when no new messages exist.

**Message caching** — Store messages in IndexedDB so returning users see their conversation immediately while fresh data loads in the background.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting without writing |
