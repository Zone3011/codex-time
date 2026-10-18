# Validation notes

Use Node.js 22 LTS (at least 22.13). This machine's Node 20.13 is older than some development dependencies support. Validation uses an isolated npm-provided Node 22 runtime.

## Outstanding development dependency advisories

At setup npm audit reports five high-severity entries in the development-only chain eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces. The underlying advisory is GHSA-vfj7-8cjw-p6xm: stack exhaustion from deeply nested patterns. The registry's latest braces version is 3.0.3, which remains affected. The suggested forced fix downgrades the Next.js lint configuration to an incompatible older major and is not applied.

Lint trusted source paths. Recheck npm audit during dependency updates and update the chain once compatible fixes exist. ESLint 9 is retained because bundled plugins do not declare ESLint 10 support; npm marks ESLint 9 deprecated. Review this outstanding development-tool debt before treating the foundation as fully production hardened.

## Setup verification

- Clean dependency installation completed with npm ci.
- ESLint and TypeScript validation passed.
- Next.js production build passed with static prerendering.
- Four Playwright tests passed in installed Microsoft Edge, covering contact destination, keyboard menu behavior, reduced motion, and overflow at 320, 390, 768, and 1440 pixels.
- Production-only npm audit found zero vulnerabilities; full audit retains the five development-only findings above.
- Desktop and mobile screenshots were reviewed locally. This records local checks; remote CI and production deployment must be reviewed separately for each release.

## Interactive showcase verification

- Dependencies for all six experiments installed successfully. Production-only npm audit still reports zero vulnerabilities; the five development-only advisory entries above remain.
- ESLint, TypeScript route generation/checking, and the production build passed after the six-chapter implementation.
- Seven Playwright tests passed against the production server in headless Microsoft Edge: six-section content and email; physics controls and keyboard toolkit tabs; guide context/hide/restore; global pause and live reduced-motion changes; 3D/fallback controls; mobile menu/Escape and responsive overflow; clipboard and opt-in celebration.
- Reviewed desktop entrance, physics, toolkit, shader scene, and mobile screenshots. Refined sculpture framing/shading and reduced the companion to a small mobile control.
- Browser tests own port 3100. A pre-existing preview on port 3000 was left running.
- No physical phone or broad GPU/browser performance benchmark was run. WebGL fallback and interaction checks do not guarantee a particular frame rate on all hardware.
- Changes remain on a local feature branch. No push, merge, or deployment was performed.

## Color and interaction revision

- Replaced the pastel/serif direction with saturated cyan, orange, blue, yellow, and pink; oversized personal typography; a remixable tile composition; and different section proportions.
- Removed the rotating flower, automatic sculpture motion, scroll-driven story drawing, and blob-face guide. Field notes remain available through a compact square control.
- Physics starts only after dragging or using a control. The SVG story draws only when requested. Color remix is a brief, user-triggered GSAP transition.
- ESLint, TypeScript, production build, and all seven browser tests passed. The opening test also checks the color-remix action.
- Desktop and mobile screenshots reviewed; reduced-motion, keyboard controls, and overflow checks remain covered.
- This revision remains local on feat/color-playground-redesign.

## Reference-led opening prototype

- Inspected Leo9 Studio, Igloo Inc., and Squared Media in headless Edge; waited past Squared's loader and captured a scrolled view. References informed the design; no reference assets or code were copied.
- Scoped this iteration to the opening and navigation. Other chapters retain their prior design for now.
- Created an original 3D N from 1,140 connected nodes, with scroll/pointer camera movement and an unfold/reassemble control. Added a translucent glass header and a sticky opening transition.
- Lint, TypeScript, and production build passed. All seven browser tests passed, including the new scroll-driven opacity check. A focused follow-up verified floating navigation remains in the viewport during the camera journey.
- Reviewed desktop, scrolled opening, and mobile screenshots. The renderer pauses offscreen/hidden and reduced motion uses a static scene with an unpinned layout.
- No hardware phone performance benchmark, remote push, merge, or deployment was performed.

## Complete immersive redesign

- Rebuilt the full page as a coherent five-chapter experience: introduction, about, toolkit, interactive world, and contact. Removed the previous unrelated demo sections and guide.
- One persistent Three.js/React Three Fiber scene connects the page. Original glass N geometry morphs into structured sphere/orbit formations with a procedurally generated studio environment, connected nodes, dust particles, and a scroll/pointer-driven camera.
- Added a floating glass header, light/dark atmosphere, scoped GSAP/ScrollTrigger reveals, Motion technology tabs, and Structure/Orbit/Scatter plus perspective controls.
- Removed unused Matter.js, Anime.js, canvas-confetti, and associated type dependencies.
- ESLint, TypeScript validation, production build, and all nine browser tests passed in Microsoft Edge. A focused mobile follow-up passed after making visual captures wait for reveal completion.
- Browser coverage includes a confirmed rendered WebGL frame, console/page error checks, tabs/arrow keys, formation controls, camera perspective input, floating/current navigation, mobile Escape/menu behavior, widths 320/390/768/1440, live reduced motion, clipboard feedback, forced WebGL failure, and JavaScript-disabled content.
- Desktop and mobile captures were inspected. Refined formation pacing, geometry, glass refraction background, lab framing, and capture readiness.
- Production-only npm audit reports zero vulnerabilities. The five existing development-only lint-chain advisories documented above remain.
- No physical mobile device or broad GPU/frame-rate benchmark was run. The local preview on port 3000 was left running; test servers owned port 3100 and were stopped by Playwright.
- No authentication, remote push, pull request, merge, or deployment was performed. Work is local on feat/immersive-connected-portfolio.
