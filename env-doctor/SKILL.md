# Env Doctor

Diagnose your `.env` file before deployment. Catches the configuration bugs that only show up in production at 2 AM.

## What it does

- Compares `.env` against `.env.example` — finds missing vars
- Detects placeholder values never replaced (`...`, `your-key-here`, `sk-ant-XXXX`)
- Flags secrets that look wrong (wrong prefix, wrong length, wrong format)
- Checks for common mistakes: trailing spaces, Windows line endings, BOM markers
- Warns about vars that exist in `.env` but not in `.env.example` (undocumented secrets)
- Validates known API key formats (Anthropic, OpenAI, Stripe, Polygon, Telegram)

## Usage

```
Run env doctor on this project.
Compare .env against .env.example.
Check for: missing vars, placeholder values, format issues, undocumented secrets.
```

## Example Output

```
Env Doctor — 2026-05-13

MISSING VARS (in .env.example but not in .env)
  POLYGON_API_KEY          — required for options scanner
  NAVER_CLIENT_SECRET      — required for Korean news feed

PLACEHOLDER VALUES (never replaced)
  TWITTER_BEARER_TOKEN = "..."        — still default
  TWITTER_API_KEY = "..."             — still default

FORMAT WARNINGS
  ANTHROPIC_API_KEY = "sk-ant-api03-..."
    OK: correct prefix, length looks right

  TELEGRAM_BOT_TOKEN = "1234567890:ABC..."
    OK: correct format (number:hash)

  POLYGON_API_KEY = ""
    WARN: empty string — key exists but has no value

UNDOCUMENTED SECRETS (in .env but not in .env.example)
  DEVTO_API_KEY            — consider adding to .env.example with placeholder

ENCODING ISSUES
  None found (UTF-8, Unix line endings)

SUMMARY
  2 missing required vars
  2 placeholder vars not replaced
  1 undocumented secret
  0 encoding issues

Run: cp .env.example .env.local and fill in missing values
```

## Validated API key formats

| Service | Expected format | Example |
|---------|----------------|---------|
| Anthropic | `sk-ant-api03-...` | 50+ chars |
| OpenAI | `sk-proj-...` or `sk-...` | 51 chars |
| Stripe | `sk_live_...` or `sk_test_...` | 32+ chars |
| Polygon.io | alphanumeric, 32 chars | |
| Telegram Bot | `{number}:{hash}` | `1234567890:ABC...` |
| dev.to | alphanumeric, 20 chars | |

## Configuration

```
Run env doctor:
Files: .env vs .env.example
Check format: ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN, POLYGON_API_KEY
Required vars: ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID
Warn if any var contains: "...", "your-", "xxx", "test", "placeholder"
```

## Common catches

**The classic**: `ANTHROPIC_API_KEY=sk-ant-XXXX` — copied from docs, never replaced

**The silent fail**: `DATABASE_URL= ` — trailing space means the var is a single space, not empty. Some parsers treat this as set.

**The Windows trap**: `.env` edited on Windows has `\r\n` line endings. Some Node.js dotenv parsers include the `\r` in the value. `"mypassword\r"` is not `"mypassword"`.

**The gitignore miss**: `.env.production` not in `.gitignore`. Happens when someone adds a new env file variant.

## Requirements

- Read tool access (reads `.env` and `.env.example`)
- No API keys needed — pure text analysis

## Free

Fully free and open source.

→ https://github.com/tellmefrankie/news-engine

## Author

Built after a production deploy failed because `TELEGRAM_BOT_TOKEN` was still `"..."` in the production `.env`. The env doctor would have caught it in 2 seconds.
