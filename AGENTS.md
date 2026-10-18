# Project instructions

## Architecture

- Next.js App Router, TypeScript strict mode, npm, Tailwind CSS v4.
- Routes and metadata live in src/app; reusable UI in src/components; editable portfolio data in src/content.
- Prefer Server Components. Isolate browser state and GSAP in small Client Components.
- Follow existing naming and coding conventions. Keep dependencies and abstractions proportional to the task.
- Preserve unrelated files, including the ignored Microsoft directory.

## Experience

- Build reusable semantic, accessible components. Preserve skip links, keyboard navigation, visible focus, and responsive layouts.
- Respect prefers-reduced-motion. Scope GSAP animations, clean them up, and prefer opacity and transforms. Keep initial content available without JavaScript.
- Do not invent experience, clients, achievements, metrics, or completed projects. Keep illustrative content clearly labeled.
- Update portfolio data, metadata, wordmark, and contact information together when personalizing.

## Validation

- Use npm ci for a clean install.
- Before proposing deployment, run npm run lint, npm run typecheck, and npm run build. Fix failures and report actual results.
- For interaction or layout changes, inspect mobile and desktop in a browser when available. Report if browser validation was unavailable.
- Add meaningful tests for new behavior as needed; do not add tests that merely duplicate markup.
- Document environment variables in .env.example and README.md.

## Git and deployment

- Use feature branches for substantial changes; prepare focused commits and pull requests with validation evidence.
- Never expose credentials or commit environment files, tokens, or deployment credentials.
- Ask before authentication, creating a remote repository, pushing code, or deploying.
- Never force-push or merge to production without explicit approval.
- CI passing is required before production approval. Vercel deploys the approved merge to main once connected.

## Owner and content

- This is Nirav Patel's personal portfolio. Public email: niravpatel1422004@gmail.com.
- Confirmed technologies: WordPress, PHP, Flutter, .NET, and Next.js. Nirav is currently employed; no employer, dates, seniority, or detailed job responsibilities have been supplied.
- No public projects are currently provided. Never restore fictional projects as portfolio work.
- Do not add LinkedIn links or prompts; Nirav prefers email.
- As Nirav shares new professional details and projects in future conversations, incorporate the supplied facts into the portfolio when relevant. Do not infer interests, goals, achievements, or experience.

## Interactive showcase

- Six chapter IDs are home, play, skills, world, about, and contact. Keep navigation and src/content/experiences.ts synchronized with sections.
- The companion is a local explanatory guide, not an AI chatbot. Keep it quiet, dismissible, and accessible on phones; never auto-open its panel.
- Use the shared experience-context motion setting in every new effect. Pause costly loops when offscreen or the tab is hidden.
- Keep shader/physics code isolated, lazy-load heavy experiments, cap pixel density, and preserve static fallbacks.
- Physics, shader, and animation demos are experiments, not claimed client projects.
- Use src/content/portfolio.ts for identity and toolkit data.
- Playwright owns port 3100; do not stop a user's existing server on port 3000.

## Visual direction

- Nirav rejected muted pastels, repeating serif-led section layouts, rotating flowers, and decorative idle animation. Prefer vivid colors and varied compositions.
- Current motion is interaction-led: color remix, physics after a drag/button action, sculpture rotation, and requested line drawing. Do not restore automatic spinning or shader movement without a new request.

## Latest reference-led opening

- Nirav supplied https://leo9studio.com/ for clean connected dots, https://www.igloo.inc/ for 3D/camera/particles, and https://www.squared-media.nl/ for smooth transitions and glass surfaces.
- The current scope is one opening prototype and its header, pending visual review. Keep the other chapters until the opening direction is accepted.
- Scroll/pointer-driven 3D camera motion is authorized for this opening, superseding the earlier static-only direction there. Preserve pause, reduced motion, and WebGL fallbacks.
- Create original geometry and effects; do not copy reference assets, text, branding, or code.
