# CardioCare

CardioCare is a mobile-friendly educational health-management prototype for tracking blood pressure, medications, lifestyle habits, and cardiovascular education.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cardiocare/src/App.tsx` — CardioCare routes, sample patient data, local interactions, and shared navigation.
- `artifacts/cardiocare/src/index.css` — CardioCare visual tokens, responsive layout, cards, forms, charts, and modal styling.
- `artifacts/cardiocare/package.json` — Vite app scripts and frontend dependencies.

## Architecture decisions

- The first release is frontend-only and uses local React state with sample patient data so the prototype is immediately usable without account setup or external services.
- Health guidance is intentionally educational and avoids diagnostic claims or medication-change recommendations.
- All primary tracking flows are available from a shared responsive shell with desktop sidebar navigation and mobile bottom navigation.

## Product

CardioCare helps a patient review their day, record blood pressure and heart rate, review readings in a chart or history table, manage today's medications, update lifestyle metrics, read short educational guides, and keep care-team details visible. It includes persistent urgent-symptom guidance for severe chest pain, severe difficulty breathing, fainting, sudden weakness, or other serious symptoms.

## User preferences

- The user requested a clean, professional, readable, mobile-friendly healthcare experience with simple icons and accessible controls.

## Gotchas

- This is an educational and health-management prototype, not a diagnostic tool. Do not add medication or dose-change recommendations.
- The app's Vite workflow requires the managed `PORT` and `BASE_PATH` environment variables supplied by the artifact workflow.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
