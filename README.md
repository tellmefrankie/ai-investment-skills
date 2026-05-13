# AI Investment Skills for Claude Code

Six Claude Code skills for individual investors. Options flow scanner, stop-loss monitor, earnings risk check, sector rotation signal, real-vs-lottery position classifier, and 9-wave morning briefing.

Built from 6+ months of live portfolio management. Not demos — these run every morning on a real account.

---

## What it caught last week

```
Options Flow Summary — 2026-05-13

SPY  P/C: 0.44   [EXTREME BULLISH]
QQQ  P/C: 0.54   [BULLISH]
XLI  P/C: 5.32   [OUTLIER — INSTITUTIONAL HEDGE SIGNAL]  ← this one
CEG  P/C: 1.06   raw → looks neutral
     adjusted: 59.2   [EXTREME BEARISH] after stripping 98.4% lottery calls
```

XLI at 5.32 means someone bought roughly 5 puts for every 1 call on the entire US industrial sector — while the broad market was pricing in upside. CEG looked neutral until the lottery filter ran. Without filtering, that's a false buy signal.

**[Full writeup →](https://dev.to/tellmefrankie/when-the-market-whispers-through-sector-etfs-the-xli-pc-532-signal-14l8)**

---

## Skills

### Free (clone and use immediately)

| Skill | What it does |
|-------|-------------|
| [EV Calculator](./ev-calculator/) | Probability-weighted bull/base/bear scenario analysis for positions |
| [News Sentiment Engine](./news-sentiment-engine/) | RSS-based AI/tech news with sentiment scoring, delivered to Telegram |

### Pro Bundle — $29 one-time

| Skill | What it does |
|-------|-------------|
| [Options Flow Analyzer](./options-flow-analyzer/) | P/C ratio scanner with lottery-call filter — catches signals raw ratios miss |
| [Investment Briefing Agent](./investment-briefing-agent/) | 9-wave morning analysis: macro → sector → technicals → news → critic → simulation |
| [Price Monitor & Alert](./price-monitor-alert/) | Stop-loss/take-profit monitoring with Telegram alerts under 2 seconds |
| [Multi-Agent Orchestrator](./multi-agent-orchestrator/) | Parallel agent teams with built-in quality harness |

**[Get the Pro Bundle ($29) →](https://jaehyunpark.gumroad.com/l/tcyahy)**

The free skills show you the architecture. The pro bundle is what I run every trading day.

---

## Why the lottery filter matters

Raw put/call ratios are broken for tickers with high retail options activity.

CEG last week: raw P/C of 1.06 (neutral). After stripping 98.4% lottery calls — contracts with delta < 0.15 and premium < $0.10 — the adjusted ratio was 59.2 (extreme bearish). The "neutral" signal was institutions selling premium into retail lottery-buying. Without the filter, you read it as a hold. With the filter, you see what institutions were actually doing.

RXRX showed the same pattern in reverse: raw P/C 0.38 (extreme bullish), but 98.2% lottery calls. Adjusted: 2.14 (mildly bearish). A scanner without filtering would have flagged RXRX as a strong buy. It wasn't.

**[Full explanation of the filter →](https://dev.to/tellmefrankie/98-of-these-call-options-are-lottery-tickets-heres-how-to-filter-them-18f9)**

---

## Live output examples

### Morning briefing (9-wave)

```
[2026-05-13 06:00 KST] Investment Briefing — Wave Summary

Wave 1 (Macro):     Rates flat, dollar soft. Modest risk-on.
Wave 2 (Sector):    Tech leading. Industrials lagging — XLI hedge signal persistent.
Wave 3 (Technical): SPY above 50-day. IWM at resistance.
Wave 4 (News):      No material catalysts. Fed speakers today.
Wave 5 (Critique):  Bullish case assumes no macro deterioration. Watch jobs Friday.
Wave 6 (Simulation): If XLI hedge resolves bearish: reduce cyclical 10-15%.
...
Consensus: Hold current allocation. Flag XLI for session 3 monitoring.
```

### Price monitor alert

```
[ALERT] TEM — Stop-loss triggered
Price: $47.13  |  Threshold: $47.50
Time: 09:34 KST  |  Session: Day 3

Action: Review position sizing. Exit if conviction unchanged.
```

---

## Installation

```bash
# Free skills
cp ev-calculator/SKILL.md ~/.claude/skills/ev-calculator.md
cp news-sentiment-engine/SKILL.md ~/.claude/skills/news-sentiment-engine.md

# Pro bundle — download from Gumroad, then:
cp options-flow-analyzer/SKILL.md ~/.claude/skills/options-flow-analyzer.md
# ... repeat for each skill
```

Works with Claude Code 1.0+, Cursor, Codex CLI, Gemini CLI — any agent supporting the SKILL.md standard.

---

## Follow along

**[Options Anomaly Weekly](https://options-anomaly.substack.com)** — every Monday, the top 3 scanner signals with interpretation. Free.

**[GitHub Discussions](https://github.com/tellmefrankie/ai-investment-skills/discussions)** — sharing live scanner output and answering questions.

---

## Author

[@tellmefrankie](https://github.com/tellmefrankie) — running this system daily on a real portfolio.

## License

MIT

---

[![GitHub stars](https://img.shields.io/github/stars/tellmefrankie/ai-investment-skills?style=social)](https://github.com/tellmefrankie/ai-investment-skills/stargazers)
