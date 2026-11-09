# Validation notes

The portfolio was reset to a header-only starting point at the owner's request. Previous scene and chapter validation no longer applies. See the fresh-header validation results below.

Use Node.js >=22.13. No environment variables are required. Browser tests use port 3100; leave port 3000 alone.

## Fresh header reset

- npm ci completed. Default npm reported Node 20 engine warnings; lint, typecheck, build, and browser validation ran with isolated Node 22 on PATH.
- npm run lint passed.
- npm run typecheck passed.
- npm run build passed; home page statically prerendered.
- npm run test:e2e passed: six tests in installed Microsoft Edge, covering completed-intro cleanup, pause/resume, reduced-motion/mobile overflow, disabled JavaScript, live motion preference changes, and screenshots.
- Reviewed desktop (1280x720) and mobile (390x844) end-state screenshots. No physical phone or cross-browser verification performed.
- npm reported eight moderate dependency advisories; no forced dependency upgrades applied.
- Feature branch push is authorized by the owner. Production merge/deployment is not part of this change.

## Distinctive opening header

- Replaced the small header-only layout with a full opening section, offset name typography, original SVG connected-dot N artwork, and a custom monogram.
- Preserved the randomized 2x swarm, direct email, live reduced motion, pause, and Escape cleanup.
- Lint, typecheck, and production build passed. Eight Edge browser tests passed, including keyboard focus/Escape and 320px phone overflow. Reviewed 1280px desktop and 390px mobile screenshots.
- No physical-device or additional-browser verification. No push or deployment performed for this revision.

## Supplied swarm engine integration

- Replaced the simplified Web Animations entrance with the owner's supplied swarm-intro.js. Configured swarm/classic, random origin and order, speed 2, six base cursors, and no demo control bar.
- Preserved the original cursor selections and actual character/word typing. Added Replay intro. Native scrolling stays enabled; source imports explicitly use UTF-8.
- Pause, Escape, live reduced motion, resize, hidden tab, and unmount skip the intro and restore the content. Motion/replay controls are excluded from DOM wrapping.
- Engine syntax, lint, typecheck, and build passed. Eight Edge tests passed against the actual engine; tests require running cursors, wrapped text, selection boxes, completion cleanup, replay, keyboard skip, live reduced motion, and no-JavaScript content. Reviewed a screenshot during text construction and desktop/mobile finished states.
- Only swarm mode is integrated and verified; the supplied engine's other modes are not exercised. No physical-device or cross-browser verification. No push/deployment performed.
