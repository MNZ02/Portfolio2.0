# `loadTaxonomySnapshot` Documentation

File: `src/lib/test-creation/resolver/load-taxonomy-snapshot.ts`

## Purpose
`loadTaxonomySnapshot` loads taxonomy rows from `master_taxonomy`, validates structural correctness, builds deterministic lookup structures, and produces a stable `taxonomyVersion` hash used for cache/version consistency.

## Inputs and Outputs
- Input: `DbClient` with `query<T>()`
- Output: `TaxonomySnapshot`
  - `nodesByBucketCode: ReadonlyMap<number, TaxonomyNode>`
  - `childrenByUuid: ReadonlyMap<string, readonly string[]>`
  - `taxonomyVersion: string`
  - `TaxonomyNode` now includes: `uuid`, `name`, `bucketCode`, `level`, `parentUuid`

## What It Enforces
1. Level support includes all required levels:
- `stream | subject | topic | subtopic`

2. Stream/root presence:
- At least one `stream` node must exist.

3. Uniqueness constraints:
- Duplicate `id` is rejected.
- Duplicate `bucket_code` is rejected.

4. Canonical name integrity:
- `name` must be non-empty for every taxonomy node.

5. Parent integrity:
- Parent must exist if `parent_id` is present.
- Self-parent (`parent_id === id`) is rejected.

6. Hierarchy rules:
- `stream` must have `parent_id = null`
- `subject` parent must be `stream`
- `topic` parent must be `subject`
- `subtopic` parent must be `topic`

7. Deterministic traversal order:
- Child adjacency lists are sorted by parent children’s `bucketCode` (not DB return order).

8. Connectivity validation:
- DFS is run from all `stream` roots.
- If any node is unreachable, it throws `"disconnected taxonomy"`.

9. Canonical checksum/versioning:
- Hash input uses positional arrays: `[id, name, bucket_code, level, parent_id]`.
- This avoids object-key-order fragility and produces stable versioning.

## Why This Is Crucial for Our System
This module is a correctness gate for the test-creation resolver. It is crucial because it guarantees:
- Deterministic test generation across machines/environments.
- Early failure on broken taxonomy data instead of silent downstream corruption.
- Stable snapshot versioning for cache coherence and reproducible debugging.
- Unambiguous traversal paths for scope expansion and leaf selection.

Without these safeguards, the same input request can produce inconsistent tests, ambiguous scope resolution, hidden data integrity failures, and hard-to-reproduce production bugs.

## Time Taken to Complete
Total implementation and hardening time for these corrections: **~2 hours 15 minutes**.
