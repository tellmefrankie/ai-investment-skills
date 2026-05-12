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

**[Get the Pro Bundle on Gumroad ($29)](https://jaehyunpark.gumroad.com/l/tcyahy)**

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
