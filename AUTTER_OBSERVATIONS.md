# Autter observations — research plan

Docs reviewed 2026-10-16. No Autter installation, telemetry experiment or measured finding is claimed.

## Hypothesis / TODO 1 — CLI attribution

Hypothesis: CLI attribution can distinguish the feature, deliberate validation defect and restoration work.
Verify: install/onboard the CLI in this repo; run doctor, status and stats; compare recorded commit SHAs and attribution evidence across all three branches. Record actual coverage and limitations in AUTTER_NOTES.md. Do not infer attribution from Git history alone.

## Hypothesis / TODO 2 — Runtime correlation

Hypothesis: Node telemetry and browser events through a relay can be correlated with the deployed release.
Verify in an isolated environment: obtain real credentials; load Node instrumentation before Express; add the browser tracker and relay; set matching release SHAs; trigger one controlled error and usage event; inspect ingest evidence and request metrics. Compare backend failures and browser errors separately. Check that no secret appears in browser assets and no issue content is exported.

## Future roadmap

1. CLI: attribution baseline, controlled branch comparison, evidence archive.
2. Node Runtime: configure real endpoint/server key, bootstrap, error capture and release metadata; verify compatibility of installed versions.
3. Browser: use the existing backend as relay. Server keys are secret/backend-only; direct ingestion uses publishable client keys with origin restrictions when relay is unavailable.
4. Observability/tests: verify delivery, sampling, privacy, trace/metric linkage and tests after instrumentation.
5. C#/.NET: future separate experiment using the language's OpenTelemetry SDK and OTLP/HTTP export; no .NET used here.

Sources: [CLI installation](https://autter.dev/docs/cli/install), [Runtime introduction](https://autter.dev/docs/runtime/introduction), [Runtime quickstart](https://autter.dev/docs/runtime/quickstart).

## Current-doc follow-up commands (not executed)

```sh
npm install -g @autter/cli
autter onboard
autter doctor
autter status
autter stats
```

Run from the repository root. `autter onboard --connect` selects connected mode; `npx @autter/cli onboard` is documented as an alternative bootstrap. Review command help and account access first. Never invent a key.

Runtime follow-up: install the documented compatible `@autter/runtime-node` server package and `@autter/runtime-browser` client package only when ready. Configure `AUTTER_RUNTIME_KEY` and `AUTTER_ENDPOINT` on the backend, service/environment/release metadata, a Node preload, and `/api/autter-runtime` relay. Initialize the browser against that relative relay endpoint. Add explicit capture for handled errors as needed, then measure delivery before drawing conclusions.

