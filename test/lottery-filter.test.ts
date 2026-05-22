import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OptionLeg {
  expiry: string;
  type: "call" | "put";
  strike: number;
  bid: number;
  ask: number;
  volume: number;
  open_interest: number;
  lottery: boolean;
  note?: string;
}

interface OptionsFixture {
  ticker: string;
  snapshot_date: string;
  summary: {
    total_call_volume: number;
    total_put_volume: number;
    raw_put_call_ratio: number;
    adjusted_put_call_ratio: number;
    lottery_pct: number;
  };
  lottery_filter: {
    lottery_call_volume: number;
    non_lottery_call_volume: number;
    lottery_call_pct: number;
  };
  chain: OptionLeg[];
}

// ---------------------------------------------------------------------------
// Lottery filter implementation under test
// ---------------------------------------------------------------------------

interface FilterResult {
  raw_put_call_ratio: number;
  adjusted_put_call_ratio: number;
  lottery_pct: number;
}

function applyLotteryFilter(fixture: OptionsFixture): FilterResult {
  const calls = fixture.chain.filter((l) => l.type === "call");
  const puts = fixture.chain.filter((l) => l.type === "put");

  const totalCallVol = calls.reduce((s, l) => s + l.volume, 0);
  const totalPutVol = puts.reduce((s, l) => s + l.volume, 0);

  const lotteryCallVol = calls
    .filter((l) => l.bid <= 0.05 && l.ask <= 0.05)
    .reduce((s, l) => s + l.volume, 0);

  const nonLotteryCallVol = totalCallVol - lotteryCallVol;

  const rawPC =
    totalCallVol === 0
      ? 0
      : Math.round((totalPutVol / totalCallVol) * 100) / 100;

  const adjustedPC =
    nonLotteryCallVol === 0
      ? 0
      : Math.round((totalPutVol / nonLotteryCallVol) * 100) / 100;

  const lotteryPct =
    totalCallVol === 0
      ? 0
      : Math.round((lotteryCallVol / totalCallVol) * 1000) / 10;

  return {
    raw_put_call_ratio: rawPC,
    adjusted_put_call_ratio: adjustedPC,
    lottery_pct: lotteryPct,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFixture(name: string): OptionsFixture {
  const p = resolve(new URL('.', import.meta.url).pathname, "fixtures", name);
  return JSON.parse(readFileSync(p, "utf8")) as OptionsFixture;
}

function approxEqual(actual: number, expected: number, tolerance = 0.05): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

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

// --- RXRX noisy chain ---
console.log("\nRXRX — noisy options chain (lottery-contaminated)");

const rxrx = loadFixture("rxrx-noisy-options.json");
const rxrxResult = applyLotteryFilter(rxrx);

test("fixture ticker is RXRX", () => {
  assert.equal(rxrx.ticker, "RXRX");
});

test("raw P/C is 0.38 (appears bullish)", () => {
  assert.ok(
    approxEqual(rxrxResult.raw_put_call_ratio, 0.38),
    `expected ~0.38, got ${rxrxResult.raw_put_call_ratio}`
  );
});

test("adjusted P/C is ~2.38 (actual bearish signal)", () => {
  assert.ok(
    approxEqual(rxrxResult.adjusted_put_call_ratio, 2.38, 0.1),
    `expected ~2.38, got ${rxrxResult.adjusted_put_call_ratio}`
  );
});

test("lottery_pct is 84%", () => {
  assert.ok(
    approxEqual(rxrxResult.lottery_pct, 84, 1.0),
    `expected ~84, got ${rxrxResult.lottery_pct}`
  );
});

test("adjusted P/C > raw P/C (filter reveals hidden bearish pressure)", () => {
  assert.ok(
    rxrxResult.adjusted_put_call_ratio > rxrxResult.raw_put_call_ratio,
    `adjusted (${rxrxResult.adjusted_put_call_ratio}) should exceed raw (${rxrxResult.raw_put_call_ratio})`
  );
});

test("signal inversion: raw bullish (<1), adjusted bearish (>1)", () => {
  assert.ok(rxrxResult.raw_put_call_ratio < 1.0, "raw P/C should be < 1.0");
  assert.ok(rxrxResult.adjusted_put_call_ratio > 1.0, "adjusted P/C should be > 1.0");
});

// --- CEL clean chain ---
console.log("\nCEL — clean options chain (low lottery noise)");

const cel = loadFixture("cel-clean-options.json");
const celResult = applyLotteryFilter(cel);

test("fixture ticker is CEL", () => {
  assert.equal(cel.ticker, "CEL");
});

test("lottery_pct is below 5%", () => {
  assert.ok(
    celResult.lottery_pct < 5,
    `expected < 5%, got ${celResult.lottery_pct}%`
  );
});

test("raw and adjusted P/C are nearly identical (< 0.1 delta)", () => {
  const delta = Math.abs(celResult.adjusted_put_call_ratio - celResult.raw_put_call_ratio);
  assert.ok(
    delta < 0.1,
    `expected delta < 0.1, got ${delta.toFixed(3)}`
  );
});

test("no signal inversion on clean chain", () => {
  const rawBullish = celResult.raw_put_call_ratio < 1.0;
  const adjBullish = celResult.adjusted_put_call_ratio < 1.0;
  assert.equal(
    rawBullish,
    adjBullish,
    `signal direction should not flip after filter (raw=${celResult.raw_put_call_ratio}, adj=${celResult.adjusted_put_call_ratio})`
  );
});

// --- Contrast ---
console.log("\nContrast — RXRX vs CEL");

test("RXRX lottery_pct >> CEL lottery_pct", () => {
  assert.ok(
    rxrxResult.lottery_pct > celResult.lottery_pct * 5,
    `RXRX (${rxrxResult.lottery_pct}%) should be 5x+ higher than CEL (${celResult.lottery_pct}%)`
  );
});

test("RXRX adjusted P/C >> RXRX raw P/C (meaningful filter impact)", () => {
  const ratio = rxrxResult.adjusted_put_call_ratio / rxrxResult.raw_put_call_ratio;
  assert.ok(
    ratio >= 5,
    `expected 5x+ amplification from filter, got ${ratio.toFixed(2)}x`
  );
});

// --- Summary ---
console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
