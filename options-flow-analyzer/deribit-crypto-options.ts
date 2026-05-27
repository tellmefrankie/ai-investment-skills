export type CryptoOptionsCurrency = "BTC" | "ETH";
export type OptionSide = "call" | "put";

export interface DeribitInstrument {
  instrument_name: string;
  base_currency: CryptoOptionsCurrency;
  option_type: OptionSide;
  expiration_timestamp: number;
  strike: number;
  is_active?: boolean;
}

export interface DeribitBookSummary {
  instrument_name: string;
  bid_price?: number | null;
  ask_price?: number | null;
  mark_price?: number | null;
  mid_price?: number | null;
  volume?: number | null;
  open_interest?: number | null;
  mark_iv?: number | null;
  underlying_price?: number | null;
  volume_usd?: number | null;
}

export interface DeribitOrderBook {
  instrument_name: string;
  greeks?: {
    delta?: number | null;
  };
  underlying_price?: number | null;
}

export interface CryptoOptionLeg {
  instrumentName: string;
  currency: CryptoOptionsCurrency;
  expiry: string;
  type: OptionSide;
  strike: number;
  underlyingPrice: number;
  bid: number | null;
  ask: number | null;
  mark: number | null;
  mid: number | null;
  premiumUsd: number | null;
  volume: number;
  openInterest: number;
  markIv: number | null;
  delta: number | null;
  moneynessPct: number;
  outOfMoney: boolean;
  lottery: boolean;
  lotteryReasons: string[];
}

export interface CryptoLotteryThresholds {
  maxAbsDelta: number;
  maxPremiumUsd: number;
  minOutOfMoneyPct: number;
}

export interface BaselinePoint {
  date: string;
  rawPutCallRatio: number | null;
  adjustedPutCallRatio: number | null;
  lotteryPct: number;
}

export interface BaselineStats {
  days: number;
  meanAdjustedPc: number | null;
  stddevAdjustedPc: number | null;
  adjustedPcDelta: number | null;
  adjustedPcZScore: number | null;
}

export interface CryptoOptionsAnalysis {
  currency: CryptoOptionsCurrency;
  totalCallVolume: number;
  totalPutVolume: number;
  nonLotteryCallVolume: number;
  lotteryCallVolume: number;
  lotteryPct: number;
  rawPutCallRatio: number | null;
  adjustedPutCallRatio: number | null;
  signal: "bullish" | "mild_bullish" | "neutral" | "bearish" | "extreme_bearish" | "insufficient_data";
  perExpiry: Array<{
    expiry: string;
    callVolume: number;
    putVolume: number;
    lotteryCallVolume: number;
    adjustedPutCallRatio: number | null;
  }>;
  baseline: BaselineStats | null;
  anomalyFlags: string[];
}

export const DEFAULT_CRYPTO_LOTTERY_THRESHOLDS: CryptoLotteryThresholds = {
  maxAbsDelta: 0.15,
  maxPremiumUsd: 25,
  minOutOfMoneyPct: 12,
};

export function deribitPublicUrl(method: string, params: Record<string, string | number | boolean>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    query.set(key, String(value));
  }
  return `https://www.deribit.com/api/v2/public/${method}?${query.toString()}`;
}

export async function fetchDeribitInstruments(
  currency: CryptoOptionsCurrency,
  fetcher: typeof fetch = fetch,
): Promise<DeribitInstrument[]> {
  const url = deribitPublicUrl("get_instruments", {
    currency,
    kind: "option",
    expired: false,
  });
  const json = await fetchDeribitJson<{ result: DeribitInstrument[] }>(url, fetcher);
  return json.result.filter((instrument) => instrument.is_active !== false);
}

export async function fetchDeribitBookSummary(
  instrumentName: string,
  fetcher: typeof fetch = fetch,
): Promise<DeribitBookSummary | null> {
  const url = deribitPublicUrl("get_book_summary_by_instrument", {
    instrument_name: instrumentName,
  });
  const json = await fetchDeribitJson<{ result: DeribitBookSummary[] }>(url, fetcher);
  return json.result[0] ?? null;
}

export async function fetchDeribitOrderBook(
  instrumentName: string,
  fetcher: typeof fetch = fetch,
): Promise<DeribitOrderBook | null> {
  const url = deribitPublicUrl("get_order_book", {
    instrument_name: instrumentName,
    depth: 1,
  });
  const json = await fetchDeribitJson<{ result: DeribitOrderBook }>(url, fetcher);
  return json.result ?? null;
}

