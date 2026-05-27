# Options Flow Analyzer

Analyze options chain data with real vs lottery call separation — the key insight that prevents P/C ratio misinterpretation. Uses Polygon.io API for equities and Deribit public market-data endpoints for BTC/ETH crypto options.

## What it does

Standard P/C ratio analysis is misleading. A P/C of 0.35 looks "extremely bullish" but may be 84% lottery calls ($0.01-$0.09 OTM options).

This skill separates:
- **Real calls**: Strike price within 5% of stock price, meaningful premium
- **Lottery calls**: Deep OTM, cheap premium, speculative bets
- **Real puts**: Actual hedging activity
- **Lottery puts**: Cheap downside bets

## Analysis Output

For each ticker:
- Real P/C ratio (excludes lottery noise)
- Lottery percentage (what % of volume is speculation)
- Per-expiry breakdown (weekly vs monthly vs LEAPS)
- Anomaly detection: P/C shifts >0.3, Call OI surges >30%, IV spikes >20%
- Sentiment classification: Bullish/Bearish/Neutral with confidence

## Crypto Options Mode

For BTC and ETH options, use Deribit first because its public endpoints do not require an API key:

1. Fetch instruments:
   `GET https://www.deribit.com/api/v2/public/get_instruments?currency=BTC&kind=option&expired=false`
2. For each target contract, fetch quote/volume summary:
   `GET https://www.deribit.com/api/v2/public/get_book_summary_by_instrument?instrument_name=BTC-28JUN26-83000-C`
3. Fetch `depth=1` order book when delta is needed:
   `GET https://www.deribit.com/api/v2/public/get_order_book?instrument_name=BTC-28JUN26-83000-C&depth=1`

Deribit option prices are BTC/ETH-denominated for inverse options, so convert premium to USD before applying lottery thresholds:

```
premium_usd = mid_price * underlying_price
```

Default crypto lottery-call rule:

- option is a call
- strike is out of the money
- premium is <= $25
- and either:
  - strike is >= 12% OTM, or
  - absolute delta is <= 0.15 when `get_order_book` greeks are available

Keep raw and adjusted data side by side:

- `raw_put_call_ratio = put_volume / total_call_volume`
- `adjusted_put_call_ratio = put_volume / (total_call_volume - lottery_call_volume)`
- `lottery_pct = lottery_call_volume / total_call_volume`

Flag anomalies against the last 30 comparable daily snapshots:

- absolute adjusted P/C shift >= 0.3
- absolute adjusted P/C z-score >= 2
- lottery call volume >= 50%

Use the helper module in this repo for deterministic normalization and baseline checks:

```bash
npx tsx test/crypto-options-flow.test.ts
```

## Configuration

```
Analyze options flow for: AAPL, NVDA, TSLA, AMZN
Separate real vs lottery calls.
Show per-expiry breakdown.
Flag any anomalies in the last 24 hours.
```

## Requirements

- Polygon.io API key (free tier covers basic data; paid tier for full chain)
- Deribit public market-data API for BTC/ETH crypto options (no auth needed)
- WebSearch for cross-verification

## Key Discovery

This real/lottery separation was discovered during live portfolio management when RXRX showed P/C 0.35 (looks extremely bullish) but was actually 84% lottery calls at $0.01-$0.09. The "bullish signal" was noise. This skill prevents that mistake.

## Pricing

Free: Basic P/C ratio for 3 tickers
**Full bundle — $29 one-time**: Real/lottery separation + anomaly detection + per-expiry + unlimited tickers + all other skills
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Built from a real trading mistake that cost money. The real/lottery discovery is documented and battle-tested across 17 tickers over 2+ months.
