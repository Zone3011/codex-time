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

## Company photo pages and five-second auto-turn

- Expanded to four pages: each company has an experience page and a facing Pinterest-style gallery with three taped photo placeholders. No workplace photos are invented. Per-photo src/alt/caption fields support later owner-provided images.
- Preserved the paper, tape and company color treatment. Desktop reads company spreads; mobile reads four individual pages. Company tabs and previous/next controls work in both layouts.
- Rebuilt the turn with a front face, destination back face, stationary facing-page layer, perspective and opacity lighting. Temporary overlays are inert, have no duplicate IDs, and clean up after completion, rapid interruption, layout changes, hidden tabs or reduced motion.
- Automatic turns loop every 5 seconds while the book is at least 15% visible, the tab is visible, and motion is enabled. Hover/focus pauses reading; leaving restarts a full countdown. An explicit pause/resume control sits above the book. Global Pause motion and live reduced motion disable autoplay and movement.
- Fixed skip-link offscreen clipping so long-page screenshots do not reveal its unfocused state; keyboard focus still reveals the link.
- Lint, typecheck and build passed. Twenty-one Edge tests passed, including exact 4,999/5,000ms boundaries and looping with a frozen clock, pause/resume, reading-aware countdown reset, offscreen/reduced-motion behavior, all four mobile pages, rapid turn cleanup, and no-JavaScript access to four pages/six slots.
- Reviewed both company spreads, mobile gallery, and a frozen mid-turn screenshot showing the destination on the back face. No physical-device or other-browser verification. No dependencies or environment variables added; no remote push/deployment.

## Three-project collection with web intro

- Added exactly three owner-supplied projects after the book: 20 Ways to See the Same Thing (WordPress, 20 themes), Creaup (web scraper collecting data from other websites), and Sterling (WordPress website). Mentioned other commercial WordPress work below the cards. No invented results, dates, clients, URLs or scraper technology.
- Original illustrative vector covers match the accepted white/violet/pink/orange palette. Covers are labeled illustrative rather than presented as actual screenshots. Data and optional screenshot/link fields live in src/content/projects.ts.
- Reused the supplied engine's actual web mode: threads pull whole cards into place as readers encounter them. Only card roots are scanned; nested text/media stays intact. Desktop reveals visible cards together; mobile reveals newly encountered cards. Each card plays once.
- Added activeRoot ownership and ready/end events to the shared engine. Projects wait for the header intro, use the same single engine/canvas, and cancel their own run on continued scroll, resize, focus, reduced motion or hidden tabs. Native scrolling remains available. Engine types are centralized in src/types/swarm.d.ts.
- Engine syntax, lint, typecheck and build passed. Twenty-six Edge browser tests passed, including actual project web-mode canvas/cleanup, one-time reveal, native scroll cancellation, live reduced-motion restoration, mobile card encounters and 320px no-JavaScript content. Existing header and book behavior remained passing.
- Reviewed desktop/mobile project snapshots and an in-flight thread-pull screenshot. No physical-device or additional-browser verification. No dependencies/environment variables added. Local feature branch feat/project-web-reveal; no push/deployment.

## On-arrival web trigger and compact book

- Tightened the project encounter trigger from 25% to 75% visibility, with the card center in the reading area and a fresh geometry check at run time. Pending events cannot launch the reveal while the reader is still above the section. Increased scroll-settling debounce to 180ms and ignore queued observer entries for already-revealed cards.
- Reduced the book reader from a 1100px cap to 900px, pages from a 740px to 620px minimum, and tightened card, type, gallery and desk spacing. Paper, tape, company colors, four pages and automatic/manual turns are preserved.
- Lint, typecheck and production build passed. Twenty-seven Edge tests passed; the new regression holds the cards at only 35% visibility and verifies no intro, then scrolls them into the reading area and verifies the real web-mode reveal runs and restores cleanly.
- Reviewed compact desktop and mobile book screenshots. No physical-device or other-browser verification. No environment variables or dependency changes. The owner requested pushing the current project updates to the existing GitHub remote.

## Keychain skills section

- Added WordPress, PHP, Flutter, .NET and Next.js cards after the project collection, with original CSS split rings, links and acrylic tags. No proficiency claims or unprovided experience added.
- One-time individual scroll arrivals use transform/opacity and stagger simultaneous entries. Motion honors the shared pause store and live reduced motion; hidden tabs and unmount cancel running animations. Static server content remains readable without JavaScript.
- Lint, typecheck and production build passed; all 29 Edge browser tests passed, including new scroll arrival, one-time replay prevention, live reduced-motion cleanup and 320px no-JavaScript coverage.
- Reviewed desktop and 320px mobile section screenshots. No physical-device or additional-browser verification. No dependencies or environment variables added.

## SEO toolkit addition

- Added owner-confirmed SEO as the sixth keychain card and updated the toolkit paragraph. The mobile final-card centering rule now applies only to odd card counts, preserving a two-column six-card layout.
- Lint, typecheck and build passed. Both targeted Edge skills tests passed, including scroll motion cleanup and all six skills without JavaScript at 320px.

