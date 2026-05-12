# AI Investment Skills for Claude Code

Battle-tested Claude Code skills for investment analysis. Built from 6+ months of live portfolio management with real money on the line.

## Skills

### Free

| Skill | Description |
|-------|-------------|
| [EV Calculator](./ev-calculator/) | Calculate expected value for stock positions using probability-weighted bull/base/bear scenarios |
| [News Sentiment Engine](./news-sentiment-engine/) | Collect and analyze AI/tech news from RSS feeds with sentiment scoring |

### Pro Bundle ($29)

| Skill | Description |
|-------|-------------|
| [Investment Briefing Agent](./investment-briefing-agent/) | 9-wave market analysis: macro, sector, technicals, news, critic review, simulation |
| [Price Monitor & Alert](./price-monitor-alert/) | Real-time stop-loss/take-profit monitoring with Telegram alerts |
| [Options Flow Analyzer](./options-flow-analyzer/) | Real vs lottery call separation — prevents P/C ratio misinterpretation |
| [Multi-Agent Orchestrator](./multi-agent-orchestrator/) | Coordinate parallel agent teams with built-in quality harness |

**[Get the Pro Bundle on Gumroad ($29) →](https://jaehyunpark.gumroad.com/l/tcyahy)**

> Free skills show you what's possible. The Pro Bundle is what I actually use to manage a live portfolio every trading day.

## Live Output Examples

### Options Flow Analyzer — real signal detected 2026-05-12

```
Ticker  PCR    Avg IV   Signal
------  -----  -------  ------------------------------------------
XLI     5.32   47.76    ⚠ EXTREME HEDGE — 5x above normal range
IWM     1.70   475.45   ⚠ Defensive positioning
QQQ     0.54   2000.0   ✓ Bullish call skew
SPY     0.44   2000.0   ✓ Bullish call skew
MP      0.88   174.48   ~ Neutral
CEG     1.06   110.26   lottery_pct: 98.4% ← strip lottery calls first
KTOS    0.53   170.10   lottery_pct: 98.2% ← strip lottery calls first

Interpretation: Smart money hedging industrials/small-caps while
holding tech longs. Sector rotation or macro hedge in play.
```

> This signal was caught live. Raw PCR on XLI looked like a typo —
> it wasn't. Without the lottery-call filter, CEG and KTOS would have
> read as neutral (PCR ~1.0). They weren't.

### News Sentiment Engine — sample output

```
[BATCH 2026-05-12] 14 articles analyzed

#1  impact: 9/10  sentiment: BULLISH
    "Anthropic launches financial-services agent platform"
    → Sector tailwind for AI-native investment tools

#2  impact: 7/10  sentiment: BEARISH
    "Fed signals higher-for-longer after CPI beat"
    → Rate-sensitive positioning review needed

#3  impact: 6/10  sentiment: NEUTRAL
    "TSMC beats Q1 but guides Q2 flat on macro uncertainty"
    → Watch semi sector for rotation signal
```

## What makes these different

These are not demos or toy projects. Every skill was refined through real trading decisions:

- **Real vs Lottery discovery**: P/C ratio of 0.35 looks "extremely bullish" but was 84% lottery calls at $0.01-$0.09. This skill prevents that mistake.
- **Anti-Narrative Harness**: Built-in rules that enforce numbers over narratives, cross-verification, and prevent panic selling.
- **9-wave briefing**: Not a single prompt — a coordinated multi-agent pipeline with macro, sector, technicals, news, critic, and simulation waves.

## Installation

```bash
# Free skills — copy SKILL.md to your Claude Code skills directory
mkdir -p ~/.claude/skills
cp ev-calculator/SKILL.md ~/.claude/skills/ev-calculator.md
cp news-sentiment-engine/SKILL.md ~/.claude/skills/news-sentiment-engine.md
```

## Compatibility

Works with Claude Code 1.0+, Cursor, Codex CLI, Gemini CLI, and any agent supporting the SKILL.md standard.

## Author

Built by [@tellmefrankie](https://github.com/tellmefrankie) — CTO running a multi-agent investment system daily.

## License

MIT
