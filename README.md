# MiniDesk

A small issue tracker: React + Vite client → relative `/api` requests → Express → SQLite via better-sqlite3 prepared statements. No .NET used. Node 24 recommended (verified with 24.19.0).

## Setup and run

From the repository root:

```sh
npm install
npm --prefix server install
npm --prefix client install
```

Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`). Defaults: `PORT=3001`, `DB_PATH=./minidesk.db`; the DB path is relative to the server working directory. The server creates the database/schema automatically. Keep port 3001 for the supplied proxy, or update `client/vite.config.js` too.

In two terminals:

```sh
npm run server
npm run client
```

Open http://localhost:5173. Development uses the Vite proxy to localhost:3001. For production, serve `client/dist` behind a web server that forwards `/api` to Express; Vite preview is only a static build preview, without the dev proxy. This local lab has no authentication; add authentication before exposing private issues publicly.

```sh
npm test
npm --prefix server run smoke
npm run build
npm --prefix client run lint
```

Tests and the real HTTP smoke runner each use isolated in-memory SQLite. Dependency lockfiles are committed. Environment files, database files and secrets are ignored.

## API

JSON responses; errors are `{ "error": "safe message" }`.

| Method | Route | Result |
|---|---|---|
| GET | /api/health | 200 health |
| GET | /api/issues | 200 issue array, newest first |
| POST | /api/issues | 201 created issue |
| PATCH | /api/issues/:id | 200 updated issue |
| DELETE | /api/issues/:id | 204, no body |
| GET | /api/stats | 200 total/open/in_progress/done counts |

POST requires title; description defaults to empty, priority to medium, status to open. PATCH accepts any nonempty subset of these four fields. Titles are trimmed, 3–100 characters; descriptions ≤500; priority low/medium/high; status open/in_progress/done. IDs must be positive safe integers. Invalid input →400, missing issue/route →404, unexpected failure →500. Timestamps are UTC ISO strings; created_at is preserved on updates.

## Git lab

`main` is the skeleton. `feature/minidesk-core` is the working app. `test/validation-bug` deliberately weakens ONE title rule and must never be merged. `fix/restore-validation` restores that rule and adds boundary coverage. The final checkout is the fixed branch; all branches are preserved. See `GIT_PR_LAB.md` for publishing commands.

## Official references

- [Vite guide](https://vite.dev/guide/)
- [Express installation](https://expressjs.com/en/starter/installing/)
- [better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [Autter CLI installation](https://autter.dev/docs/cli/install)
- [Autter Runtime introduction](https://autter.dev/docs/runtime/introduction)

Docs checked 2026-10-16. Autter CLI page was retrieved directly over HTTPS after the web reader failed.

## Autter testing checklist

- [ ] Install the documented CLI; run onboard, doctor, status, stats from this repository.
- [ ] Compare attribution for the feature, deliberate defect and fix commits; record evidence, not assumptions.
- [ ] Obtain real Runtime endpoint/key, configure Node bootstrap before Express import, and match release SHA.
- [ ] Add browser tracker via backend relay; keep server keys out of all VITE_ variables and bundles.
- [ ] In an isolated lab, check one controlled error, usage event, trace and request metric; inspect delivery and privacy.
- [ ] Rerun API tests/build and record results in AUTTER_NOTES.md. Runtime is currently uninstalled/unconfigured.
