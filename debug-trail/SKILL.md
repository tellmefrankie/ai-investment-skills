# Debug Trail

Automatically document your debugging session as you go. When the bug is fixed, you have a complete trail: what you tried, what you learned, what solved it.

## The problem

You spend 3 hours debugging. You find the fix. Your manager asks you to write it up. You stare at the blank Confluence page and try to remember what you tried 2 hours ago.

Or worse: the same bug comes back in 3 months and you have to debug it again from scratch.

## What it does

At the start of a debugging session, activate this skill. As you work, it tracks:

- Each hypothesis you formed and tested
- Commands run and their output
- Files examined and what you found
- Dead ends (just as important as the solution)
- The actual root cause and fix

At the end: structured bug report, ready to paste anywhere.

## Usage

**Start of session:**
```
Start debug trail for: TypeScript type error in options/analyzer.ts line 247
Error: Type 'string' is not assignable to type '"rising" | "falling" | "stable"'
```

**During session** — the skill tracks your work automatically as you run commands and read files.

**End of session:**
```
Close debug trail. Write up the full report.
```

## Example Report Output

```
# Debug Trail — TS2322 lottery_trend Type Error
Date: 2026-05-13 | Duration: 23 minutes | Status: RESOLVED

## The Bug
File: src/options/weekly-anomaly-report.ts:24
Error: Type 'string' is not assignable to type '"rising" | "falling" | "stable"'

## Root Cause
TypeScript's type narrowing failed on the ternary expression:
  const trend = last - first > 20 ? 'rising' : last - first < -20 ? 'falling' : 'stable'

TypeScript inferred `trend` as `string` (widened from string literals).
The TickerWeekly interface expected the literal union type.

## What I Tried

[DEAD END] Tried casting: `trend as 'rising' | 'falling' | 'stable'`
  → Works but is unsafe — type assertion, not type inference

[DEAD END] Tried `as const` on the ternary
  → Syntax error — as const only works on object/array literals

[SOLUTION] Explicit type annotation on the variable:
  const trend: 'rising' | 'falling' | 'stable' = ...
  → TypeScript now validates the ternary against the declared type

## Files Changed
- src/options/weekly-anomaly-report.ts:24 — added explicit type annotation

## Lesson Learned
When TypeScript widens string literal ternaries to `string`, add explicit
type annotation rather than casting. The annotation lets TS validate, the
cast just suppresses the error.

## Commands Run
- npx tsc --noEmit  (initial discovery)
- npx tsc --noEmit  (verification after fix)
```

## Why dead ends matter

Most bug reports only document the solution. That is only half the value.

The dead ends are what prevent the next person from trying the same wrong approaches. A 3-hour debug session with 2 hours of dead ends is more valuable to document than just the 1 hour that worked.

## Formats

**markdown** (default): Full structured report, paste into any doc tool

**jira**: Structured for Jira bug ticket description

**slack**: Compressed summary for #dev-incidents channel

**gist**: Ready to `gh gist create` directly

```
Close debug trail. Format: gist. Create it with gh CLI.
```

## Session commands

```
Start debug trail: [bug description]    — begin tracking
Hypothesis: [what I think is wrong]    — log a hypothesis
Tried: [what I just did]               — log an attempt
Dead end: [why this did not work]      — log a failure
Found: [what I discovered]             — log a discovery
Close debug trail                      — generate report
```

## Requirements

- Bash tool access (for command tracking)
- No API keys needed

## Free

Fully free and open source.

→ https://github.com/tellmefrankie/news-engine

## Author

Built after spending 4 hours on a bug, fixing it, and then having no record of what I tried. Three months later, the same bug appeared. Debugged it in 20 minutes because I had the trail from the first time.
