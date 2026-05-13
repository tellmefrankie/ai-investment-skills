# AI Investment Skills for Claude Code

Six Claude Code skills for individual investors — options flow scanner, stop-loss monitor, earnings risk check, sector rotation signal, lottery-call filter, and 9-wave morning briefing.

Built from 6+ months of live portfolio management. Not demos — these run every morning on a real account.

> **[Get the Pro Bundle — $29 one-time →](https://jaehyunpark.gumroad.com/l/tcyahy)**

---

## What it caught last week

```
Options Flow Summary — 2026-05-13

SPY  P/C: 0.44   [EXTREME BULLISH]
QQQ  P/C: 0.54   [BULLISH]
XLI  P/C: 5.32   [OUTLIER — INSTITUTIONAL HEDGE SIGNAL]  <- flagged automatically
CEG  P/C: 1.06   raw -> looks neutral
     adjusted: 59.2   [EXTREME BEARISH] after stripping 98.4% lottery calls
RXRX P/C: 0.38   raw -> extreme bullish
     adjusted: 2.14   [MILDLY BEARISH] after stripping 84% lottery calls
```

XLI at 5.32 = someone bought roughly 5 puts for every 1 call on the entire US industrial sector while the broad market was pricing in upside. RXRX looked like a strong buy until the filter ran — 84% of the call volume was sub-$0.10 lottery tickets.

**[Full writeup: XLI P/C 5.32 ->](https://dev.to/tellmefrankie/when-the-market-whispers-through-sector-etfs-the-xli-pc-532-signal-14l8)**
**[Full writeup: lottery-call filter ->](https://dev.to/tellmefrankie/98-of-these-call-options-are-lottery-tickets-heres-how-to-filter-them-18f9)**

---

## Skills

### Free — clone and use immediately

| Skill | What it does | Key number |
|-------|-------------|------------|
| [EV Calculator](./ev-calculator/) — [Live on Agensi](https://www.agensi.io/skills/ev-calculator-expected-value-stock-analyzer) | Probability-weighted bull/base/bear scenario analysis | 3 scenarios -> 1 decision |
| [News Sentiment Engine](./news-sentiment-engine/) — [Live on Agensi](https://www.agensi.io/skills/news-sentiment-engine-ai-tech-news-analyzer) | 200+ RSS articles scored by ticker/sector, Telegram delivery | 2 hrs reading -> 5 min digest |

### Pro Bundle — $29 one-time

| Skill | What it does | Key number |
|-------|-------------|------------|
| [Options Flow Analyzer](./options-flow-analyzer/) | P/C ratio scanner with lottery-call filter | Caught XLI 5.32, RXRX 84% lottery |
| [Investment Briefing Agent](./investment-briefing-agent/) | 9-wave morning analysis: macro -> sector -> technicals -> news -> critique -> simulation | Full brief in under 5 min |
| [Price Monitor & Alert](./price-monitor-alert/) | Stop-loss/take-profit with Telegram alerts | Alert delivery under 2 seconds |
| [Multi-Agent Orchestrator](./multi-agent-orchestrator/) | Parallel agent teams with built-in quality harness | 4 agents, 1 consensus output |

**[Get the Pro Bundle — $29 ->](https://jaehyunpark.gumroad.com/l/tcyahy)**

The free skills show the architecture. The pro bundle is what runs every trading day.

---

## Why the lottery-call filter matters

Raw put/call ratios are broken for tickers with high retail options activity.

**RXRX last week**: raw P/C 0.38 -> flagged extreme bullish. After stripping 84% lottery calls (delta < 0.15, premium < $0.10): adjusted P/C 2.14 -> mildly bearish. A scanner without filtering would have sent a strong buy signal into a bearish setup.

**CEG last week**: raw P/C 1.06 -> neutral. After stripping 98.4% lottery calls: adjusted P/C 59.2 -> extreme bearish. The "neutral" reading was institutions selling premium into retail lottery-buying.

Without the filter: you read retail noise. With the filter: you see what institutions are doing.

**[Full explanation ->](https://dev.to/tellmefrankie/98-of-these-call-options-are-lottery-tickets-heres-how-to-filter-them-18f9)**

---

## Live output examples

### Options scanner

```
[SCAN] 2026-05-13 -- 23 tickers, 847 contracts

XLI  P/C raw: 5.32  adjusted: 5.31  -> INSTITUTIONAL HEDGE SIGNAL
CEG  P/C raw: 1.06  adjusted: 59.2  -> EXTREME BEARISH (98.4% lottery stripped)
RXRX P/C raw: 0.38  adjusted: 2.14  -> MILDLY BEARISH (84% lottery stripped)
SPY  P/C raw: 0.44  adjusted: 0.44  -> normal
```

### Morning briefing (9-wave)

```
[2026-05-13 06:00 KST] Investment Briefing -- Wave Summary

Wave 1 (Macro):      Rates flat, dollar soft. Modest risk-on.
Wave 2 (Sector):     Tech leading. Industrials lagging -- XLI hedge signal persistent.
Wave 3 (Technical):  SPY above 50-day. IWM at resistance.
Wave 4 (News):       No material catalysts. Fed speakers today.
Wave 5 (Critique):   Bullish case assumes no macro deterioration. Watch jobs Friday.
Wave 6 (Simulation): If XLI hedge resolves bearish: reduce cyclical 10-15%.
...
Consensus: Hold current allocation. Flag XLI for session 3 monitoring.
```

### Price monitor alert

```
[ALERT] TEM -- Stop-loss triggered
Price: $47.13  |  Threshold: $47.50
Time: 09:34 KST  |  Alert delivered: 1.8s

Action: Review position sizing. Exit if conviction unchanged.
```

---

## Installation

```bash
# Free skills
cp ev-calculator/SKILL.md ~/.claude/skills/ev-calculator.md
cp news-sentiment-engine/SKILL.md ~/.claude/skills/news-sentiment-engine.md

# Pro bundle -- download from Gumroad, then:
cp options-flow-analyzer/SKILL.md ~/.claude/skills/options-flow-analyzer.md
cp investment-briefing-agent/SKILL.md ~/.claude/skills/investment-briefing-agent.md
cp price-monitor-alert/SKILL.md ~/.claude/skills/price-monitor-alert.md
cp multi-agent-orchestrator/SKILL.md ~/.claude/skills/multi-agent-orchestrator.md
```

Works with Claude Code, Cursor, Codex CLI, Gemini CLI — any agent supporting the SKILL.md standard.

---

## dev.to series: Building in Public

Real results from running these skills on a live portfolio.

- [XLI P/C hit 5.32 — what my scanner found (and why I didn't trade it)](https://dev.to/tellmefrankie/when-the-market-whispers-through-sector-etfs-the-xli-pc-532-signal-14l8)
- [98% of these call options are lottery tickets. Here's how to filter them.](https://dev.to/tellmefrankie/98-of-these-call-options-are-lottery-tickets-heres-how-to-filter-them-18f9)
- [I replaced my marketing stack with 200 lines of Node.js and Claude. Cost: $3.50/month.](https://dev.to/tellmefrankie/how-i-built-a-247-ai-growth-engine-with-claude-code-no-devops-required-1hhc)
- [Full series ->](https://dev.to/tellmefrankie)

---

## Follow along

**[Options Anomaly Weekly](https://options-anomaly.substack.com)** — every Monday, the top 3 scanner signals with interpretation. Free.

**[GitHub Discussions](https://github.com/tellmefrankie/ai-investment-skills/discussions)** — live scanner output and Q&A.

---

## Author

[@tellmefrankie](https://github.com/tellmefrankie) — running this system daily on a real portfolio.

## License

MIT

---

[![GitHub stars](https://img.shields.io/github/stars/tellmefrankie/ai-investment-skills?style=social)](https://github.com/tellmefrankie/ai-investment-skills/stargazers)
