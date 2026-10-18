# Nirav Patel — code, curiosity & connections

A personal portfolio built as one continuous 3D journey. A glass-and-particle N moves through a light introduction, personal story, dark toolkit, interactive particle experiment, and contact section. Native scrolling drives the camera; the page does not lock the wheel, snap between chapters, or require a loading screen.

## Run locally

Use Node.js 22 LTS (at least 22.13) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables, credentials, runtime font service, or external 3D assets are required. Fonts and dependencies are installed through npm.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Stop an existing production preview before starting another server on the same port. Restart a production server after rebuilding; it serves the last compiled output.

## Experience and architecture

- src/app/page.tsx: server-rendered personal content and five sections: home, about, skills, world, contact.
- src/app/globals.css: responsive layout, glass surfaces, light/dark atmosphere, typography, and motion fallbacks.
- src/components/showcase/journey.tsx: one lazy-loaded, persistent WebGL scene and scroll/pointer input.
- src/components/showcase/journey-scene.tsx: original extruded glass N, connected particles, morph targets, procedural studio environment, and interpolated camera.
- src/components/showcase/page-motion.tsx: scoped GSAP/ScrollTrigger introductions and reveals.
- src/components/showcase/experience-context.tsx: active chapter, global pause, live reduced-motion preference, and scene controls.
- src/components/showcase/toolkit.tsx: keyboard-accessible technology tabs with Motion transitions.
- src/components/showcase/lab-controls.tsx: Structure, Orbit, Scatter, and perspective controls.
- src/components/navigation.tsx: glass header and mobile navigation.
- src/content/portfolio.ts: identity, email, and confirmed technology details.
- src/content/experiences.ts: chapter names and navigation order.

The scene is generated from code. Reflections use Three.js RoomEnvironment, not downloaded HDR images. One capped-resolution canvas is reused throughout the page. Rendering stops when the tab is hidden or motion is paused. System reduced motion uses discrete scene updates; the content and controls remain usable. A static monogram replaces unavailable WebGL.

The earlier physics, separate sculpture, confetti, color-tile, and guide demos were removed along with their unused dependencies. The site shows no library badges or chatbot.

## Content

This belongs to Nirav Patel. Confirmed technologies: WordPress, PHP, Flutter, .NET, and Next.js. Nirav is currently employed; no employer, dates, seniority, clients, achievements, or public project case studies have been supplied. The experiment is labeled as portfolio work. Add real work only when Nirav supplies it.

Public email: niravpatel1422004@gmail.com. LinkedIn is intentionally omitted.

## Design references

Nirav supplied [Leo9 Studio](https://leo9studio.com/) for clean layouts and connected dots, [Igloo](https://www.igloo.inc/) for 3D, particles and camera movement, and [Squared Media](https://www.squared-media.nl/) for transitions and glass surfaces. The design interprets these qualities with original geometry, code, copy, and layout. No reference-site source, branding, or assets were copied.

## Validation

After building:

```sh
npx playwright install chromium
npm run test:e2e
```

On Windows with Microsoft Edge installed:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm run test:e2e
```

Tests own a production server on http://127.0.0.1:3100 so they do not stop a preview on port 3000. Coverage includes personal content, technology tabs, scene controls, mobile navigation, clipboard, reduced motion, WebGL fallback, and JavaScript-disabled content. Screenshots are ignored artifacts. GitHub Actions runs lint, types, a production build, and Chromium browser tests.

See docs/validation.md for executed results and outstanding development-only dependency advisories. Desktop headless testing is not a physical-device or frame-rate benchmark.

## GitHub and Vercel

Repository: https://github.com/Zone3011/codex-time

Existing production site: https://codex-time.vercel.app

This redesign remains local on feat/immersive-connected-portfolio until pushing is approved. A local commit does not update the hosted site.

Use feature branches for substantial work. Validate and prepare reviewable commits before requesting remote approval. Ask before authentication, pushing, opening remote PRs, merging to production, or deployment. Protect main with required pull requests, approvals, and the CI job Lint, types, build. Block direct and force pushes where supported.

Vercel's Git integration deploys production-branch changes automatically. Enforce release approval through GitHub protection; AGENTS.md alone cannot prevent deployment. Preview pushes also create hosted deployments and require approval.

For a new Vercel connection, import the approved repository with the Next.js framework preset, repository root, npm defaults, and Node.js 22. No custom vercel.json or environment variables are needed. Future secrets belong in ignored .env.local files and Vercel environment settings; never expose them through NEXT_PUBLIC_.
