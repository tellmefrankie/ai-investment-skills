# Price Monitor & Alert Agent

Real-time stock price monitoring with configurable stop-loss, take-profit alerts, and market hours awareness. Sends alerts via Telegram.

## What it does

- Monitors stock prices during market hours (pre-market, regular, after-hours)
- Triggers alerts when stop-loss or take-profit levels are hit
- 30-minute cooldown deduplication (no alert spam)
- Automatic market hours detection (skips weekends/closed hours)
- Telegram bot integration for instant mobile alerts

## Configuration

```
Monitor these positions:
- AAPL: stop-loss $170, take-profit $200
- NVDA: stop-loss $110, take-profit $150
- TSLA: stop-loss $230, take-profit $300

Alert me via Telegram. Check every 5 minutes during market hours.
```

## Features

- Pre-market (4:00-9:30 ET), Regular (9:30-16:00), After-hours (16:00-20:00)
- Price fetch via Yahoo Finance API (free, no API key needed)
- Alert format includes: ticker, current price, trigger level, % distance, action recommendation
- Cooldown prevents duplicate alerts within 30 minutes

## Requirements

- Bash tool access (for running the monitor script)
- Telegram bot token and chat ID (for alerts)

## Pricing

Free: Monitor up to 3 tickers (included in GitHub repo)
**Full bundle — $29 one-time**: Unlimited tickers + options flow alerts + all investment skills
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Production-tested monitoring system that caught real stop-loss triggers ($TEM $47.44, $IREN $50 support) and prevented losses.
