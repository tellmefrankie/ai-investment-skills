# Expected Value Calculator (Free)

Calculate expected value for stock positions using scenario-based modeling. Combines options data, earnings history, and short interest to size positions with mathematical discipline.

## What it does

For each position, builds probability-weighted scenarios:
- **Bull case**: Catalyst-driven upside (earnings beat, sector rotation, short squeeze)
- **Base case**: Normal trading range continuation
- **Bear case**: Downside risks (earnings miss, macro shock, sector rotation out)

Weights scenarios by:
- Options sentiment (real calls vs puts, excluding lottery)
- Historical earnings surprise patterns
- Short interest level and squeeze potential
- Sector momentum

## Usage

```
Calculate expected value for my portfolio:
- RXRX: 500 shares @ $3.26, stop-loss $2.85
- KTOS: 200 shares @ $56.99, stop-loss $52.00
- TEM:  100 shares @ $48.46, stop-loss $49.75

Use 3 scenarios (bull/base/bear) with probabilities.
Include confidence level and data quality assessment.
```

## Example Output

```
=== EV Analysis — 2026-05-13 ===

RXRX  $3.26 | Position: $1,630
  Bull  (30%): $4.80 → +47.2% → EV: +$770
  Base  (45%): $3.40 → +4.3%  → EV: +$63
  Bear  (25%): $2.85 → -12.6% → EV: -$205
  ─────────────────────────────────
  Weighted EV: +$628 (+38.5%)   [HIGH confidence]
  Note: Options P/C 0.38 supports bull case. 84% lottery calls stripped.

KTOS  $56.99 | Position: $11,398
  Bull  (35%): $68.00 → +19.3% → EV: +$770
  Base  (40%): $58.50 → +2.6%  → EV: +$121
  Bear  (25%): $52.00 → -8.8%  → EV: -$249
  ─────────────────────────────────
  Weighted EV: +$642 (+5.6%)    [MEDIUM confidence]
  Note: Sector (defense) momentum positive. IV elevated at 170%.

TEM   $48.46 | Position: $4,846
  Bull  (25%): $56.00 → +15.6% → EV: +$188
  Base  (40%): $49.00 → +1.1%  → EV: +$22
  Bear  (35%): $49.75 → +2.7%  → EV: STOP
  ─────────────────────────────────
  Weighted EV: -$41 (-0.8%)     [LOW confidence]
  ⚠️ BELOW STOP-LOSS — review position
```

## Confidence Levels

- **HIGH**: Multiple confirming signals (options flow + technicals + news)
- **MEDIUM**: 1-2 signals, others neutral or missing
- **LOW**: Conflicting signals or insufficient data

## Pro Version

Free version uses basic scenario modeling with manual probability inputs.

**Full bundle — $29 one-time**: Polygon.io options data integration, real/lottery separation, per-expiry analysis, anomaly detection, automatic probability weighting from live data.
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Production EV engine used daily for real portfolio decisions. The TEM example above is real — the EV turned negative the morning before the stop-loss was hit.
