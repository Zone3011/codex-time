# Validation notes

Use Node.js 22 LTS (at least 22.13). This machine's Node 20.13 is older than some development dependencies support. Validation uses an isolated npm-provided Node 22 runtime.

## Outstanding development dependency advisories

At setup npm audit reports five high-severity entries in the development-only chain eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces. The underlying advisory is GHSA-vfj7-8cjw-p6xm: stack exhaustion from deeply nested patterns. The registry's latest braces version is 3.0.3, which remains affected. The suggested forced fix downgrades the Next.js lint configuration to an incompatible older major and is not applied.

Lint trusted source paths. Recheck npm audit during dependency updates and update the chain once compatible fixes exist. ESLint 9 is retained because bundled plugins do not declare ESLint 10 support; npm marks ESLint 9 deprecated. Review this outstanding development-tool debt before treating the foundation as fully production hardened.

## Setup verification

- Clean dependency installation completed with npm ci.
- ESLint and TypeScript validation passed.
- Next.js production build passed with static prerendering.
- Four Playwright tests passed in installed Microsoft Edge, covering project disclosures, contact destination, keyboard menu behavior, reduced motion, and overflow at 320, 390, 768, and 1440 pixels.
- Production-only npm audit found zero vulnerabilities; full audit retains the five development-only findings above.
- Desktop and mobile screenshots were reviewed locally. Remote GitHub CI and Vercel deployment remain unverified until connected with approval.