## Six-card spacing and centered project arrival

- Removed five-card horizontal offsets that crowded the SEO card against Next.js. The six keychains now preserve equal column gaps; SEO uses mint for a distinct tag. Reviewed desktop and 320px mobile screenshots.
- Project web intro requires at least 75% visibility and the card center within 8% of viewport height of the viewport center, checked again after scroll settles. Added a regression verifying a below-center card remains idle before centering starts the real animation.
- Lint, typecheck, production build and all 29 Edge browser tests passed. No physical-device or additional-browser verification.

## Closing parallax and footer

- Added a compact lavender hello panel with an original violet note, pink spark and orange dot, followed by direct email and native back-to-top links. Added the home anchor to the existing header.
- Decorative parallax is scroll-driven and schedules frames only on updates while visible, honoring shared pause, live reduced motion and hidden tabs; observers/listeners/frames are cleaned up. Static contact content remains server-rendered.
- Lint, typecheck, build and all 31 Edge browser tests passed. New tests verify scroll-driven movement, live reduced-motion reset, back-to-top behavior and 320px no-JavaScript email/layout. Reviewed desktop/mobile screenshots; no physical-device or other-browser verification. No dependencies or environment variables added.

## Stronger layered closing parallax

- Increased the scroll depth from 48 to 220 pixels per normalized viewport travel. The foreground note tilts with scroll while the orbit, spark and dot move at opposing depths; a large background hello adds a slow secondary layer. Reversing native scroll reverses all layers.
- Extended the behavior test to verify more than 40px of relative movement between the foreground note and orbit over 200px of scroll. Reduced-motion cleanup, no-JavaScript mobile fallback and navigation remain passing.
- Lint, typecheck, build and all 31 Edge tests passed. Reviewed an active-scroll frame and static desktop composition; no physical-device or other-browser verification.

## Wait for the reader before middle-section animations

- Projects now settle for 300ms at the screen center and run at 1.5x instead of 3x. Interrupted runs no longer mark cards complete, so returning to their level can show the intro again. Completed runs still play once.
- Skills wait for their centers to enter the middle reading band and for 300ms of settled scroll. Swings last 1.1 seconds with 180ms stagger; leaving the band cancels unfinished swings and permits a retry. Geometry uses stable layout positions so the swing itself cannot retrigger visibility changes.
- Lint, typecheck, production build and all 31 Edge tests passed. Extended regressions cover below-level skill inactivity, retry after interruption, completion without replay, and project retry after scroll cancellation. No physical-device or other-browser verification.

## Four theme transition previews

- Added a floating, keyboard-accessible Theme effects comparison control with Ink, Glitch, Ripple and diagonal Sweep. Each Preview dark/light action switches the actual page theme with native snapshot clip-path animation; buttons prevent overlapping transitions. Light mode remains the refresh default while the owner selects a variant.
- Added dark surfaces/type treatment while retaining paper, company colors and acrylic card materials. Native View Transition fallback switches immediately when unsupported, globally paused or reduced-motion; active transitions clean up on motion changes, hidden tabs and unmount. No new dependencies or environment variables.
- Lint, typecheck and production build passed. The full 36-test Edge suite passed; after refining the diagonal sweep and smoothing the ink edge, the production build and all five targeted theme tests passed again. Coverage checks actual snapshot animations in both directions for every style, cleanup, reduced-motion/no-API fallback, and 320px width.
- Reviewed dark desktop, mobile, header and active transition screenshots. No physical-device or additional-browser verification. These are original CSS/WAAPI transition variants, not copied reference source or a WebGL fluid simulation.

## Selected, slower detailed Ink and theme audit

- Replaced the four-option comparison menu with a single accessible Dark mode / Light mode toggle using the selected Ink effect. Ink now lasts 2.3 seconds and interpolates 17 matching SVG paths with cubic curves, fine edge variation and five satellite droplets that merge into the front. Native snapshot support and clip-path support are checked; motion changes, hidden tabs, resize and unmount clean up safely.
- Added coordinated dark book desk, cover, paper, notes, photo frames, labels and navigation colors while retaining company identity and image colors. Corrected dark project headings/labels and borders, heading accents, footer notes and contact controls. Reserved footer space for the toggle and increased mobile pagination touch targets to 44px.
- The first theme audit caught dark project titles remaining dark; fixed the actual styling, retained the regression, and reran checks. Lint, typecheck, production build and all 37 Edge tests passed. New coverage verifies the slower path animation, interruption, all five sections and dialog in light/dark at 320/390/768/1440px, both companies' pages, light text on dark material controls, no horizontal overflow and unsupported-browser fallback.
- Reviewed active ink, dark desktop book, mobile project cards, toolkit, hfiles gallery, contact dialog and light closing screenshots. No physical-device or additional-browser verification. No dependencies or environment variables added. Changes remain local pending any requested push.
