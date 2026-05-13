# Claude API Cost Tracker

Track your Anthropic API spend by project, model, and task type. Know exactly what each feature costs before it ships.

## What it does

- Pulls usage data from Anthropic API billing endpoint
- Breaks down cost by: project, model (Opus/Sonnet/Haiku), date range
- Flags expensive operations (prompts > $0.10 per call)
- Projects monthly spend from current daily burn rate
- Identifies which tasks are best candidates for model downgrade (Opus → Sonnet)

## Usage

```
Check my Claude API costs for this week.
Break down by: model, project tag, daily trend.
Flag any single calls over $0.05.
Project monthly spend at current rate.
Suggest which tasks could switch from Opus to Sonnet without quality loss.
```

## Example Output

```
Claude API Cost Report — Week of May 13, 2026

TOTAL THIS WEEK: $4.23
  Opus 4.5:    $3.10  (73%)  — news analysis pipeline
  Sonnet 4.5:  $0.89  (21%)  — investment briefing
  Haiku 4.5:   $0.24   (6%)  — price monitor checks

DAILY BURN: $0.60/day
MONTHLY PROJECTION: ~$18/month

TOP EXPENSIVE CALLS (this week):
  $0.14 — filter.ts:45 — 50-article importance ranking prompt
  $0.09 — analyze.ts:88 — per-article deep analysis (x5 articles)
  $0.04 — briefing.ts:12 — portfolio summary generation

OPTIMIZATION SUGGESTIONS:
  filter.ts ranking prompt: Switch to Sonnet — saves ~$0.06/day ($1.80/month)
  Confidence: HIGH — filtering is structured JSON output, not nuanced reasoning

  price monitor heartbeat: Already on Haiku — optimal
```

## Model Downgrade Analysis

The skill evaluates each prompt type against downgrade criteria:

| Task type | Opus needed? | Recommendation |
|-----------|-------------|----------------|
| Structured JSON extraction | No | → Sonnet |
| Importance ranking (1-5) | No | → Haiku |
| Nuanced sentiment analysis | Yes | Keep Opus |
| Code generation | Situational | Test Sonnet first |
| Multi-step reasoning chains | Yes | Keep Opus |

## Configuration

```
Track Claude costs:
API key: (reads from ANTHROPIC_API_KEY env)
Date range: last 7 days
Group by: model, then by file/prompt tag
Budget alert: warn if projected monthly > $30
Downgrade candidates: flag any Opus task where Sonnet could substitute
```

## Requirements

- `ANTHROPIC_API_KEY` in environment
- Anthropic usage API access (available on all paid plans)

## Free

Fully free and open source.

Part of the **AI Investment Skills Bundle** — $29 one-time.
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Built after an Opus pipeline ran overnight and cost $12 for something Sonnet would have handled at $2. The downgrade analysis alone pays for itself in the first month.
