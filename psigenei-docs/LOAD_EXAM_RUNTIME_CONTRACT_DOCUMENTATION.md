# `loadExamRuntimeContract` Documentation

File: `src/lib/test-creation/resolver/load-exam-runtime-contract.ts`  
Types: `src/lib/test-creation/resolver/exam-config-types.ts`

## Purpose
`loadExamRuntimeContract` loads an exam config JSON plus the exam syllabus map JSON, validates both, normalizes the data into a runtime-safe contract, and computes deterministic version hashes.

This is a runtime loader for compile-time artifacts. It does not call DB or external network.

## Inputs and Outputs
- Input:
  - `examId: string`
  - `options: { rootDir?: string; snapshotVersion: string }`
- Output:
  - `Promise<ExamRuntimeContract>`

Required files under `exam-configs/<examId>/`:
- `<examId>-config.json`
- `<examId>-syllabus-map.json`

## IIT-JAM Draft Config Artifact
Current test artifact:
- `exam-configs/iit-jam-bt/iit-jam-bt-config.json`

Semantic version currently set to:
- `0.1.0-draft`

## What It Validates
1. Config and syllabus JSON parse successfully.
2. `exam_id` consistency:
- config `exam_id` equals requested `examId`
- syllabus `exam_id` equals requested `examId`
3. `snapshotVersion` is required and non-empty.
4. Config required fields are present and typed.
5. `permissible_tiers`:
- non-empty
- values in `1..4`
- duplicates rejected
6. `question_types_available`:
- non-empty
- values only in `MCQ|MSQ|NAT`
- duplicates rejected
7. `marking_scheme` covers every available question type.
8. `time_per_question_minutes` covers every available question type and each value is `> 0`.
9. `question_type_distribution` covers every available question type and:
- each value is `>= 0`
- sum is `1.0 ± 0.01`
10. `difficulty_mapping`:
- `easy`, `medium`, `hard` all required
- each has non-empty `tier_cognitive_pairs`
- referenced tiers must be inside `permissible_tiers`
- cognitive levels must be valid enum values
11. `display_config` required string fields:
- `card_color`
- `card_gradient`
- `icon`

## Normalization Rules
1. Question type order is normalized to fixed enum order:
- `MCQ`, `MSQ`, `NAT` (filtered by availability)
2. Tiers sorted ascending.
3. Cognitive arrays sorted by fixed enum order:
- `recall`, `conceptual`, `application`, `analytical`
4. Difficulty tier-cognitive pairs sorted by `tier` ascending.

## Deterministic Hashing
Two hashes are produced:

1. `configVersionHash`
- Built from normalized config object.
- Uses canonical stringification (deep key sort) before hashing.
- Stable against object key insertion order.

2. `runtimeBindingHash`
- Hash of:
  - `examId`
  - `configVersionHash`
  - `syllabusVersion`
  - `taxonomySnapshotVersion` (input `snapshotVersion`)
- Captures cross-artifact binding.

## Runtime Contract Fields
Returned contract includes:
- exam identity:
  - `examId`, `examName`, `examShortName`
- versioning:
  - `configVersionSemantic`
  - `configVersionHash`
  - `runtimeBindingHash`
  - `taxonomySnapshotVersion`
  - `syllabusVersion`
  - `syllabusLastUpdated`
- normalized maps:
  - `markingSchemeByType`
  - `timePerQuestionMinutesByType`
  - `questionTypeDistributionByType`
  - `difficultyMapping`
- linked syllabus payload:
  - `syllabusMap`

All top-level runtime contract objects/arrays are frozen.

## Usage Example
```ts
import { loadExamRuntimeContract } from "@/lib/test-creation/resolver/load-exam-runtime-contract";

const runtime = await loadExamRuntimeContract("iit-jam-bt", {
  snapshotVersion: "taxonomy-v2026-02-19",
});
```

## API Boundary Contract (Create-Test Routes)
Files:
- `src/app/api/create-topic-test/route.ts`
- `src/app/api/create-full-test/route.ts`
- `src/app/api/create-test-from-template/route.ts`
- `src/lib/test-creation/resolver/preload-exam-runtime-contract.ts`

For request paths, routes use strict resolution through:
- `resolveExamRuntimeContractForRequest(request)`

Request requirements:
- Body must be valid JSON object.
- `exam_id` is required.
- No default exam fallback is allowed for request paths.

Response behavior:
1. `400` with `code: "invalid_request"`
- invalid JSON body
- non-object JSON body
- missing/empty `exam_id`
2. `422` with `code: "unsupported_exam"`
- `exam_id` is well-formed but required exam artifacts are not present under `exam-configs/<exam_id>/`
3. `410` disabled-generation response
- emitted only after runtime contract resolves successfully

Phase-1 enablement:
- Feature flag: `ENABLE_TOPIC_TEST_CREATION_V1=true`
- Affects only `POST /api/create-topic-test`
- Supported exam in phase-1: `iit-jam-bt`
- When enabled and request is valid, route returns `201` with:
  - `status: "created"`
  - `mode: "phase2_local"`
  - `exam_id`
  - `test_id`
  - `start_url`
  - `test`
  - `exam_session`
  - `runtime_binding_hash`
  - `taxonomy_snapshot_version`
- Local persistence:
  - `src/lib/test-runtime/create-topic-test-session.ts` writes to `.cache/topic-test-runtime-store.json`
  - This is a phase-2 local store; DB-backed generation pipeline is still pending.
- Optional DB-backed question selection:
  - Feature flag: `ENABLE_TOPIC_TEST_DB_SELECTION_V1=true`
  - Requires: `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
  - Route mode becomes `phase2_db_localstore`
  - Questions are selected from `question_bank_v1` for syllabus-linked subtopics and persisted in local runtime store.
  - Selection policy is deterministic `hybrid`:
    - strict on `question_type_distribution` quotas
    - best-effort on difficulty (`easy|medium|hard`) targets
  - Difficulty targets currently use equal split (largest-remainder rounding) because config does not yet define explicit difficulty percentages.
  - Route includes `allocation` metadata with:
    - planned/actual type counts
    - planned/actual difficulty counts
    - contract-match flags
    - fallback events
  - Error codes:
    - `422` `insufficient_questions`: total contract-eligible questions are fewer than requested
    - `422` `insufficient_questions_type`: strict type quota cannot be met
    - `500` `selection_unavailable`: DB/env lookup issues
- `create-full-test` and `create-test-from-template` remain disabled (`410`) in this phase.

Local runtime read APIs (phase-2):
- `GET /api/tests/[testId]`
  - `200` with local test metadata, persisted `questions`, and `allocation`
  - `400` for invalid UUID `testId`
  - `404` when test is absent in local store
- `GET /api/examSession?testId=<uuid>&userId=<uuid?>`
  - `200` with existing local session
  - `400` for missing/invalid `testId`
  - `404` when session is absent
- `POST /api/examSession`
  - body: `{ testId: string, userId?: string }`
  - `201` when new local session is created from existing local test
  - `200` when session already exists
  - `400` for invalid request body/`testId`
  - `404` when `testId` is unknown

Warmup helpers retained for non-request contexts:
- `preloadDefaultExamRuntimeContract()`
- `preloadExamRuntimeContractForRequest(request)` (candidate + fallback preload behavior)

## Failure Behavior
The loader is fail-fast. Any invalid field, missing file, or cross-artifact mismatch throws a descriptive error immediately.
