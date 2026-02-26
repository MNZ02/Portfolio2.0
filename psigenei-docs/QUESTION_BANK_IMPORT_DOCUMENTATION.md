# `import-question-bank` Documentation

Files:
- `scripts/import-question-bank.ts`
- `scripts/import-question-bank.js`
- `supabase/migrations/20260222220000_create_question_bank_v1.sql`

## Purpose
`import-question-bank` is a deterministic offline CSV importer for the PRD-aligned question bank table `public.question_bank_v1`.

It validates each row, resolves taxonomy references through `master_taxonomy`, computes idempotency hashes, and inserts valid rows into the database.

## Scope (v1)
- Ingestion mode: offline script only.
- Storage target: `public.question_bank_v1` (new table; legacy `public.questions` untouched).
- Review status default: `reviewed`.
- Image handling: deferred (image columns accepted but not validated/stored in v1).

## CLI Usage
```bash
node scripts/import-question-bank.js <csvPath> [--batch-id=<id>] [--dry-run]
node scripts/import-question-bank.js --manifest=<manifestPath> [--batch-id=<id>] [--dry-run]
```

Examples:
```bash
node scripts/import-question-bank.js ./data/question-bank.csv --dry-run
node scripts/import-question-bank.js ./data/question-bank.csv --batch-id=BIOCHEM-2026-02-22
node scripts/import-question-bank.js --manifest=./data/question-bank-manifest.json --dry-run
```

## Split CSV Manifest Mode (MCQ/MSQ/NAT)
When client provides separate CSV files by question type, use manifest mode.

Manifest JSON schema:
```json
{
  "base_dir": "docs",
  "mcq_csv": "Hayden Gray - MCQ_ques.csv",
  "msq_csv": "Hayden Gray - MSQ_ques.csv",
  "nat_csv": "Hayden Gray - NAT_ques.csv"
}
```

Notes:
- Files are processed in deterministic order: `mcq`, `msq`, `nat`.
- `question_type` is forced by file profile.
- Default `source_type` in split mode is `pyq`.
- Row-level errors include file profile context.

## Required Environment Variables
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` (or fallback `NEXT_PUBLIC_SUPABASE_URL`)

The script also loads `.env` from repo root if present.

## Required CSV Headers
- `question_text`
- `question_type`
- `correct_answer`
- `explanation`
- `subtopic_bucket_code`
- `cognitive_level`
- `scope_tier`
- `source_type`

## Supported Optional Headers
- `option_a`, `option_b`, `option_c`, `option_d`, `option_e`
- `nat_range_min`, `nat_range_max`
- `source_exam`, `source_year`, `source_session`
- `image_question`, `image_option_a`, `image_option_b`, `image_option_c`, `image_option_d`, `image_option_e`

Header alias support for split files:
- `Question Text` -> `question_text`
- `Scope Level` -> `scope_tier`
- `Taxanomy ID` / `Taxonomy ID` -> `subtopic_bucket_code`
- `Source` -> `source_exam`
- `Year` -> `source_year`
- NAT: `Min Value` / `Max Value` -> `nat_range_min` / `nat_range_max`
- `Has Image` / `Image` accepted (image handling still deferred in v1)

## Validation Rules
1. `question_type` must be `MCQ | MSQ | NAT`.
2. `cognitive_level` must be `recall | conceptual | application | analytical`.
3. `scope_tier` must be `1 | 2 | 3 | 4`.
4. `source_type` must be `pyq | practice`.
5. `subtopic_bucket_code` must be numeric and resolve to a `subtopic` in `master_taxonomy`.
6. Subtopic must have a valid parent `topic`; parent UUID is denormalized to `topic_uuid`.
7. MCQ:
   - `option_a..option_d` required
   - `correct_answer` must be one valid option letter
8. MSQ:
   - `option_a..option_d` required (`option_e` optional)
   - `correct_answer` must be comma/semicolon-separated valid option letters
9. NAT:
   - `nat_range_min` and `nat_range_max` required decimals
   - `nat_range_min <= nat_range_max`
10. `source_type=pyq` requires `source_exam` and `source_year`.

## Idempotency and Duplicates
- `content_hash` is computed from canonical question content + subtopic bucket context.
- DB uniqueness is enforced on `(content_hash, subtopic_uuid)`.
- Duplicate insert conflicts are counted as `Skipped (duplicate)`.

## Import Behavior
- Row-atomic processing:
  - One failed row does not block other rows.
- Append-only:
  - Import never updates/deletes existing rows.
- `--dry-run`:
  - Runs full validation/resolution but does not insert rows.

## Output Summary
The script prints:
- batch id
- csv path
- dry-run status
- total rows
- inserted rows
- duplicate skips
- per-row errors with row number

## Next Phase
- Add image-file existence checks and populate `image_refs`/`option_images`.
- Add explicit difficulty-distribution percentages to exam config (replace temporary equal-split fallback used by runtime allocator).
