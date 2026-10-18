# Nirav Patel — a little web wonder

A personal Next.js portfolio built as six colorful, interactive chapters. Saturated cyan, orange, blue, yellow, and pink replace the earlier pastel design. Each chapter uses a library for a specific visible experience, connected by a persistent header and an optional section guide.

## Run locally

Use Node.js 22 LTS (at least 22.13) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No accounts, environment variables, API keys, externally hosted models, or runtime font services are required. Variable fonts are served locally from npm packages.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

If a preview server is already running, stop it before switching between production and development builds. A running production server uses the last build; restart it after building new changes.

## The six chapters

| Chapter   | Library                      | Experience                                                                    |
| --------- | ---------------------------- | ----------------------------------------------------------------------------- |
| Hello     | GSAP                         | A typographic nine-tile color composition with a user-triggered remix         |
| Play      | Matter.js                    | Draggable, colliding shapes with shuffle and reverse-gravity buttons          |
| Toolkit   | Motion                       | Shared-layout selection and animated detail panels for Nirav's technologies   |
| Depth     | Three.js + React Three Fiber | A still, custom-shaded 3D knot with two finishes and a rotation slider        |
| Story     | Anime.js                     | A user-triggered SVG line drawing beside the supplied personal details        |
| Say hello | canvas-confetti              | Direct email, clipboard feedback, and a celebration triggered only by request |

Field notes use a small square control instead of the earlier blob character; this is not an AI chat service. It offers a section-specific explanation only when opened. Hide and restore controls are available; it never opens itself, plays audio, or collects visitor messages. Its hidden state lasts for the current page session.

## Motion, performance, and fallbacks

- The header includes a global motion pause. System reduced-motion preferences disable automatic movement, animated transitions, and confetti.
- Physics and the 3D scene load near their sections. Expensive render loops stop when the section is offscreen or the tab is hidden.
- The color composition has no idle loop. Physics starts after a drag or button action; 3D has no automatic movement; story drawing runs only on request. Animation contexts, event listeners, engine loops, and observers are cleaned up.
- 3D pixel density is capped at 1.5. A static CSS sculpture is available while loading and when WebGL cannot render.
- Physics dragging is contained to the frame; scroll outside it on touch devices. Shuffle and gravity controls provide alternatives to dragging.
- Technology tabs support Up/Down, Home, and End keys. Mobile navigation supports Escape. The page includes a skip link and visible focus.
- Main copy and the default toolkit detail are server-rendered. The experiments enhance the content with JavaScript.
- Hardware, browser, and power-saving settings affect 3D smoothness. Headless desktop checks do not establish frame-rate performance on every device.

## Structure and personalization

- src/app/page.tsx: the six server-rendered sections and personal story.
- src/app/globals.css: palettes, typography, layouts, and responsive rules.
- src/components/showcase: isolated interactive components and shared motion settings.
- src/components/navigation.tsx: header, current chapter, mobile menu, and pause control.
- src/content/portfolio.ts: name, initials, public email, and technology data.
- src/content/experiences.ts: chapter navigation and companion explanations.
- tests/portfolio.spec.ts: interaction, accessibility behavior, and responsive browser checks.
- AGENTS.md: project conventions, approval boundaries, and confirmed owner details.

This is Nirav Patel's portfolio. His confirmed toolkit is WordPress, PHP, Flutter, .NET, and Next.js. No public project case studies, employer details, dates, or achievements have been supplied. The six interactive chapters are portfolio experiments, not client projects. LinkedIn is intentionally omitted. Add personal details and real work only as Nirav supplies them.

## Browser checks

After a production build:

```sh
npx playwright install chromium
npm run test:e2e
```

The test suite owns a production server on http://127.0.0.1:3100 so it does not stop or reuse a personal preview on port 3000. On Windows with Edge installed, use PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm run test:e2e
```

Screenshots and test artifacts are ignored. GitHub Actions installs Chromium and runs lint, TypeScript, production build, and the browser suite. Review docs/validation.md for known development dependency advisories.

## GitHub, Vercel, and approval

Repository: https://github.com/Zone3011/codex-time

Existing live site: https://codex-time.vercel.app

Work on feat/color-playground-redesign remains local until pushing is approved. The existing site does not change through a local commit.

For future features, Codex reads AGENTS.md, uses a feature branch for substantial work, implements and validates locally, and prepares a reviewable commit and PR description. Obtain approval before authentication, pushing, opening remote PRs, merging to production, or deployment.

Protect main in GitHub: require pull requests, approval, and the CI job named Lint, types, build; prevent direct pushes and force pushes where the account plan permits. Vercel's Git integration deploys production-branch changes automatically. Enforce release approval through repository protections; AGENTS.md alone cannot prevent deployment.

For a new Vercel connection, import the approved repository with the Next.js framework preset, root directory, default npm settings, and Node.js 22. No vercel.json or environment variables are required. Preview branch pushes also create hosted deployments and require approval.

Future secrets belong in ignored .env.local files and Vercel environment settings; never use NEXT_PUBLIC_ for credentials.

Official references: [GSAP](https://gsap.com/docs/v3/), [Matter.js](https://brm.io/matter-js/docs/), [Motion](https://motion.dev/docs/react), [React Three Fiber](https://r3f.docs.pmnd.rs/), [Anime.js](https://animejs.com/documentation/), [canvas-confetti](https://github.com/catdad/canvas-confetti), [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github).
