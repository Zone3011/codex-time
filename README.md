# Nirav Patel — personal portfolio

A responsive editorial portfolio built with Next.js App Router, TypeScript, Tailwind CSS v4, and GSAP. Cobalt blue, oversized type, and original CSS artwork give it a visual identity without external image or font dependencies.

## Local development

Use Node.js 22 LTS and npm (see .nvmrc).

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

No environment variables, accounts, or credentials are required. .env.example documents this explicitly. Future private values belong in .env.local and the Vercel environment settings; never use NEXT_PUBLIC_ for secrets.

## Structure

- src/app: pages, root layout, metadata, global design tokens and responsive styles.
- src/components: navigation and isolated GSAP lifecycle.
- src/content/portfolio.ts: identity, illustrative projects, and skill groups.
- .github/workflows/ci.yml: npm clean install, lint, TypeScript checks, production build.
- AGENTS.md: durable conventions and approval boundaries for Codex.

## Portfolio content

This portfolio belongs to Nirav Patel. Identity and technology groups live in src/content/portfolio.ts; personal copy is in src/app/page.tsx. Contact uses niravpatel1422004@gmail.com. LinkedIn is intentionally omitted. No public project case studies, employer names, or employment dates have been supplied. The work section introduces this portfolio without claiming fictional projects.

Update the site as Nirav supplies real projects and more about his work. Keep copy grounded in those details; AGENTS.md records these preferences.

## GitHub setup — approval required

The repository is connected to https://github.com/Zone3011/codex-time. The current site is hosted at https://codex-time.vercel.app. Changes in this feature branch remain local until a push is authorized. The steps below are retained as setup guidance.

After approving authentication, remote creation, and pushing, create an empty GitHub repository and connect it:

```sh
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

In GitHub settings, protect main: require a pull request, approval, and the CI check named Lint, types, build; block force pushes and direct pushes. Apply restrictions to administrators where your plan supports it. Configure these settings before relying on approval as a release gate. Local instructions alone cannot enforce remote protections.

## Vercel setup — approval required

1. After GitHub setup is approved, sign in to Vercel and choose Add New → Project.
2. Import the GitHub repository and grant access only to the intended repository.
3. Keep framework preset Next.js, repository root directory, and detected npm defaults. Select Node.js 22. No custom vercel.json or environment variables are needed.
4. Confirm main as the production branch. Importing and deploying creates the first production release, so obtain approval before that step.
5. Feature branches and pull requests receive preview deployments after pushes. Review the preview, wait for CI, and approve the PR before merging.
6. An approved merge to protected main triggers automatic production deployment.

Git integration automatically deploys production-branch changes; enforce human approval through GitHub branch protection. A local AGENTS.md cannot prevent a direct push from deploying. Preview deployments are externally hosted too, so pushing and connecting Vercel require approval.

Official references: [Next.js setup](https://nextjs.org/docs/app/getting-started/installation), [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github).

## Codex feature workflow

Describe the feature and acceptance criteria. Codex reads AGENTS.md, creates a feature branch for substantial work, implements and validates locally, and prepares a focused commit and PR description. Approve authentication/push/PR operations before remote actions. Review CI and the Vercel preview, then approve the merge to release. No GitHub or Vercel tokens are required for local development or CI.

## Browser checks

Run npm exec playwright install chromium once, then npm run test:e2e after a production build. On Windows with Microsoft Edge installed, set PLAYWRIGHT_CHANNEL=msedge instead of installing Chromium. The suite checks keyboard navigation, email contact links, responsive overflow, and reduced motion.

See docs/validation.md for known development dependency advisories.
