# Nirav Patel

Fresh portfolio starting point: a white opening header with offset name typography, an original seven-piece vector illustration, vivid violet, pink and orange accents, and a randomized swarm entrance at 3x speed. An experience memory book follows the opening, with two pages each for Sedani Digital and hfiles: experience notes and a photo gallery. This supersedes the previous five-chapter 3D journey.

Uses Next.js App Router, strict TypeScript, Tailwind CSS v4, and local fonts. The supplied standalone public/swarm-intro.js engine scans the visible header, draws selection boxes with multiple cursors, and types the real text. The random plan orders tasks across the whole opening, including navigation, name, vector pieces and footer; navigation has no priority. Parent boxes still reveal before their children. Three fixed cursors and readable headline typing are configured independently of build order. The React wrapper runs swarm mode with random origin/order, three cursors, speed 3, and demo controls disabled. Replay intro starts another randomized run. Entrances vary between orbit, fan and rally; endings vary between scatter, sweep and spiral before cursors leave the viewport. Session storage remembers the last origin, order, entrance and ending so consecutive refreshes and replays select different choices; blocked storage falls back to ordinary random choices. The contact link opens a keyboard-accessible dialog with the public email, copy confirmation, and an email-app link. Without JavaScript the original mailto link remains usable. Native scrolling stays enabled. Pause, Escape, resize, hiding the tab, or live reduced motion stops the intro and restores content. Server-rendered content stays readable with JavaScript disabled or a failed engine load. No environment variables required.

## Development

Use Node.js >=22.13.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Playwright owns port 3100. Leave any existing preview on port 3000 running. The Microsoft directory and Git history are preserved. Push feature branches for preview; production merges require approval and passing CI.

## Experience book

The accepted opening design is preserved. The new section is an original paper-and-tape composition, not an imported ThreeUI component. Both ThreeUI reference source URLs were unreachable during implementation.

- Sedani Digital: black/white, Intern Software Developer.
- hfiles: yellow/blue, Web Developer.
- Logos and work summaries are deliberately marked as drafts/placeholders; no dates or achievements are invented.
- Company content lives in `src/content/experience-book.ts`. Replace `draftSummary` by adding a real `summary`. Add logo assets under `public/` and set `logoSrc` to a root-relative path such as `/company-logos/sedani.svg`; the placeholder mark will be replaced automatically.
- The book is capped at 900px wide, with compact 620px minimum pages and scaled spacing/type that preserve the paper-and-tape treatment.
- Desktop shows one company per spread: experience notes on the left and three Pinterest-style taped photo slots on the right. Mobile reads all four pages individually with company tabs and previous/next buttons. Four pages and six photo slots render on the server and remain readable without JavaScript.
- Page turns use front/back faces, a stationary facing-page layer, perspective, and transform/opacity lighting. All temporary clones are inert, stripped of IDs, and removed after completion, interruption, or unmount.
- Auto-turn advances every 5 seconds and loops. It runs only while the book is visible and motion is enabled, pauses on hover or focus, and resets the countdown after interaction. Use the top auto-turn button to pause/resume; global Pause motion and live reduced motion disable autoplay as well as movement.
- Add photos under `public/company-photos/` and set each entry in the company `photos` array to include a root-relative `src`, descriptive `alt`, and `caption`. The three labeled placeholders per company are not presented as real workplace photos.
- A shared motion store connects the existing Pause motion control to the book. Live reduced motion disables automatic turns; hiding the tab or changing layouts cleans up a pending turn. No continuous renderer, extra dependency, or environment variable was added.

## Project collection

Exactly three owner-supplied projects follow the book: **20 Ways to See the Same Thing** (a WordPress project with 20 themes), **Creaup** (a web scraper collecting data from other websites), and **Sterling** (a WordPress website). Other commercial WordPress work is mentioned below the cards. No unprovided client results, dates, URLs, or technology stacks are invented.

Content lives in `src/content/projects.ts`. The three original SVG covers are explicitly illustrative; add `imageSrc` and `imageAlt` for real screenshots under `public/`, and `href` when a project URL is available.

The supplied engine's `web` mode pulls whole cards into place with threads when the reader encounters them. Desktop reveals visible cards together; mobile reveals cards as they enter the viewport. The trigger requires at least 75% of a card to be visible with its center within 8% of viewport height of the screen center, rechecks that geometry immediately before starting, and waits for scrolling to settle. A passive scroll listener handles continued scrolling, and further scrolling/resize/reduced motion/hidden tabs stops the effect and restores content. Each card runs once. Card contents are excluded from engine DOM wrapping. Server-rendered cards work without JavaScript or a successful engine load.

The one shared engine exposes `activeRoot` and ready/end events so the project reveal waits for the header intro rather than interrupting it. There are no extra continuous render loops or dependencies. Engine API types live in `src/types/swarm.d.ts`. No environment variables are required.

## Keychain toolkit

The skills section follows the projects, with six owner-confirmed skills in src/content/toolkit.ts. CSS metal rings and acrylic-style tags match the existing palette; the short paragraph sits on the right on desktop and above the tags on mobile. IntersectionObserver starts a one-time staggered WAAPI swing when each tag reaches 60% visibility. Shared pause/reduced motion, hidden-tab cancellation and unmount cleanup are supported. Server-rendered cards remain readable without JavaScript. No dependencies or environment variables added.

## Closing and footer

A compact hello panel follows the toolkit, with original CSS paper/orbit details. Scroll-driven decorative transforms use one scheduled frame per scroll update while visible; there is no continuous renderer. Shared motion settings, reduced motion, hidden tabs and cleanup are respected. The footer provides the public email and native back-to-top navigation. No dependencies or environment variables added.

The closing panel uses separate scroll depths for its note, orbit ring, spark, dot and oversized background word. The foreground note also tilts with scroll; reversing scroll reverses the effect. Motion remains optional through the existing global controls.
