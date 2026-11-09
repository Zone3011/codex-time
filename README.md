# Nirav Patel

Fresh portfolio starting point: a white opening header with offset name typography, a connected-dot N illustration, cobalt and coral accents, and a randomized swarm entrance at 2x speed. The rest of the page is intentionally empty, ready for the next requested section. This supersedes the previous five-chapter 3D journey.

Uses Next.js App Router, strict TypeScript, Tailwind CSS v4, and local fonts. The small client header uses the native Web Animations API with no animation dependency. Each piece gets a random cursor entry point and reveal delay; durations are divided by two. No scroll locking or loading screen. Content is rendered on the server and stays readable without JavaScript. Escape, Pause motion, and live reduced-motion changes clear the intro. Hidden tabs pause animation. No environment variables required.

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

