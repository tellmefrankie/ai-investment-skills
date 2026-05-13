# Git Standup Generator

Generate a clean daily standup summary from your git commits. No more staring at the blank "what did you do yesterday?" field.

## What it does

- Reads your git log for the last 24 hours (or configurable window)
- Groups commits by repo and type (feat/fix/refactor/docs/chore)
- Generates a standup in your preferred format (bullet list, Slack-ready, Jira-style)
- Flags blocked work and carry-overs automatically
- Strips noise: merge commits, version bumps, auto-generated entries

## Usage

```
Run git standup for today.
Look at commits in the last 24 hours across all repos in ~/Projects.
Group by: what I did, what I'm doing today, any blockers.
Format: 3-bullet standup (Yesterday / Today / Blockers).
Keep it under 150 words total.
```

## Example Output

```
Git Standup — 2026-05-13 (Tue)

YESTERDAY
- Shipped options flow scanner real/lottery split (6 commits, news-engine)
- Fixed ComposioHQ PR CI failure — moved entry alphabetically before CSV Data Summarizer
- Added MIT license to ai-investment-skills for awesome-list compliance

TODAY
- Post-mortem write-up: XLI anomaly methodology
- Review VoltAgent PR #253 feedback
- Start backtest feature scoping

BLOCKERS
- dev.to daily publish limit — 3 articles queued for tomorrow
```

## Configuration

```
Run git standup:
Repos: ~/Projects/news-engine, ~/Projects/ai-investment-skills
Window: last 24 hours
Author: me (use git config user.email)
Format: slack  # options: bullet | slack | jira | plain
Include: feat, fix, refactor
Exclude: chore, merge commits, version bumps
Max length: 150 words
```

## Formats

**Bullet** (default): Clean 3-section list
**Slack**: Prefixed with `:white_check_mark:` / `:hammer:` / `:red_circle:`
**Jira**: Extracts ticket numbers from commit messages (e.g. `PROJ-123`)
**Plain**: Flat chronological list, good for email

## Why this beats `git log --oneline`

Raw git log is noisy. This skill:
- Deduplicates related commits into one line
- Infers intent from commit message prefixes
- Separates "done" from "in progress" (unmerged branches = in progress)
- Generates human-readable phrasing, not commit hash soup

## Requirements

- Bash tool access (runs `git log` internally)
- Works with any git repo — no special setup

## Free

This skill is fully free and open source.

Part of the **AI Investment Skills Bundle** — $29 one-time for the full investment analysis suite.
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Built because standup prep was taking 5 minutes every morning for something that should take 5 seconds.
