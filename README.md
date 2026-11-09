# Nirav Patel

Fresh portfolio starting point: a white opening header with offset name typography, a connected-dot N illustration, cobalt and coral accents, and a randomized swarm entrance at 2x speed. The rest of the page is intentionally empty, ready for the next requested section. This supersedes the previous five-chapter 3D journey.

Uses Next.js App Router, strict TypeScript, Tailwind CSS v4, and local fonts. The supplied standalone public/swarm-intro.js engine scans the visible header, draws selection boxes with multiple cursors, and types the real text. The React wrapper runs swarm mode with random origin/order, six base cursors, speed 2, and demo controls disabled. Replay intro starts another randomized run. Session storage remembers the last origin and order so consecutive refreshes and replays select different choices; blocked storage falls back to ordinary random choices. The contact link opens a keyboard-accessible dialog with the public email, copy confirmation, and an email-app link. Without JavaScript the original mailto link remains usable. Native scrolling stays enabled. Pause, Escape, resize, hiding the tab, or live reduced motion stops the intro and restores content. Server-rendered content stays readable with JavaScript disabled or a failed engine load. No environment variables required.

## Development

Use Node.js >=22.13.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Playwright owns port 3100. Leave any existing preview on port 3000 running. The Microsoft directory and Git history are preserved. Push feature branches for preview; production merges require approval and passing CI.
