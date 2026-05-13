# Growth Tracker (Free)

Track your indie product's traction across GitHub, dev.to, and Gumroad in one snapshot. Zero manual dashboards.

## What it does

Pulls live metrics from public APIs and your own API keys:

- **GitHub**: stars, forks, watchers, open issues, traffic (views/clones via API)
- **dev.to**: per-article views, reactions, comments — totals and per-post breakdown
- **Gumroad**: sales count, revenue, conversion rate (requires Gumroad API token)
- **Calculated**: day-over-day changes, best-performing content, funnel drop-off

Outputs a structured snapshot you can save to a file or paste into a standup.

## Usage

```
Run a growth snapshot for my indie product.

GitHub repo: tellmefrankie/ai-investment-skills
dev.to username: tellmefrankie
Gumroad product slug: tcyahy (optional — skip if no API token)

Show:
1. Current numbers (stars, views, sales)
2. What changed since yesterday (if I have a previous snapshot to compare)
3. Top-performing content piece
4. Biggest gap in the funnel (traffic vs conversion)
```

## Example Output

```
=== Growth Snapshot — 2026-05-14 ===

GITHUB  tellmefrankie/ai-investment-skills
  Stars:    3  (+1 today)
  Forks:    0
  Watchers: 1
  Topics:   20

DEV.TO  tellmefrankie
  Published: 12 articles
  Total views: 847  (+60 today)
  Reactions:   4  (+2 today)
  Top article: "XLI options hit a 5.32 put/call ratio" — 412 views

GUMROAD  (API token not set — skipped)

FUNNEL
  dev.to views → GitHub clicks: ~8% CTR (estimated)
  GitHub visitors → Gumroad: unknown (no Gumroad data)
  Gumroad → Purchase: unknown

RECOMMENDATION
  Bottleneck is likely dev.to → GitHub. Add GitHub link to first paragraph
  of top 3 articles. XLI article has 412 views but GitHub has 3 stars.
```

## Setup (optional for Gumroad)

For Gumroad tracking, set environment variable:
```
GUMROAD_ACCESS_TOKEN=your_token_here
```

Get token: Gumroad Dashboard → Settings → Advanced → Access Token

For GitHub traffic API (views/clones), requires authenticated requests:
```
GITHUB_TOKEN=your_github_pat
```

Everything else works without API keys (public data).

## Save snapshots

```
Run growth snapshot and save to content/growth-YYYY-MM-DD.json
Compare with yesterday's snapshot if it exists.
```

Saves a JSON file you can track over time:
```json
{
  "date": "2026-05-14",
  "github": { "stars": 3, "forks": 0 },
  "devto": { "articles": 12, "total_views": 847, "reactions": 4 },
  "gumroad": { "sales": 0, "revenue_usd": 0 },
  "top_content": "XLI options hit a 5.32 put/call ratio"
}
```

## Why this exists

Built after spending too much time manually checking GitHub, dev.to analytics, and Gumroad separately every morning. One prompt now gives the full picture.

## Free — no bundle required

This skill is fully free. No paid APIs needed for GitHub + dev.to tracking.

Gumroad integration is also free — just requires your own API token.
