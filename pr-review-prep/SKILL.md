# PR Review Prep

Generate a complete pull request description from your git diff. Includes summary, test plan, risk assessment, and reviewer notes — in under 10 seconds.

## What it does

- Reads `git diff main...HEAD` (or any branch pair)
- Classifies changes: new feature, bug fix, refactor, dependency update, config change
- Writes PR title (under 70 chars), summary bullets, test plan checklist
- Flags risk areas: database migrations, auth changes, public API surface changes
- Identifies files that need extra reviewer attention
- Optionally creates the PR via `gh pr create`

## Usage

```
Prepare my PR description.
Branch: feat/options-flow-lottery-filter vs main
Include: summary, what changed, test plan, risk level, files to review carefully.
Format for GitHub PR body (markdown).
```

## Example Output

```
## Summary

- Add real/lottery call separation to options flow analyzer
- Lottery threshold: premium < $0.10 OR delta < 0.05
- Adjusted P/C ratio now excludes lottery volume before sentiment classification
- Anomaly detection baseline unchanged; now runs on adjusted ratio

## What changed

**Core logic** (`src/options/analyzer.ts`)
- `splitRealVsLottery()` — new function, filters options by premium + delta thresholds
- `computeAdjustedPC()` — replaces raw P/C with filtered ratio
- Sentiment thresholds unchanged (< 0.45 = bullish, > 1.5 = bearish)

**Types** (`src/types/index.ts`)
- Added `LotteryMetrics` type: `{ lotteryPct, realCallOI, realPutOI }`

**Tests** (`tests/options.test.ts`)
- 4 new test cases: RXRX 84% lottery inversion, KTOS clean signal, edge cases

## Test Plan

- [ ] Run `pnpm test` — all existing tests pass
- [ ] Manual: run analyzer on RXRX — confirm adj P/C ≠ raw P/C when lottery > 50%
- [ ] Manual: run on KTOS — confirm adj P/C close to raw when lottery < 30%
- [ ] Check Polygon API error handling still works (mock API key test)

## Risk Assessment

Risk level: LOW

- No DB schema changes
- No public API surface changes
- Additive only — raw P/C still computed, adj P/C is additional field
- Backward compatible with existing callers

## Files needing careful review

- `src/options/analyzer.ts` — core logic change, review threshold values
- `src/types/index.ts` — new type, ensure downstream consumers updated
```

## Configuration

```
Prep my PR:
Base branch: main
Head branch: current (auto-detect)
Style: github  # options: github | gitlab | linear | jira
Risk scan: true  # flag auth, migrations, API changes
Create PR: false  # set true to auto-create via gh CLI
Reviewers: @teammate1, @teammate2
```

## Why not just write it manually?

The description above took 8 minutes to write manually. This skill generates it in 8 seconds and catches the risk flags you forget when you're rushing to ship.

Reviewers merge faster when they understand the change. Better descriptions = shorter review cycles.

## Requirements

- Bash tool access (runs `git diff`, `git log`)
- `gh` CLI installed (optional, for auto-create)

## Free

Fully free and open source.

Part of the **AI Investment Skills Bundle** — $29 one-time.
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Built after submitting a PR with "fixes stuff" as the description and getting it stuck in review for 3 days.
