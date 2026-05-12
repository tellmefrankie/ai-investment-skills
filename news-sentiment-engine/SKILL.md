# News Sentiment Engine (Free)

Collect and analyze AI/tech news from multiple sources with Claude-powered sentiment analysis. Open source lite version.

## What it does

- Collects news from 4+ RSS feeds (TechCrunch, The Verge, Ars Technica, Hacker News)
- Deduplicates articles across sources
- Ranks by importance (industry impact, technology trends, policy changes)
- Generates Korean summary with sentiment tags
- Outputs formatted briefing card

## Usage

```
Collect latest AI/tech news from RSS feeds.
Rank top 5 by importance to the tech industry.
For each: Korean summary (2-3 sentences), sentiment (positive/negative/neutral), impact score (1-5), industry tags.
```

## Output Format

For each article:
- Title + source + publish date
- Korean summary (2-3 sentences)
- Industry tags: [AI, Semiconductor, Cloud, etc.]
- Sentiment: Positive/Negative/Neutral
- Impact score: 1-5
- Commentary: 1-sentence industry perspective

## Pro Version

The free version covers news collection and basic analysis.

For investment-grade analysis (portfolio impact, options flow correlation, earnings catalyst detection), check out the Investment Briefing Agent Pro.

## Author

Core module from a production news analysis engine processing 50+ articles daily since 2026.
