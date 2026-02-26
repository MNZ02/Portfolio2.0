# Test Manthan / Tests Module Summary

This document summarizes the test-system journey end-to-end: architecture decisions, phased rollout, API/runtime behavior, testing coverage, and latest session-integrity updates.

## 1. Contract-first architecture established

- Runtime contract resolver built around exam artifacts:
  - `exam-configs/<examId>/<examId>-config.json`
  - `exam-configs/<examId>/<examId>-syllabus-map.json`
- Strict validation + normalization + deterministic hashing:
  - `configVersionHash`
  - `runtimeBindingHash`
- Key files:
  - `src/lib/test-creation/resolver/load-exam-runtime-contract.ts`
  - `src/lib/test-creation/resolver/preload-exam-runtime-contract.ts`

## 2. API boundary hardened

- Create-test routes enforce strict request contract:
  - `400 invalid_request` for malformed/missing inputs
  - `422 unsupported_exam` for unsupported exam configs
- Key routes:
  - `src/app/api/create-topic-test/route.ts`
  - `src/app/api/create-full-test/route.ts`
  - `src/app/api/create-test-from-template/route.ts`

## 3. Clean Slate Phase 1 (2026-02-12)

- Test generation disabled behind a uniform `410 Gone` response (`TEST_GENERATION_DISABLED`) to pause unstable generation paths while cleanup proceeded.
- Reference:
  - `docs/CLEAN_SLATE_PHASE1.md`

## 4. Phase 2 hard cleanup (2026-02-12)

- Legacy generation DB objects/tables/triggers removed via migration.
- Objective: keep only the new contract-driven direction active.

## 5. Selective re-enable: topic test only (feature-flagged)

- `ENABLE_TOPIC_TEST_CREATION_V1=true` enables only topic test creation.
- Full test and template creation remain disabled.
- Controlled rollout for `iit-jam-bt` first.

## 6. Local runtime store architecture added

- Test + session persistence moved to local runtime store:
  - `.cache/topic-test-runtime-store.json`
- Runtime store logic:
  - `src/lib/test-runtime/create-topic-test-session.ts`

## 7. Runtime read APIs added

- `GET /api/tests/[testId]` to load created test runtime payload
- `GET /api/examSession` to fetch existing session
- `POST /api/examSession` to create/resume session
- Files:
  - `src/app/api/tests/[testId]/route.ts`
  - `src/app/api/examSession/route.ts`

## 8. Allocator-based question selection path (optional DB mode)

- Hybrid deterministic allocator:
  - strict type quotas
  - best-effort difficulty targets
- Selection engine:
  - `src/lib/test-runtime/topic-test-question-selection.ts`

## 9. Frontend test flow built

- Create-test UI + confirmation modal + runtime page integrated:
  - `src/app/dashboard/create-test/page.tsx`
  - `src/components/modals/FormSubmissionModal.tsx`
  - `src/app/test/[testId]/page.tsx`

## 10. Automated coverage in `/tests`

- Runtime contract loader tests
- Request resolver/preload tests
- Create-route contract/status tests
- Local runtime read-route tests
- Phase-1 enablement tests
- Allocator behavior tests
- Test files:
  - `tests/load-exam-runtime-contract.test.cjs`
  - `tests/preload-exam-runtime-contract.test.cjs`
  - `tests/create-test-routes-contract.test.cjs`
  - `tests/create-topic-test-phase1-enabled.test.cjs`
  - `tests/local-runtime-read-routes.test.cjs`
  - `tests/topic-test-question-selection-allocator.test.cjs`

## 11. Latest update: session integrity hardening

- Implemented strong one-way behavior for active tests:
  1. Browser back blocked during active test.
  2. Leaving test page ends session (`terminated`).
  3. Re-opening same test after termination is blocked.
- Added real terminate endpoint:
  - `src/app/api/terminate-test/route.ts`
- Session status model now supports:
  - `ongoing | terminated | submitted`
- Runtime behavior on test page:
  - `popstate` guard to block back navigation
  - `pagehide` best-effort termination via `sendBeacon`
  - Quit action terminates session before redirect
  - Re-entry denied if session status is not `ongoing`

## 12. Current state

- Topic test path is operational with guarded session lifecycle.
- Full test and template generation remain intentionally disabled.
- Overall system is contract-driven, test-covered, and resistant to session bypass via back navigation.
