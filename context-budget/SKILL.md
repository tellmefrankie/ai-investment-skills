# Context Budget Tracker

Know how much context window you have left before Claude loses memory mid-task. Stop getting surprised by truncation on long coding sessions.

## The problem

You are 90 minutes into a refactor. Claude has read 15 files, written 400 lines, discussed 3 design decisions. Then it starts forgetting things from the beginning of the conversation. You did not know you were near the limit. Now you are.

This skill tracks your context budget and warns you before it runs out.

## What it does

- Estimates tokens used so far in the current session
- Shows remaining budget as a percentage
- Recommends when to checkpoint (summarize + start fresh)
- Identifies which parts of context are most expensive (large file reads, long outputs)
- Suggests what to prune if you need to extend the session

## Usage

```
Check my context budget.
Estimate tokens used in this session.
Show: used, remaining, percentage, biggest consumers.
Warn me if I am past 70%.
```

## Example Output

```
Context Budget — Current Session

Model: claude-opus-4-6 (200k token window)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USAGE ESTIMATE
  Used:       142,000 tokens  (71%)
  Remaining:   58,000 tokens  (29%)
  Status:     YELLOW — consider checkpointing soon

TOP CONSUMERS
  src/options/analyzer.ts     ~18,000 tokens  (full file read x2)
  src/db/schema.ts            ~12,000 tokens  (full file read)
  Conversation history        ~45,000 tokens  (90 messages)
  Code outputs generated      ~38,000 tokens  (4 large code blocks)
  Tool results                ~29,000 tokens  (15 Bash + 8 Read calls)

RECOMMENDATIONS
  You have ~2-3 more large file reads before hitting 90%.

  If you need to continue this session:
  → Ask me to summarize decisions made so far (saves ~30k tokens)
  → Avoid re-reading files already discussed

  If starting fresh:
  → I can write a CHECKPOINT.md with full context to paste into next session
```

## Checkpoint mode

When you are near the limit, this skill can generate a `CHECKPOINT.md`:

```
Generate a checkpoint for this session.
Include: what we were building, decisions made, files changed, next steps.
Keep it under 2000 words so it fits in a fresh context window.
```

Output:
```markdown
# Session Checkpoint — 2026-05-13 23:14

## What we were building
Refactoring the options scanner to separate real vs lottery calls.
The core insight: options with premium < $0.10 are speculative noise...

## Key decisions
1. Threshold: premium < $0.10 OR delta < 0.05 = lottery
2. Adjusted P/C computed on real volume only, not total OI
3. Anomaly detection baseline unchanged — runs on adjusted ratio

## Files changed
- src/options/analyzer.ts — splitRealVsLottery() added
- src/types/index.ts — LotteryMetrics type added
- tests/options.test.ts — 4 new test cases

## Next steps
- [ ] Add per-expiry breakdown (weekly vs monthly vs LEAPS)
- [ ] Test RXRX edge case: what if ALL options are lottery?
- [ ] PR description needs risk assessment section

## Key context to preserve
The RXRX case: P/C 0.38 raw → 2.37 adjusted. Signal completely inverted.
This is the core motivation for the whole feature.
```

Paste this at the start of your next session and pick up exactly where you left off.

## Budget tiers

| Usage | Status | Recommendation |
|-------|--------|----------------|
| 0-50% | GREEN | No action needed |
| 50-70% | YELLOW | Start planning checkpoint |
| 70-85% | ORANGE | Checkpoint recommended |
| 85-95% | RED | Checkpoint now, fresh session for next task |
| 95%+ | CRITICAL | Summarize immediately |

## Why this matters

Claude Code sessions fail gracefully — the model does not crash. But degraded context means:
- Forgetting early decisions → contradicting itself later
- Losing track of file structure already read
- Repeating tool calls for files already in context
- Subtle bugs from incomplete information

A checkpoint every 60-70% of budget prevents all of these.

## Requirements

- Works with any Claude model (context window varies: Haiku 200k, Sonnet 200k, Opus 200k / 1M)
- No API keys needed — estimates based on conversation structure
- Token estimates are approximate (±15%) — treat as guidance, not precision

## Free

Fully free and open source.

→ https://github.com/tellmefrankie/news-engine

## Author

Built after losing 45 minutes of work when Claude forgot the first half of a refactor session. The checkpoint system saved 3 sessions in the first week of use.
