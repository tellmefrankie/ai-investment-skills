import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  analyzeCryptoOptions,
  deribitPublicUrl,
  normalizeDeribitOption,
  type BaselinePoint,
  type CryptoOptionLeg,
  type DeribitBookSummary,
  type DeribitInstrument,
  type DeribitOrderBook,
} from "../options-flow-analyzer/deribit-crypto-options.ts";

interface DeribitCryptoFixture {
  currency: "BTC" | "ETH";
  snapshot_date: string;
  baseline: Array<{
    date: string;
    raw_put_call_ratio: number;
    adjusted_put_call_ratio: number;
    lottery_pct: number;
  }>;
  contracts: Array<{
    instrument: DeribitInstrument;
    summary: DeribitBookSummary;
    order_book: DeribitOrderBook;
  }>;
}

function loadFixture(name: string): DeribitCryptoFixture {
  const path = resolve(new URL(".", import.meta.url).pathname, "fixtures", name);
  return JSON.parse(readFileSync(path, "utf8")) as DeribitCryptoFixture;
}

function baselinePoints(fixture: DeribitCryptoFixture): BaselinePoint[] {
  return fixture.baseline.map((row) => ({
    date: row.date,
    rawPutCallRatio: row.raw_put_call_ratio,
    adjustedPutCallRatio: row.adjusted_put_call_ratio,
    lotteryPct: row.lottery_pct,
  }));
}

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(`         ${(err as Error).message}`);
    failed++;
  }
}

console.log("\nDeribit crypto options flow");
console.log("=".repeat(60));

const fixture = loadFixture("deribit-btc-crypto-options.json");
const legs: CryptoOptionLeg[] = fixture.contracts.map((row) =>
  normalizeDeribitOption(row.instrument, row.summary, row.order_book),
);
const analysis = analyzeCryptoOptions(fixture.currency, legs, baselinePoints(fixture));

test("Deribit public URL uses the no-auth option endpoints", () => {
  const url = deribitPublicUrl("get_instruments", {
    currency: "BTC",
    kind: "option",
    expired: false,
  });
  assert.equal(
    url,
    "https://www.deribit.com/api/v2/public/get_instruments?currency=BTC&kind=option&expired=false",
  );
});

test("normalization converts BTC-denominated option premium to USD", () => {
  const lotteryCall = legs.find((leg) => leg.instrumentName === "BTC-28JUN26-83000-C")!;
  assert.equal(lotteryCall.premiumUsd, 20.4);
  assert.equal(lotteryCall.underlyingPrice, 68000);
});

test("deep OTM cheap calls are classified as lottery calls", () => {
  const call83000 = legs.find((leg) => leg.instrumentName === "BTC-28JUN26-83000-C")!;
  const call90000 = legs.find((leg) => leg.instrumentName === "BTC-28JUN26-90000-C")!;
  assert.equal(call83000.lottery, true);
  assert.equal(call90000.lottery, true);
  assert.ok(call83000.lotteryReasons.some((reason) => reason.includes("premium_usd")));
});

test("near-money liquid calls are preserved as real call volume", () => {
  const call75000 = legs.find((leg) => leg.instrumentName === "BTC-28JUN26-75000-C")!;
  assert.equal(call75000.lottery, false);
  assert.equal(call75000.outOfMoney, true);
  assert.ok(call75000.premiumUsd! > 1000);
});

test("raw P/C can look neutral while adjusted P/C turns bearish", () => {
  assert.equal(analysis.totalCallVolume, 3560);
  assert.equal(analysis.totalPutVolume, 1360);
  assert.equal(analysis.lotteryCallVolume, 2600);
  assert.equal(analysis.nonLotteryCallVolume, 960);
  assert.equal(analysis.rawPutCallRatio, 0.382);
  assert.equal(analysis.adjustedPutCallRatio, 1.4167);
  assert.equal(analysis.signal, "bearish");
});

test("lottery percentage and per-expiry breakdown are computed", () => {
  assert.equal(analysis.lotteryPct, 73.03);
  assert.equal(analysis.perExpiry.length, 1);
  assert.equal(analysis.perExpiry[0].expiry, "2026-06-28");
  assert.equal(analysis.perExpiry[0].lotteryCallVolume, 2600);
});

test("rolling baseline flags adjusted P/C shifts and lottery surges", () => {
  assert.ok(analysis.baseline, "baseline stats missing");
  assert.equal(analysis.baseline!.days, 10);
  assert.ok(analysis.baseline!.adjustedPcDelta! > 0.3);
  assert.ok(analysis.anomalyFlags.some((flag) => flag.startsWith("adjusted_pc_shift")));
  assert.ok(analysis.anomalyFlags.some((flag) => flag.startsWith("lottery_call_volume_high")));
});

console.log(`\n${"=".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
