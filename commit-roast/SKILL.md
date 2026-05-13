# Commit Roast

A savage but accurate code review of your git commit history. Identifies real problems through the lens of a brutally honest senior engineer.

## What it does

Reads your recent commits and delivers a roast that is 30% comedy, 70% real feedback:

- Calls out vague messages ("fix", "update", "wip", "stuff")
- Flags commit size issues (300-file commits, or 47 commits to change one line)
- Spots patterns: late-night commits, "fix previous fix" chains, whitespace-only changes
- Identifies the commit where you clearly gave up (usually commit 23 of 25 on a Friday)
- Ends with 3 genuine suggestions to improve your commit hygiene

## Example Output

```
Commit Roast — last 30 commits

THE HIGHLIGHTS:

"fix" — May 9, 2:47 AM
  A 47-file commit at 3 AM called "fix." Fix what? Fix everything?
  Fix your sleep schedule? We may never know.

"wip" (x4) — May 10
  Four consecutive WIP commits. You committed "wip" to main.
  To the main branch. Four times.
  This is not a draft. This is a published novel.

"update utils" — May 11
  Updated utils.ts. All 847 lines of it.
  One commit. 847 lines.
  Reviewers saw this and went home early.

"fix previous fix" — May 12
  The ouroboros commit. The fix that ate its own tail.
  The commit that proves the previous commit should not have existed.

WHAT YOU DID WELL:
  - Commits on May 8 were actually good. Specific, scoped, readable.
    "feat(auth): add refresh token rotation with 7-day expiry" — chef's kiss.
  - You rebased before the PR. Respect.

GENUINE FEEDBACK:
  1. Your commit messages average 4 words. Aim for 8-12. Subject + brief why.
  2. Three "wip" commits = one real commit. Squash before pushing.
  3. 2 AM commits average 3x more "fix" commits the next morning. Sleep first.

VERDICT: B-  (was A- before the 3 AM incident)
```

## Usage

```
Roast my last 30 commits.
Be honest about what is bad, but make it funny.
End with 3 real actionable suggestions.
Severity: medium (not mean, not toothless)
```

## Severity modes

**gentle** — Disappointed professor energy. "I expected better."
**medium** — Exasperated senior dev. "We need to talk about your commits."
**savage** — Senior engineer who has seen too much. No mercy, still fair.
**corporate** — Passive-aggressive performance review language. "Opportunities for growth."

## What it actually catches

Beyond the jokes, this skill identifies real commit hygiene problems:

| Pattern | What it means |
|---------|---------------|
| "fix" / "update" / "wip" | No searchable history — future you will hate past you |
| 100+ file commits | Unreviewed blast radius — something will break |
| Fix-the-fix chains | Original design was wrong and got shipped anyway |
| Late night commit spikes | Rushed work that often needs follow-up |
| Identical message repeated | Copy-paste commit workflow |

## Requirements

- Bash tool access (reads `git log`)
- No API keys needed — runs entirely on git history

## Free

Fully free and open source. Part of the **AI Investment Skills Bundle** (the bundle is serious; this skill is for fun).

→ https://github.com/tellmefrankie/news-engine

## Author

Built after reviewing a PR with 47 commits where commit #23 was literally "asd". The roast practically wrote itself.
