# MiniDesk

A small issue tracker built to practise full-stack development, Git workflows, automated testing, and a future Autter evaluation.

## What this project is for

MiniDesk gives a team a simple place to record bugs and tasks, set priorities, and track progress from **Open** to **In progress** to **Done**.

The working app lets you:

- Create issues with a title, description, and priority.
- View issues, change their status, and delete them.
- See total, open, in-progress, and completed issue counts.
- Keep issues in a local SQLite database between server restarts.

## Why I built it

I built MiniDesk as a practical learning project: a small application where I can follow a feature from the React interface through an Express API to a SQLite database.

It also gives me a controlled lab to practise branches and pull requests, introduce one deliberate validation bug, prove that tests catch it, and restore the rule with stronger tests. I plan to use it to evaluate Autter's code attribution and runtime observability. Autter is not installed or configured yet, and the research notes contain hypotheses rather than claimed results.

## Technology

- **React + Vite:** interface and development server.
- **Node.js + Express:** JSON API and input validation.
- **SQLite + better-sqlite3:** local storage with prepared statements.
- **node:test + Supertest:** isolated API tests.

No .NET is used.

## Where is the working app?

`main` contains the initial scaffold and this overview. The implementation is in [PR #1](https://github.com/Lazzyx22/minidesk/pull/1).

| Branch | Purpose |
|---|---|
| `main` | Initial scaffold and project overview |
| `feature/minidesk-core` | Complete issue tracker |
| `test/validation-bug` | Deliberate test-only defect — never merge |
| `fix/restore-validation` | Restored validation with extra boundary tests |

## Run the app locally

Install Node.js 24 and Git, then:

```sh
git clone https://github.com/Lazzyx22/minidesk.git
cd minidesk
git switch fix/restore-validation
npm install
npm --prefix server install
npm --prefix client install
```

Copy `.env.example` to `.env`. In PowerShell:

```powershell
Copy-Item .env.example .env
```

Start the backend and frontend in separate terminals:

```sh
npm run server
```

```sh
npm run client
```

Open **http://localhost:5173**. Vite forwards `/api` requests to the backend on port **3001**. SQLite creates its database automatically.

## Check the implementation

Run these commands on the implementation or fixed branch:

```sh
npm test
npm --prefix server run smoke
npm run build
npm --prefix client run lint
```

The fixed branch passes six API tests, eight HTTP smoke checks, the production build, and lint. The deliberate defect branch is expected to fail validation tests.

## Project notes

The implementation branches include a detailed setup/API README and:

- `AUTTER_NOTES.md`: experiment record template.
- `AUTTER_OBSERVATIONS.md`: two unverified hypotheses and a future roadmap.
- `MINIDESK_AUTTER_SPRINT.md`: goals and checkpoints.
- `GIT_PR_LAB.md`: branch and pull-request workflow.

Future Autter work will cover CLI attribution, Node Runtime, and browser instrumentation through a backend relay. Secret server keys must stay in backend environment variables.

---

## Implementation reference

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

