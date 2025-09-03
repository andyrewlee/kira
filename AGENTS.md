# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, and styles (`globals.css`). Marketing routes live under `app/(marketing)`, dashboards under `app/dashboard`, APIs under `app/api`, and server-only routes under `app/server`.
- `components/`: Shared UI. Shadcn UI lives in `components/ui/`; higher-level components (e.g., `SiteHeader.tsx`) live at the root.
- `convex/`: Convex backend functions and `schema.ts`. Files in `convex/_generated/` are code‑gen—do not edit.
- `hooks/` and `lib/`: Reusable hooks and utilities (e.g., `lib/utils.ts` exports `cn`).
- `public/`: Static assets. `apps/printers/`: printer‑specific app. `prds/`: product requirement docs referenced by features.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Run Next.js and Convex locally in parallel. Opens/uses the Convex dev deployment.
- `npm run build`: Production build for Next.js.
- `npm start`: Serve the production build.
- `npm run lint`: Run ESLint (Next.js rules + TypeScript).

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer typed props/returns. Prettier (default config) for formatting; ESLint for correctness.
- Files: components `PascalCase.tsx`; routes and non‑component files `kebab-case.ts(x)` where practical; hooks `use-*.ts`.
- Imports: use path aliases (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).
- Tailwind: use `cn(...)` from `@/lib/utils` to merge classes; prefer semantic class ordering and variant utilities.
- Next App Router: prefer Server Components by default; add `"use client"` only when interactivity is required.

## Testing Guidelines
- No test runner is configured yet. If introducing tests, colocate as `Component.test.tsx` next to source and propose adding Vitest + React Testing Library (and Playwright for E2E) in a separate PR.

## Commit & Pull Request Guidelines
- Commits: short, imperative, and focused. Examples: “Add PRDs for next iteration”, “Update marketing pages based on PRD”, “Enhance dashboard pages based on clickable PRDs”. Add a body when context helps.
- PRs: clear description, link relevant `prds/*.md`, screenshots for UI changes, local verification steps, and any env/config notes.

## Security & Configuration Tips
- Use `.env.local` for secrets (e.g., `CLERK_SECRET_KEY`, `CONVEX_DEPLOYMENT`). Do not commit secrets. Only expose with `NEXT_PUBLIC_*` when truly public.
- Configure Clerk and Convex via their dashboards; rotate any accidentally committed keys. Avoid editing files under `convex/_generated/`.

