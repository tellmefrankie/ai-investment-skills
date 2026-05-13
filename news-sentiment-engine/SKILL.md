# News Sentiment Engine (Free)

Collect and analyze AI/tech news from multiple sources with Claude-powered sentiment analysis. Ranks by industry impact and outputs a structured briefing card. Open source.

## What it does

- Collects news from 4+ RSS feeds (TechCrunch, The Verge, Ars Technica, Hacker News)
- Deduplicates articles across sources
- Ranks top 5 by industry impact (policy > M&A > technology trend > product launch)
- Generates structured analysis with sentiment, impact score, and commentary
- Outputs a formatted briefing card

## Usage

```
Collect latest AI/tech news from RSS feeds.
Rank top 5 by importance to the tech industry.
For each: summary (2-3 sentences), sentiment (positive/negative/neutral),
impact score (1-5), industry tags, one-sentence commentary.
Output as a structured briefing card.
```

## Example Output

```
📰 AI/Tech News Briefing — 2026-05-13

━━━━━━━━━━━━━━━━━━━━━━━━━

1. OpenAI announces GPT-5 with 2M context window
   Source: TechCrunch | Impact: ⭐⭐⭐⭐⭐ (5/5)
   Tags: #AI #LLM #OpenAI
   Sentiment: 📈 Positive

   Summary: OpenAI unveiled GPT-5 with a 2M token context window and
   improved reasoning. Enterprise pricing starts at $0.03/1k tokens.
   API access begins June 2026 for existing customers.

   Commentary: Direct competitive pressure on Anthropic Claude 3.5.
   Enterprise deals may shift in H2 2026.

━━━━━━━━━━━━━━━━━━━━━━━━━

2. EU AI Act enforcement begins for high-risk systems
   Source: The Verge | Impact: ⭐⭐⭐⭐ (4/5)
   Tags: #Regulation #EU #Compliance
   Sentiment: ⚠️ Neutral

   Summary: The EU AI Act's high-risk system provisions took effect today,
   requiring conformity assessments and human oversight documentation.
   Affects healthcare, hiring, and credit scoring applications.

   Commentary: US companies serving EU customers face compliance burden.
   Legal/compliance AI tools likely to see increased demand.

━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Ranking Criteria

1. **Regulatory / policy** — highest impact, affects industry broadly
2. **M&A / funding** — capital flow signals
3. **Technology breakthrough** — new capability, not incremental update
4. **Market shift** — competitive dynamics change
5. **Product launch** — lowest priority unless from major player

## Setup

```bash
git clone https://github.com/tellmefrankie/news-engine
cd news-engine
pnpm install
cp .env.example .env
# Requires: ANTHROPIC_API_KEY
pnpm dev -- --collect-only
```

No paid APIs required for free tier. Anthropic API key only.

## Pro Version

Free tier covers news collection and basic analysis.

**Full bundle — $29 one-time**: Investment-grade analysis (portfolio impact scoring, options flow correlation, earnings catalyst detection), Korean briefing format, Telegram auto-delivery.
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Core module from a production news analysis engine processing 50+ articles daily. The full pipeline runs on a cron schedule and delivers via Telegram before market open.
