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
