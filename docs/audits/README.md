# Audits and verification evidence

Each milestone stores its verification evidence here so completion claims can be checked.

## Convention

- `MXX-verification.md`: required for every milestone. It records the environment, the exact commands, and their actual results (pass/fail counts, relevant output excerpts), with a date.
- `MXX-<topic>-audit.md`: deeper audits such as accessibility, performance or security (mainly M06 and M07).
- Record only what was actually executed. Mark anything not run as `NOT VERIFIED`, with the reason.
- Do not commit large generated reports (Playwright HTML reports, traces). Summarise them, and attach artefacts to CI runs instead.

## Index

| Milestone | Document                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| M01       | [M01-verification.md](M01-verification.md)                                                                                |
| M02       | [M02-verification.md](M02-verification.md) (screenshots in [m02-screenshots/](m02-screenshots/))                          |
| M03       | [M03-verification.md](M03-verification.md) (screenshots in [m03-screenshots/](m03-screenshots/))                          |
| M04       | [M04-cms-verification.md](M04-cms-verification.md); backend setup in [M04-neon-verification.md](M04-neon-verification.md) |
| M05       | [M05-verification.md](M05-verification.md) (in progress)                                                                  |
