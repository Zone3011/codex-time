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
