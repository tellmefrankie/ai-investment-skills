# Expected Value Calculator (Free)

Calculate expected value for stock positions using scenario-based modeling. Combines options data, earnings history, and short interest.

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
- AAPL: 100 shares @ $175, stop-loss $165
- NVDA: 50 shares @ $120, stop-loss $105

Use 3 scenarios (bull/base/bear) with probabilities.
Include confidence level and data quality assessment.
```

## Output

Per position:
- Current price, position value
- 3 scenarios with probability and return %
- Weighted expected value ($)
- Weighted expected return (%)
- Confidence: HIGH/MEDIUM/LOW
- Data quality: which inputs were available vs estimated

## Pro Version

Free version uses basic scenario modeling.
Pro adds: Polygon.io options data integration, real/lottery separation, per-expiry analysis, anomaly detection.

## Author

Production EV engine used daily for real portfolio decisions across 6+ positions.
