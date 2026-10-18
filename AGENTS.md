# Project instructions

## Architecture

- Next.js App Router, strict TypeScript, npm, Tailwind CSS v4.
- Routes and server-rendered content live in src/app. Reusable browser interactions live in src/components/showcase; identity and toolkit data live in src/content.
- Follow existing conventions. Prefer Server Components and small Client Components.
- The page has five chapter IDs: home, about, skills, world, contact. Keep src/content/experiences.ts, navigation, and scene keyframes synchronized.
- Use the one shared Journey canvas. Avoid introducing separate continuous renderers for each section.
- Preserve unrelated files, including the ignored Microsoft directory.

## Owner and content

- This is Nirav Patel's personal portfolio. Public email: niravpatel1422004@gmail.com.
- Confirmed toolkit: WordPress, PHP, Flutter, .NET, Next.js.
- Nirav is currently employed. No employer, dates, seniority, clients, achievements, or public project case studies have been supplied. Never invent them.
- The particle scene is a portfolio experiment, not client work.
- Do not add LinkedIn links or prompts. Nirav prefers email.
- Incorporate new personal and professional details as Nirav supplies them; do not infer interests, goals, experience, or achievements.

## Current design direction

- Nirav asked to supersede earlier ideas and redesign the complete site using his references:
  - https://leo9studio.com/ — clean layout and connected dots.
  - https://www.igloo.inc/ — 3D, camera movement, particles.
  - https://www.squared-media.nl/ — smooth transitions and glass surfaces.
- The current design is one atmospheric journey with an original glass-and-particle N, continuous scroll-driven camera, light/dark environments, and glass controls.
- Keep transitions coherent across the full page. Do not restore unrelated pastel/bright section themes, rotating flowers, library badges, confetti, or a cute guide unless requested.
- Create original visuals and code; do not copy reference assets, branding, text, or source.

## Accessibility and performance

- Preserve semantic sections, skip link, keyboard tabs, visible focus, direct email, responsive layouts, and usable fallbacks.
- Use the shared motion setting. Honor live prefers-reduced-motion, global pause, and hidden-tab rendering pause.
- Prefer native scroll and transform/opacity animation. No wheel hijacking, mandatory loading screens, or scroll locking.
- Scope and clean up GSAP contexts and ScrollTriggers. Dispose GPU resources, observers, and listeners.
- Cap pixel density and avoid unnecessary postprocessing or extra render loops.
- Content must remain readable with unavailable WebGL and disabled JavaScript.

## Validation

- Use npm ci for clean installation.
- Run npm run lint, npm run typecheck, and npm run build before proposing deployment; fix failures and report executed results.
- Run npm run test:e2e after interaction changes. Tests own port 3100; never stop a user's existing preview on port 3000.
- Inspect desktop and mobile visuals when available. Report browser or hardware verification limits.
- Add meaningful behavior tests; avoid tests that only repeat markup.
- Document any environment variables in .env.example and README.md.

## Git and release

- Use feature branches for substantial changes and prepare focused commits with validation evidence.
- Never expose or commit credentials, tokens, or environment files.
- Ask before authentication, remote creation, pushing, remote PR creation, or deployment.
- Never force-push or merge to production without explicit approval.
- CI must pass before production approval. Once connected, Vercel deploys approved merges to protected main.

- Wheel gestures may gently advance at chapter edges using passive listeners and native smooth scrolling, as requested by Nirav. Keep tall chapters readable, preserve touch/keyboard scrolling, and disable assistance when motion is paused or reduced.
