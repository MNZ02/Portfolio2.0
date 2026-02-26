# IIT JAM Topic-Test Type Rebalance (Phase-2 DB Selection)

Date: February 25, 2026

## Purpose
Document the rollout that removes hard failure on type-quota shortages for IIT JAM topic-test generation when DB-backed selection is enabled.

## Problem
The allocator previously used strict type quotas in `hybrid` mode.  
If planned type counts could not be met (example: `MSQ planned=3, actual=1`), API returned:
- `422`
- `code: "insufficient_questions_type"`

This blocked test creation even when total eligible inventory was enough to create the requested test size.

## New Behavior
For `exam_id = "iit-jam-bt"`, allocator now uses:
- `policy_mode: "rebalance_type_quota"`

For other exams, allocator remains:
- `policy_mode: "hybrid"` (strict type quotas)

### Rebalance Rules (IIT JAM only)
1. Keep requested `totalQuestions` fixed.
2. Apply min-1 floor per available type:
- If a type has at least one eligible question, allocator reserves at least one slot for that type (budget permitting).
3. Fill remaining slots using planned distribution as target.
4. If a type is short, redistribute deficit to other types with spare inventory.
5. Keep difficulty targeting as best-effort (same as before).

## What No Longer Happens (for IIT JAM)
- Type shortage alone does **not** cause `insufficient_questions_type`.

## What Still Fails
- If total contract-eligible pool is below requested size:
  - `422`
  - `code: "insufficient_questions"`

## Allocation Metadata
API response `allocation` now reflects adjusted mix when rebalance occurs:
- `contract_match.type_quota_exact` may be `false`
- `fallback_events` includes explicit rebalance events

New fallback event steps:
- `type_rebalanced_insufficient_inventory`
- `type_floor_applied`

Existing fallback steps retained:
- `same_type_any_difficulty`
- `difficulty_soft_mismatch`

## API Impact
Endpoint: `POST /api/create-topic-test`

For IIT JAM requests:
- Success remains `201` when total inventory is sufficient.
- `mode` and payload shape stay backward compatible.
- Allocation summary indicates exact vs adjusted quota match.

## Implementation Files
- `src/lib/test-runtime/topic-test-question-selection.ts`
- `src/lib/test-runtime/create-topic-test-session.ts`

## Test Coverage Added/Updated
- `tests/topic-test-question-selection-allocator.test.cjs`
  - verifies strict `hybrid` still fails on type shortage
  - verifies `rebalance_type_quota` succeeds with adjusted counts
- `tests/create-test-routes-contract.test.cjs`
- `tests/create-topic-test-phase1-enabled.test.cjs`

## Notes
- This rollout is exam-scoped intentionally to limit blast radius.
- Full-test and template-test endpoints are still not enabled for IIT JAM generation; they return `unsupported_test_type`.
