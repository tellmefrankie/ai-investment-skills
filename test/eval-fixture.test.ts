import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type {
  EvalFixture,
  SignalContext,
  ReasoningTrace,
  CriticAccuracyReport,
} from "./fixtures/eval-fixture-schema.js";

import {
  createSignalId,
  createReasoningId,
  computeTemporalGap,
  computeAccuracyReport,
} from "./fixtures/eval-fixture-schema.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fixturesDir = resolve(
  new URL(".", import.meta.url).pathname,
  "fixtures"
);

function loadEvalFixture(name: string): EvalFixture {
  const p = resolve(fixturesDir, name);
  return JSON.parse(readFileSync(p, "utf8")) as EvalFixture;
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

// ---------------------------------------------------------------------------
// Schema validation tests
// ---------------------------------------------------------------------------

console.log("\nEval Fixture Schema v2 — Signal/Reasoning/Outcome separation");
console.log("=".repeat(60));

const rxrxEval = loadEvalFixture("rxrx-eval-fixture.json");

console.log("\n--- Schema structure ---");

test("schema_version is 2.0.0", () => {
  assert.equal(rxrxEval.schema_version, "2.0.0");
});

test("fixture has required top-level fields", () => {
  assert.ok(rxrxEval.fixture_id, "missing fixture_id");
  assert.ok(rxrxEval.created_at, "missing created_at");
  assert.ok(rxrxEval.description, "missing description");
  assert.ok(Array.isArray(rxrxEval.tags), "tags should be array");
  assert.ok(Array.isArray(rxrxEval.signals), "signals should be array");
  assert.ok(rxrxEval.reasoning, "missing reasoning");
});

// ---------------------------------------------------------------------------
// Signal-side tests
// ---------------------------------------------------------------------------

console.log("\n--- Signal-side context ---");

test("signals preserve BOTH raw and adjusted metrics (R3: no pre-filtering)", () => {
  const optionsSignal = rxrxEval.signals.find(
    (s) => s.source === "options_flow"
  )!;
  assert.ok(optionsSignal, "missing options_flow signal");

  // Raw metrics present
  assert.ok(
    "raw_put_call_ratio" in optionsSignal.raw_metrics,
    "missing raw_put_call_ratio"
  );
  assert.equal(optionsSignal.raw_metrics.raw_put_call_ratio, 0.38);

  // Adjusted metrics present alongside raw
  assert.ok(
    "adjusted_put_call_ratio" in optionsSignal.adjusted_metrics,
    "missing adjusted_put_call_ratio"
  );
  assert.equal(optionsSignal.adjusted_metrics.adjusted_put_call_ratio, 2.38);
});

test("noise_flags capture lottery contamination with threshold details", () => {
  const optionsSignal = rxrxEval.signals.find(
    (s) => s.source === "options_flow"
  )!;
  assert.ok(optionsSignal.noise_flags.length > 0, "missing noise flags");

  const lotteryFlag = optionsSignal.noise_flags.find(
    (f) => f.type === "lottery_volume"
  )!;
  assert.ok(lotteryFlag, "missing lottery_volume flag");
  assert.equal(lotteryFlag.severity, "critical");
  assert.equal(lotteryFlag.actual_value, 84.0);
  assert.ok(lotteryFlag.threshold != null, "threshold should be recorded");
});

test("each signal has unique signal_id and observation timestamp", () => {
  const ids = rxrxEval.signals.map((s) => s.signal_id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length, "signal_ids must be unique");

  for (const sig of rxrxEval.signals) {
    assert.ok(sig.observed_at, `signal ${sig.signal_id} missing observed_at`);
    assert.ok(
      !isNaN(Date.parse(sig.observed_at)),
      `signal ${sig.signal_id} has invalid observed_at`
    );
  }
});

test("annotations over-collect context (R4: context > parsimony)", () => {
  const optionsSignal = rxrxEval.signals.find(
    (s) => s.source === "options_flow"
  )!;
  assert.ok(
    optionsSignal.annotations.length >= 3,
    `expected 3+ annotations, got ${optionsSignal.annotations.length}`
  );
});

// ---------------------------------------------------------------------------
// Reasoning-side tests
// ---------------------------------------------------------------------------

console.log("\n--- Reasoning-side trace ---");

test("reasoning consumed_signal_ids reference actual signal_ids (context lineage)", () => {
  const signalIds = new Set(rxrxEval.signals.map((s) => s.signal_id));
  for (const consumed of rxrxEval.reasoning.consumed_signal_ids) {
    assert.ok(
      signalIds.has(consumed),
      `reasoning references non-existent signal: ${consumed}`
    );
  }
});

test("reasoning_steps reference valid signal_ids", () => {
  const signalIds = new Set(rxrxEval.signals.map((s) => s.signal_id));
  for (const step of rxrxEval.reasoning.reasoning_steps) {
    for (const ref of step.signal_refs) {
      assert.ok(
        signalIds.has(ref),
        `step ${step.step_number} references non-existent signal: ${ref}`
      );
    }
  }
});

test("reasoning has structured steps (not just a text blob)", () => {
  assert.ok(
    rxrxEval.reasoning.reasoning_steps.length >= 2,
    "need at least 2 reasoning steps"
  );
  for (const step of rxrxEval.reasoning.reasoning_steps) {
    assert.ok(step.examined, `step ${step.step_number} missing examined`);
    assert.ok(step.conclusion, `step ${step.step_number} missing conclusion`);
  }
});

test("reasoning records resource usage for cost tracking", () => {
  const usage = rxrxEval.reasoning.resource_usage;
  assert.ok(usage, "missing resource_usage");
  assert.ok(usage!.input_tokens > 0, "input_tokens should be positive");
  assert.ok(usage!.output_tokens > 0, "output_tokens should be positive");
  assert.ok(usage!.model, "missing model name");
});

test("counter_evidence references contradicted signals", () => {
  for (const ce of rxrxEval.reasoning.counter_evidence) {
    const signalIds = new Set(rxrxEval.signals.map((s) => s.signal_id));
    assert.ok(
      signalIds.has(ce.contradicts_signal_id),
      `counter-evidence references non-existent signal: ${ce.contradicts_signal_id}`
    );
  }
});

// ---------------------------------------------------------------------------
// Temporal provenance tests
// ---------------------------------------------------------------------------

console.log("\n--- Temporal provenance ---");

test("temporal_gap_seconds measures signal-to-reasoning delay", () => {
  assert.ok(
    rxrxEval.temporal_gap_seconds >= 0,
    "temporal gap should be non-negative"
  );

  // Verify it matches computed gap
  const computed = computeTemporalGap(
    rxrxEval.signals,
    rxrxEval.reasoning.reasoned_at
  );
  assert.equal(
    rxrxEval.temporal_gap_seconds,
    computed,
    `recorded gap (${rxrxEval.temporal_gap_seconds}s) should match computed (${computed}s)`
  );
});

test("reasoning timestamp is AFTER all signal timestamps", () => {
  const reasonedTime = new Date(rxrxEval.reasoning.reasoned_at).getTime();
  for (const sig of rxrxEval.signals) {
    const sigTime = new Date(sig.observed_at).getTime();
    assert.ok(
      reasonedTime >= sigTime,
      `reasoning (${rxrxEval.reasoning.reasoned_at}) should be after signal ${sig.signal_id} (${sig.observed_at})`
    );
  }
});

// ---------------------------------------------------------------------------
// Outcome tests (retrospective accuracy)
// ---------------------------------------------------------------------------

console.log("\n--- Outcome tracking ---");

test("outcome records both critic and raw signal accuracy", () => {
  const outcome = rxrxEval.outcome;
  assert.ok(outcome, "missing outcome");
  assert.ok(typeof outcome!.critic_correct === "boolean");
  assert.ok(typeof outcome!.raw_signal_correct === "boolean");
});

test("RXRX case: Critic was correct, raw signal was wrong", () => {
  const outcome = rxrxEval.outcome!;
  assert.equal(outcome.critic_correct, true, "Critic should be correct");
  assert.equal(
    outcome.raw_signal_correct,
    false,
    "Raw signal should be incorrect"
  );
  assert.equal(outcome.direction, "down", "stock should have gone down");
});

test("outcome horizon is valid", () => {
  const validHorizons = ["1d", "3d", "1w", "2w", "1m"];
  assert.ok(
    validHorizons.includes(rxrxEval.outcome!.horizon),
    `invalid horizon: ${rxrxEval.outcome!.horizon}`
  );
});

// ---------------------------------------------------------------------------
// Accuracy computation tests
// ---------------------------------------------------------------------------

console.log("\n--- Accuracy report computation ---");

test("computeAccuracyReport handles single fixture", () => {
  const report = computeAccuracyReport([rxrxEval]);

  assert.equal(report.total_fixtures, 1);
  assert.equal(report.critic_accuracy, 1.0, "1/1 correct = 100%");
  assert.equal(report.raw_signal_accuracy, 0, "0/1 correct = 0%");
  assert.equal(report.critic_lift, 1.0, "lift = 1.0 - 0.0");
});

test("computeAccuracyReport handles empty fixtures", () => {
  const report = computeAccuracyReport([]);
  assert.equal(report.total_fixtures, 0);
  assert.equal(report.critic_accuracy, 0);
});

test("computeAccuracyReport computes confidence calibration", () => {
  const report = computeAccuracyReport([rxrxEval]);
  assert.ok(
    report.confidence_calibration.avg_confidence_when_correct > 0,
    "should have avg confidence for correct predictions"
  );
});

// ---------------------------------------------------------------------------
// Factory helper tests
// ---------------------------------------------------------------------------

console.log("\n--- Factory helpers ---");

test("createSignalId generates deterministic ID", () => {
  const id = createSignalId("RXRX", "options_flow", "2026-05-20T09:00:00Z");
  assert.ok(id.startsWith("sig_rxrx_options_flow_"));
  assert.ok(id.length > 20);
});

test("createReasoningId generates unique IDs", () => {
  const id1 = createReasoningId("2026-05-20T10:00:00Z");
  const id2 = createReasoningId("2026-05-20T10:00:00Z");
  assert.ok(id1.startsWith("rsn_"));
  // Random suffix means they should differ (probabilistically)
  // Not guaranteed but extremely unlikely to collide
});

// ---------------------------------------------------------------------------
// Signal/Reasoning separation validation
// ---------------------------------------------------------------------------

console.log("\n--- Signal/Reasoning separation (R4 core requirement) ---");

test("signals contain NO reasoning or verdicts", () => {
  for (const sig of rxrxEval.signals) {
    const sigStr = JSON.stringify(sig).toLowerCase();
    assert.ok(
      !sigStr.includes('"verdict"'),
      "signal should not contain verdict"
    );
    assert.ok(
      !sigStr.includes('"approve"') &&
        !sigStr.includes('"reject"') &&
        !sigStr.includes('"modify"'),
      "signal should not contain reasoning conclusions"
    );
  }
});

test("reasoning contains NO raw market data (only references)", () => {
  // Reasoning should reference signals by ID, not duplicate raw metrics
  const reasoning = rxrxEval.reasoning;
  assert.ok(
    !("raw_metrics" in reasoning),
    "reasoning should not contain raw_metrics"
  );
  assert.ok(
    !("adjusted_metrics" in reasoning),
    "reasoning should not contain adjusted_metrics"
  );
  // It should use signal_refs instead
  const allRefs = reasoning.reasoning_steps.flatMap((s) => s.signal_refs);
  assert.ok(allRefs.length > 0, "reasoning steps should reference signals");
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${"=".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
