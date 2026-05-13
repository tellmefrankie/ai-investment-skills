# Investment Briefing Agent

A battle-tested multi-wave investment briefing system that generates comprehensive market analysis using real-time data. Built from 6+ months of live portfolio management experience.

## What it does

Runs a 9-wave analysis pipeline to produce institutional-grade investment briefings:

1. **Macro Analysis** — S&P 500, Nasdaq, VIX, yields, oil, DXY, Fed signals
2. **Sector Rotation** — All 11 S&P sectors, identify leaders/laggards
3. **Technical Scanner** — RSI, SMA (20/50/200), MACD, support/resistance for each holding
4. **News Sweep** — 48h news, earnings, analyst changes, insider activity per ticker
5. **Opportunity Finder** — New swing trade candidates ranked by expected value
6. **Critic Review** — Adversarial review of all signals, counter-evidence search
7. **Portfolio Simulation** — Scenario modeling (bull/base/bear) with probabilities
8. **Deep Connections** — Cross-asset correlations, hidden relationships
9. **Meta-Critic** — Final synthesis and action plan

## Anti-Narrative Harness (Built-in)

Every analysis enforces these rules automatically:
- No narrative repetition — each run uses fresh data
- Numbers over narratives — "P/C 0.55, real call 28%" not "bullish"
- Cross-verification required — 2+ sources for any price/claim
- Sell checklist — no panic sells, check if bottom, verify with critic

## Configuration

Set your portfolio in the prompt:

```
Run investment briefing for my portfolio:
- AAPL: 100 shares @ $175
- NVDA: 50 shares @ $120
- TSLA: 30 shares @ $245

Include macro, sector, technicals, news, and critic review.
Focus on: earnings catalysts, options flow anomalies, sector rotation signals.
```

## Requirements

- WebSearch tool access (for real-time market data)
- Works best with Claude Opus for critic/meta-critic waves

## Pricing

Free tier: Macro + Sector analysis only (waves 1-2)
**Full bundle — $29 one-time**: All 9 waves + Anti-Narrative Harness + all skills below
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Built by a CTO who runs this system daily for real portfolio management. Not a demo — this is production code refined over 6 months of live trading decisions.
