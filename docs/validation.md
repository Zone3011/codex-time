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

## Contact and refresh fixes

- Kept the contact trigger out of swarm DOM wrapping so it stays visible and clickable throughout the intro. Added a native modal dialog with the public email, email-app link, clipboard copying/feedback, Escape dismissal, and focus return. Without JavaScript the trigger still uses mailto.
- Remember the previous origin/order in session storage and exclude both choices from the next refresh/replay. No new environment variables. With blocked storage, random choices remain available but repeats cannot be excluded across refreshes.
- Lint, typecheck, and production build passed. Ten Edge tests passed, including real clipboard copying, contact during a running swarm, keyboard dismissal/focus restoration, and three consecutive non-repeating refreshes.
- Desktop/mobile screenshots inspected; corrected default dialog positioning to center it. External email-app launch depends on the configured mail handler and cannot be verified by browser automation. No physical-device or other-browser verification.

## Swarm rhythm and palette

- Replaced cobalt/coral with graphite, deep green, and muted brass on white. Replaced the large orbit illustration with five cards for the confirmed toolkit: WordPress, PHP, Flutter, .NET, Next.js.
- Added opt-in engine choreography: navigation, name, toolkit, footer. Three cursors finish one group before beginning the next; random origin and random ordering within groups remain at speed 2. Headline character holds are longer so typing is visible. The toolkit supplies real boxes and labels for cursors to assemble rather than one large media reveal.
- Preserved pause, Escape, live reduced motion, hidden-tab/resize cleanup, direct email fallback, contact dialog, and non-repeating refresh choices.
- Engine syntax, lint, typecheck, and production build passed. Eleven Edge tests passed, including a phase-order behavior test that observes the name typing while all toolkit cards remain unrevealed, then verifies the toolkit starts after name completion.
- Reviewed desktop/mobile finished states and a toolkit-build screenshot; refined panel spacing to avoid overlapping the footer. No physical-device or other-browser verification. No remote push or deployment.

## Bright vector opening

- Removed the right-hand skills panel at the owner's request. Added an original illustration built from seven separate inline SVG pieces: folded N, code window, platform, background, spark, orange sphere, and pink pointer. No external asset download or image-generation dependency.
- Changed white/green/brass to white with vivid violet, pink and orange, retaining dark readable typography. Cursor colors coordinate with the illustration.
- Preserved the actual supplied swarm engine, random non-repeating origins/orders, 2x speed, phased construction, and contact accessibility.
- Engine syntax, lint, typecheck, and build passed. Eleven Edge behavior tests passed; the choreography test observes all seven illustration pieces hidden while the name types, then verifies illustration construction follows.
- Reviewed desktop (1280x720), mobile (390x844), and vector-build screenshots. No physical-device or cross-browser verification. No push or deployment performed.

## Faster playback and varied entrance/ending

- Increased portfolio playback from 2x to 3x and shortened the initial gathering pause. Retained readable headline typing and the staged vector assembly.
- Added orbit/fan/rally entrances and scatter/sweep/spiral endings. Endings move cursors out through viewport edges instead of always orbiting the pointer and fading in place. Spiral regroups at a random location first; sweep uses a shared random edge; scatter assigns different edges.
- Session storage excludes the last entrance and ending as well as the previous origin/order on every refresh and replay. Blocked storage still falls back to random choices. Exit diagnostics are removed during cleanup.
- Engine syntax, lint, typecheck, and production build passed. Fourteen Edge tests passed, including three explicit exit-branch runs and consecutive refreshes verifying different entrance/exit choices and speed 3. Full-run tests completed in approximately 6-7 seconds.
- Desktop/mobile snapshots and exit captures generated. No physical-device or additional-browser verification. No push or deployment performed.

## Whole-opening random build order

- Corrected the interpretation of random start: removed navigation/name/illustration/footer phase priority from the portfolio and removed its stage attributes. The supplied engine now applies each random directional/radial/shuffled ordering across the whole opening, respecting only parent-child reveal dependencies.
- Kept three cursors, readable headline typing, and the shorter gathering time independent of phase ordering. 3x playback and varied entrance/exit choices remain enabled.
- Engine syntax, lint, typecheck, and production build passed. Fourteen Edge tests passed. Replaced the old navigation-first phase test with a behavior test that observes a first selection in the lower page while navigation remains hidden, then observes a top-down run selecting the upper opening. The concurrent cursors can reach the upper intro before the navigation, which the test accounts for.
- Reviewed a screenshot of the bottom-first build and completed desktop/mobile snapshots. No physical-device or additional-browser verification. No push or deployment performed.

## Two-company experience memory book

- Added an original paper-and-tape book after the accepted header. Nirav supplied Sedani Digital / Intern Software Developer / black-white, and hfiles / Web Developer / yellow-blue. Each company has exactly one page. Logo marks and summaries are explicitly placeholders/drafts, as requested; no dates or achievements are invented.
- Desktop shows two facing pages with a cloth cover, central gutter, paper stack, translucent tape, pinned company cards, summary scraps and memory stamps. Mobile offers company tabs and previous/next page controls with an interruptible transform/opacity page fold.
- Content is centralized in src/content/experience-book.ts. Optional local logoSrc and real summary fields replace their corresponding placeholders automatically. No environment variables or dependencies added.
- Added a shared motion store so the existing header Pause motion control also governs book page turns. Live reduced motion, hidden tabs, desktop layout changes, and unmount clean up pending page-turn effects. Server-rendered pages remain readable without JavaScript.
- The attached ThreeUI export was treated as a reference rather than an instruction to replace the portfolio with a Singapore sketchbook. Both referenced source URLs failed through browser and direct retrieval; no ThreeUI code/assets were imported or claimed to be reproduced exactly.
- Lint, typecheck and build passed. Eighteen Edge browser tests passed, including two-company desktop layout, mobile keyboard navigation/boundaries/rapid interruption, shared pause, live reduced motion, and no-JavaScript reading at 320px. Fixed a race in the existing 3x swarm regression test by capturing the first live selection inside a MutationObserver rather than between protocol calls.
- Reviewed full desktop book and both mobile pages. No physical phone or other-browser verification performed. Header visual design preserved. Work is local on feat/company-memory-book; no push, merge or deployment.