export function normalizeDeribitOption(
  instrument: DeribitInstrument,
  summary: DeribitBookSummary,
  orderBook?: DeribitOrderBook | null,
  thresholds: CryptoLotteryThresholds = DEFAULT_CRYPTO_LOTTERY_THRESHOLDS,
): CryptoOptionLeg {
  const underlyingPrice = numeric(
    summary.underlying_price ?? orderBook?.underlying_price,
    "underlying_price",
  );
  const bid = optionalNumber(summary.bid_price);
  const ask = optionalNumber(summary.ask_price);
  const mark = optionalNumber(summary.mark_price);
  const mid = optionalNumber(summary.mid_price) ?? midpoint(bid, ask) ?? mark;
  const premiumUsd = mid == null ? null : round(mid * underlyingPrice, 2);
  const delta = optionalNumber(orderBook?.greeks?.delta);
  const moneynessPct = round((Math.abs(instrument.strike - underlyingPrice) / underlyingPrice) * 100, 2);
  const outOfMoney =
    instrument.option_type === "call"
      ? instrument.strike > underlyingPrice
      : instrument.strike < underlyingPrice;

  const lotteryReasons = lotteryCallReasons({
    type: instrument.option_type,
    outOfMoney,
    moneynessPct,
    premiumUsd,
    delta,
    thresholds,
  });

  return {
    instrumentName: instrument.instrument_name,
    currency: instrument.base_currency,
    expiry: new Date(instrument.expiration_timestamp).toISOString().slice(0, 10),
    type: instrument.option_type,
    strike: instrument.strike,
    underlyingPrice,
    bid,
    ask,
    mark,
    mid,
    premiumUsd,
    volume: optionalNumber(summary.volume) ?? 0,
    openInterest: optionalNumber(summary.open_interest) ?? 0,
    markIv: optionalNumber(summary.mark_iv),
    delta,
    moneynessPct,
    outOfMoney,
    lottery: lotteryReasons.length > 0,
    lotteryReasons,
  };
}

export function analyzeCryptoOptions(
  currency: CryptoOptionsCurrency,
  legs: CryptoOptionLeg[],
  baseline: BaselinePoint[] = [],
): CryptoOptionsAnalysis {
  const calls = legs.filter((leg) => leg.type === "call");
  const puts = legs.filter((leg) => leg.type === "put");
  const totalCallVolume = sum(calls.map((leg) => leg.volume));
  const totalPutVolume = sum(puts.map((leg) => leg.volume));
  const lotteryCallVolume = sum(calls.filter((leg) => leg.lottery).map((leg) => leg.volume));
  const nonLotteryCallVolume = totalCallVolume - lotteryCallVolume;
  const rawPutCallRatio = ratio(totalPutVolume, totalCallVolume);
  const adjustedPutCallRatio = ratio(totalPutVolume, nonLotteryCallVolume);
  const lotteryPct = totalCallVolume === 0 ? 0 : round((lotteryCallVolume / totalCallVolume) * 100, 2);
  const baselineStats = rollingBaselineStats(adjustedPutCallRatio, baseline);
  const anomalyFlags = buildAnomalyFlags(adjustedPutCallRatio, lotteryPct, baselineStats);

  return {
    currency,
    totalCallVolume,
    totalPutVolume,
    nonLotteryCallVolume,
    lotteryCallVolume,
    lotteryPct,
    rawPutCallRatio,
    adjustedPutCallRatio,
    signal: classifyPutCallSignal(adjustedPutCallRatio),
    perExpiry: perExpiryBreakdown(legs),
    baseline: baselineStats,
    anomalyFlags,
  };
}

export function rollingBaselineStats(
  currentAdjustedPc: number | null,
  baseline: BaselinePoint[],
): BaselineStats | null {
  const values = baseline
    .slice(-30)
    .map((point) => point.adjustedPutCallRatio)
    .filter((value): value is number => value != null && Number.isFinite(value));

  if (values.length === 0) {
    return null;
  }

  const mean = round(sum(values) / values.length, 4);
  const variance = values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / values.length;
  const stddev = round(Math.sqrt(variance), 4);
  const delta = currentAdjustedPc == null ? null : round(currentAdjustedPc - mean, 4);
  const zScore =
    currentAdjustedPc == null || stddev === 0 ? null : round((currentAdjustedPc - mean) / stddev, 4);

  return {
    days: values.length,
    meanAdjustedPc: mean,
    stddevAdjustedPc: stddev,
    adjustedPcDelta: delta,
    adjustedPcZScore: zScore,
  };
}

