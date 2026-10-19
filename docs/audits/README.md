# Audits and verification evidence

Each milestone stores its verification evidence here so completion claims can be checked.

## Convention

- `MXX-verification.md`: required for every milestone. It records the environment, the exact commands, and their actual results (pass/fail counts, relevant output excerpts), with a date.
- `MXX-<topic>-audit.md`: deeper audits such as accessibility, performance or security (mainly M06 and M07).
- Record only what was actually executed. Mark anything not run as `NOT VERIFIED`, with the reason.
- Do not commit large generated reports (Playwright HTML reports, traces). Summarise them, and attach artefacts to CI runs instead.

## Index

| Milestone | Document |
|---|---|
| M01 | [M01-verification.md](M01-verification.md) |
