# Clean Slate Phase 1 - Logical Cleanup

**Date**: 2026-02-12  
**Status**: Implemented

## Objective
Disable all test generation behavior without destructive database drops.

## Implemented
- Disabled generation APIs with uniform `410 Gone` response.
- Standard payload:
  - `error`: `Test generation is temporarily disabled during Clean Slate Phase 1.`
  - `code`: `TEST_GENERATION_DISABLED`
  - `phase`: `PHASE_1`
- Disabled UI entry points that previously generated tests:
  - Test configuration submit modal
  - Recommendations flywheel recovery actions
  - Chapter test CTA in course sidebar
  - Curated tests start CTA
- Added shared helper: `src/lib/test-generation-disabled.ts`
- Removed legacy verification script after cleanup was complete.
- Removed old generation-related hooks and UI code paths that were calling the generation endpoints.

## Deferred to Phase 2 (Hard Cleanup)
- Physical DB object removal (`DROP FUNCTION`, `DROP TRIGGER`, `DROP TABLE`) remains pending.
- Candidate objects for review/removal:
  - Legacy generation-related RPCs/functions
  - Legacy taxonomy/question-bank tables and triggers

## Phase 2 Update (2026-02-12)
- Added hard-cleanup migration: `supabase/migrations/20260212120000_phase2_hard_cleanup.sql`
- Removed from active schema:
  - Legacy generation-related RPCs/functions
  - Legacy taxonomy/question-bank tables and trigger artifacts
- Removed legacy script:
  - `scripts/migrate_questions.js`