function perExpiryBreakdown(legs: CryptoOptionLeg[]): CryptoOptionsAnalysis["perExpiry"] {
  const expiries = [...new Set(legs.map((leg) => leg.expiry))].sort();
  return expiries.map((expiry) => {
    const rows = legs.filter((leg) => leg.expiry === expiry);
    const callVolume = sum(rows.filter((leg) => leg.type === "call").map((leg) => leg.volume));
    const putVolume = sum(rows.filter((leg) => leg.type === "put").map((leg) => leg.volume));
    const lotteryCallVolume = sum(
      rows.filter((leg) => leg.type === "call" && leg.lottery).map((leg) => leg.volume),
    );
    return {
      expiry,
      callVolume,
      putVolume,
      lotteryCallVolume,
      adjustedPutCallRatio: ratio(putVolume, callVolume - lotteryCallVolume),
    };
  });
}

function lotteryCallReasons(input: {
  type: OptionSide;
  outOfMoney: boolean;
  moneynessPct: number;
  premiumUsd: number | null;
  delta: number | null;
  thresholds: CryptoLotteryThresholds;
}): string[] {
  if (input.type !== "call" || !input.outOfMoney || input.premiumUsd == null) {
    return [];
  }

  const reasons: string[] = [];
  const cheap = input.premiumUsd <= input.thresholds.maxPremiumUsd;
  const deepOtm = input.moneynessPct >= input.thresholds.minOutOfMoneyPct;
  const lowDelta = input.delta != null && Math.abs(input.delta) <= input.thresholds.maxAbsDelta;

  if (cheap && deepOtm) {
    reasons.push(
      `premium_usd<=${input.thresholds.maxPremiumUsd} and moneyness_pct>=${input.thresholds.minOutOfMoneyPct}`,
    );
  }
  if (cheap && lowDelta) {
    reasons.push(`premium_usd<=${input.thresholds.maxPremiumUsd} and abs_delta<=${input.thresholds.maxAbsDelta}`);
  }

  return reasons;
}

function buildAnomalyFlags(
  adjustedPutCallRatio: number | null,
  lotteryPct: number,
  baseline: BaselineStats | null,
): string[] {
  const flags: string[] = [];
  if (lotteryPct >= 50) {
    flags.push(`lottery_call_volume_high:${lotteryPct}%`);
  }
  if (baseline?.adjustedPcDelta != null && Math.abs(baseline.adjustedPcDelta) >= 0.3) {
    flags.push(`adjusted_pc_shift:${baseline.adjustedPcDelta}`);
  }
  if (baseline?.adjustedPcZScore != null && Math.abs(baseline.adjustedPcZScore) >= 2) {
    flags.push(`adjusted_pc_zscore:${baseline.adjustedPcZScore}`);
  }
  if (adjustedPutCallRatio != null && adjustedPutCallRatio >= 2) {
    flags.push(`extreme_adjusted_pc:${adjustedPutCallRatio}`);
  }
  return flags;
}

function classifyPutCallSignal(pc: number | null): CryptoOptionsAnalysis["signal"] {
  if (pc == null) return "insufficient_data";
  if (pc < 0.6) return "bullish";
  if (pc < 0.9) return "mild_bullish";
  if (pc <= 1.2) return "neutral";
  if (pc <= 2) return "bearish";
  return "extreme_bearish";
}

async function fetchDeribitJson<T>(url: string, fetcher: typeof fetch): Promise<T> {
  const response = await fetcher(url);
  if (!response.ok) {
    throw new Error(`Deribit request failed: ${response.status} ${response.statusText}`);
  }
  const json = (await response.json()) as T & { error?: { message?: string } };
  if (json.error) {
    throw new Error(`Deribit API error: ${json.error.message ?? "unknown"}`);
  }
  return json;
}

function numeric(value: unknown, label: string): number {
  const parsed = optionalNumber(value);
  if (parsed == null) {
    throw new Error(`Missing numeric ${label}`);
  }
  return parsed;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function midpoint(bid: number | null, ask: number | null): number | null {
  if (bid == null || ask == null || bid <= 0 || ask <= 0) return null;
  return (bid + ask) / 2;
}

function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : round(numerator / denominator, 4);
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
