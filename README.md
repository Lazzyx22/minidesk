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
