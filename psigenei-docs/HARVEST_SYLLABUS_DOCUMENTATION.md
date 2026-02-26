# `harvestSyllabusCsv` Documentation

File: `scripts/harvest-syllabus.ts`  
CLI Launcher: `scripts/harvest-syllabus.js`

## Purpose
`harvestSyllabusCsv` is a deterministic build-time syllabus compiler. It reads an exam syllabus CSV, validates it against an immutable taxonomy snapshot, and produces a PRD-compliant syllabus map JSON under `exam-configs/<examId>/`.

It does not use database access, network calls, or runtime side effects beyond file I/O.

## Inputs and Outputs
- Function input:
  - `examId: string`
  - `csvPath: string`
  - `snapshot: TaxonomySnapshot`
- Function output:
  - `Promise<void>` (writes file to disk)
- Output file path:
  - `exam-configs/<examId>/<examId>-syllabus-map.json`

## CSV Contract
The harvester expects these headers:
- `Master Subject`
- `Master Topic`
- `Master Subtopic`
- `Taxonomy ID`
- `ACTION`
- `UI Display Name`

Each row is treated as a subtopic mapping row.  
`ACTION` supports `KEEP` and `MERGE` only.

## Output JSON Shape
The generated file uses this structure:
- `exam_id`
- `exam_name`
- `version` (sha256 hash from canonical structure)
- `last_updated` (static per-exam metadata)
- `subjects[]`
  - `display_name`
  - `bucket_codes_included`
  - `topics[]`
    - `display_name`
    - `bucket_codes_included`
    - `subtopics[]`
      - `display_name`
      - `bucket_codes_included`

## What It Enforces
1. Required header presence.
2. Numeric `Taxonomy ID`.
3. Bucket code must exist in snapshot.
4. Bucket code level must be `subtopic`.
5. Duplicate bucket codes in CSV are rejected.
6. Same bucket code under multiple UI labels is rejected.
7. Snapshot ancestry validity:
- subtopic must resolve to topic
- topic must resolve to subject
8. Canonical taxonomy name validity (normalized by trim + whitespace collapse + lowercase):
- `Master Subject` must match resolved subject node name
- `Master Topic` must match resolved topic node name
- `Master Subtopic` must match resolved subtopic node name
9. Structural completeness:
- at least one subject
- each subject has at least one topic
- each topic has at least one subtopic group

## Hierarchy Validation Model
Validation is done by both:
- snapshot ancestry (UUID parent chain), and
- canonical name matching against snapshot node names.

The snapshot node contract used by harvester includes:
- `uuid`
- `name`
- `bucketCode`
- `level`
- `parentUuid`

## Determinism Guarantees
To keep output byte-stable for identical inputs:
- Subjects are sorted by subject bucket code ascending.
- Topics are sorted by topic bucket code ascending.
- Subtopics are sorted by minimum bucket code in each subtopic group.
- All `bucket_codes_included` arrays are sorted ascending.
- Version hash is computed from canonical content only:
  - `sha256(JSON.stringify({ exam_id, exam_name, subjects }))`
- `last_updated` is not part of hash input.

## KEEP vs MERGE Behavior
- `KEEP`: one subtopic row yields one output subtopic with a single bucket code.
- `MERGE`: multiple rows with same normalized UI display name under the same topic are merged into one output subtopic with multiple bucket codes.

## CLI Usage
```bash
node scripts/harvest-syllabus.js <examId> <csvPath> <snapshotJsonPath>
```

Example:
```bash
node scripts/harvest-syllabus.js iit-jam-bt "docs/Hayden Gray - Syllabus mapping .csv" /tmp/master-taxonomy-snapshot.json
```

## Snapshot JSON Contract for CLI
The CLI expects a local JSON object with:
- `taxonomyVersion: string`
- `nodes: TaxonomyNode[]`
  - `uuid: string`
  - `name: string`
  - `bucketCode: number`
  - `level: "stream" | "subject" | "topic" | "subtopic"`
  - `parentUuid: string | null`

The loader reconstructs:
- `nodesByBucketCode`
- `childrenByUuid`
- `taxonomyVersion`

and passes a frozen `TaxonomySnapshot` into `harvestSyllabusCsv`.

## Snapshot Scope and Naming
The snapshot is taxonomy-scoped, not exam-scoped.

In the normal case (single master taxonomy), generate one snapshot and reuse it for all exam harvest runs:
- `iit-jam-bt`
- `gate-bt`
- `csir-net-ls`
- etc.

You only need separate snapshots if different exams intentionally use different taxonomy trees or versions.

Snapshot filenames are arbitrary and do not affect behavior.  
Recommended naming: `master-taxonomy-snapshot.json` (or versioned variant such as `master-taxonomy-snapshot-v2026-02-18.json`).

## Error Handling
The harvester fails fast and throws explicit errors with row context where applicable.  
It never auto-corrects malformed data and never silently drops invalid mappings.

## Observed Errors During Implementation
These were encountered while running the real CSV and are useful as diagnostic examples:

1. `CSV row 28: Master Subtopic is required`
- Why: the row represented a topic-level entry (`Current electricity`) with an empty `Master Subtopic`, but the harvester expects leaf/subtopic rows only.

2. `CSV row 35: ACTION must be KEEP or MERGE, got "EXCLUDE"`
- Why: the implementation intentionally supports only `KEEP` and `MERGE` per the strict compiler contract.

3. `CSV row 28: bucket code 10005 level is topic, expected subtopic`
- Why: taxonomy ID `10005` is a topic bucket in the snapshot, but input rows must reference subtopic bucket codes.

4. `CSV row X: Master Subject / Master Topic / Master Subtopic ... does not match canonical taxonomy name ...`
- Why: row labels must match resolved taxonomy node names after normalization; label drift is rejected.

## TODOs
- Implement a practical fallback in the syllabus harvester so every topic has at least one leaf subtopic.

## Exam Metadata
Exam-level metadata is currently defined in-code in `EXAM_METADATA`:
- `examName`
- `lastUpdated`

Currently configured:
- `iit-jam-bt` → `IIT-JAM Biotechnology`

## Why This Is Crucial for Our System
This module is a correctness gate for exam scope compilation. It guarantees:
- deterministic syllabus-map artifacts for reproducible builds
- early rejection of bad taxonomy references
- safe scope definition for test creation
- strict separation between compile-time config generation and runtime behavior

Without these checks, exam scope could drift silently, causing incorrect subject/topic visibility and unpredictable test generation behavior.

## Time Taken to Complete
Total implementation and hardening time for this harvester + CLI + validation passes: **~1 hour 45 minutes**.
