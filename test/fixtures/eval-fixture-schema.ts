/**
 * Eval Fixture Schema v2 — Signal/Reasoning/Outcome separation
 *
 * Motivation (from MrTalecky feedback rounds 1-4):
 *   R1: Volume can be fake. Filter too hard → lose edge.
 *   R2: intent → validation → execution must be atomic.
 *   R3: Raw (84% lottery) and adjusted P/C are different information.
 *       Both must reach Critic. Pre-filter too aggressively → Critic loses context.
 *   R4: Eval fixtures should record what Critic SAW (context),
 *       not just what it concluded. Signal-side vs reasoning-side separation.
 *       Over-collect context.
 *
 * This schema implements R4 and anticipates R5:
 *   - Temporal provenance: when was each signal observed vs when did Critic reason?
 *   - Outcome tracking: what actually happened? (for Critic accuracy measurement)
 *   - Context lineage: which raw inputs did each reasoning step consume?
 */

// ---------------------------------------------------------------------------
// Signal-side: raw market data captured at observation time
// ---------------------------------------------------------------------------

export interface SignalContext {
  /** Unique ID for this signal snapshot */
  signal_id: string;

  /** When the signal was observed (ISO 8601) */
  observed_at: string;

  /** Source system that produced the signal */
  source: "options_flow" | "news_sentiment" | "technical" | "macro" | "sector";

  /** The ticker or entity this signal is about */
  entity: string;

  /** Raw numeric values — over-collect, let Critic decide what matters */
  raw_metrics: Record<string, number>;

  /**
   * Derived/adjusted metrics (e.g., lottery-filtered P/C ratio).
   * Kept separate from raw so Critic can see both without pre-filtering.
   */
  adjusted_metrics: Record<string, number>;

  /** Free-form context strings the agent attached */
  annotations: string[];

  /** Confidence of the signal source (0-1), if available */
  source_confidence?: number;

  /** Whether this signal was flagged as potentially noisy (lottery, wash, etc.) */
  noise_flags: NoiseFlag[];
}

export interface NoiseFlag {
  type: "lottery_volume" | "wash_trade" | "stale_quote" | "low_liquidity" | "data_gap";
  severity: "info" | "warning" | "critical";
  detail: string;
  /** The metric that triggered this flag */
  metric_key: string;
  /** The threshold that was breached */
  threshold?: number;
  /** The actual value */
  actual_value?: number;
}

// ---------------------------------------------------------------------------
// Reasoning-side: what the Critic saw, thought, and decided
// ---------------------------------------------------------------------------

export interface ReasoningTrace {
  /** Unique ID for this reasoning event */
  reasoning_id: string;

  /** When the Critic started reasoning (ISO 8601) */
  reasoned_at: string;

  /** Which signal_ids did the Critic consume? (context lineage) */
  consumed_signal_ids: string[];

  /** The Critic's verdict */
  verdict: "approve" | "modify" | "reject";

  /** Critic confidence in its own verdict (0-1) */
  confidence: number;

  /** Structured reasoning steps — not just a blob of text */
  reasoning_steps: ReasoningStep[];

  /** Counter-evidence the Critic found (if any) */
  counter_evidence: CounterEvidence[];

  /** What the Critic recommended (if verdict is "modify") */
  modification?: string;

  /** Tokens/cost used for this reasoning pass */
  resource_usage?: {
    input_tokens: number;
    output_tokens: number;
    model: string;
    latency_ms: number;
  };
}

export interface ReasoningStep {
  step_number: number;
  /** What the Critic examined */
  examined: string;
  /** What it concluded from that examination */
  conclusion: string;
  /** Which signal_ids informed this specific step */
  signal_refs: string[];
}

export interface CounterEvidence {
  source: string;
  claim: string;
  contradicts_signal_id: string;
  strength: "weak" | "moderate" | "strong";
}

// ---------------------------------------------------------------------------
// Outcome-side: what actually happened (for retrospective accuracy scoring)
// ---------------------------------------------------------------------------

export interface OutcomeRecord {
  /** When the outcome was recorded (ISO 8601) */
  recorded_at: string;

  /** The entity (ticker) this outcome is about */
  entity: string;

  /** Time horizon of the outcome measurement */
  horizon: "1d" | "3d" | "1w" | "2w" | "1m";

  /** Actual price movement (%) */
  price_change_pct: number;

  /** Actual direction */
  direction: "up" | "down" | "flat";

  /** Was the Critic's verdict directionally correct? */
  critic_correct: boolean;

  /** Was the raw signal (pre-Critic) directionally correct? */
  raw_signal_correct: boolean;

  /** Additional outcome context */
  notes?: string;
}

// ---------------------------------------------------------------------------
// Top-level eval fixture: ties everything together
// ---------------------------------------------------------------------------

export interface EvalFixture {
  /** Schema version for forward compatibility */
  schema_version: "2.0.0";

  /** Unique fixture ID */
  fixture_id: string;

  /** When this fixture was created */
  created_at: string;

  /** Human-readable description of what this fixture tests */
  description: string;

  /** Tags for filtering/grouping fixtures */
  tags: string[];

  /** All signals that were available at decision time */
  signals: SignalContext[];

  /** The Critic's reasoning trace */
  reasoning: ReasoningTrace;

  /** Outcome data (filled in retrospectively) */
  outcome?: OutcomeRecord;

  /**
   * Temporal gap analysis:
   * How much time elapsed between signal observation and Critic reasoning?
   * Large gaps may indicate stale-signal risk.
   */
  temporal_gap_seconds: number;
}

// ---------------------------------------------------------------------------
// Accuracy metrics computed across multiple fixtures
// ---------------------------------------------------------------------------

export interface CriticAccuracyReport {
  /** How many fixtures were evaluated */
  total_fixtures: number;

  /** Critic directional accuracy */
  critic_accuracy: number;

  /** Raw signal directional accuracy (baseline comparison) */
  raw_signal_accuracy: number;

  /** Critic accuracy improvement over raw signals */
  critic_lift: number;

  /** Breakdown by signal source */
  by_source: Record<string, { accuracy: number; count: number }>;

  /** Breakdown by horizon */
  by_horizon: Record<string, { accuracy: number; count: number }>;

  /** Average confidence when correct vs incorrect */
  confidence_calibration: {
    avg_confidence_when_correct: number;
    avg_confidence_when_incorrect: number;
  };
}

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

export function createSignalId(entity: string, source: string, timestamp: string): string {
  const ts = timestamp.replace(/[^0-9]/g, "").slice(0, 14);
  return `sig_${entity.toLowerCase()}_${source}_${ts}`;
}

export function createReasoningId(timestamp: string): string {
  const ts = timestamp.replace(/[^0-9]/g, "").slice(0, 14);
  return `rsn_${ts}_${Math.random().toString(36).slice(2, 8)}`;
}

export function computeTemporalGap(signals: SignalContext[], reasonedAt: string): number {
  const reasonedTime = new Date(reasonedAt).getTime();
  const latestSignal = Math.max(
    ...signals.map((s) => new Date(s.observed_at).getTime())
  );
  return Math.round((reasonedTime - latestSignal) / 1000);
}

export function computeAccuracyReport(fixtures: EvalFixture[]): CriticAccuracyReport {
  const withOutcome = fixtures.filter((f) => f.outcome != null);
  const total = withOutcome.length;

  if (total === 0) {
    return {
      total_fixtures: 0,
      critic_accuracy: 0,
      raw_signal_accuracy: 0,
      critic_lift: 0,
      by_source: {},
      by_horizon: {},
      confidence_calibration: {
        avg_confidence_when_correct: 0,
        avg_confidence_when_incorrect: 0,
      },
    };
  }

  const criticCorrect = withOutcome.filter((f) => f.outcome!.critic_correct).length;
  const rawCorrect = withOutcome.filter((f) => f.outcome!.raw_signal_correct).length;

  const criticAcc = criticCorrect / total;
  const rawAcc = rawCorrect / total;

  // By source
  const bySource: Record<string, { correct: number; total: number }> = {};
  for (const f of withOutcome) {
    for (const sig of f.signals) {
      const key = sig.source;
      if (!bySource[key]) bySource[key] = { correct: 0, total: 0 };
      bySource[key].total++;
      if (f.outcome!.critic_correct) bySource[key].correct++;
    }
  }

  // By horizon
  const byHorizon: Record<string, { correct: number; total: number }> = {};
  for (const f of withOutcome) {
    const key = f.outcome!.horizon;
    if (!byHorizon[key]) byHorizon[key] = { correct: 0, total: 0 };
    byHorizon[key].total++;
    if (f.outcome!.critic_correct) byHorizon[key].correct++;
  }

  // Confidence calibration
  const correctConf = withOutcome
    .filter((f) => f.outcome!.critic_correct)
    .map((f) => f.reasoning.confidence);
  const incorrectConf = withOutcome
    .filter((f) => !f.outcome!.critic_correct)
    .map((f) => f.reasoning.confidence);

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  return {
    total_fixtures: total,
    critic_accuracy: Math.round(criticAcc * 1000) / 1000,
    raw_signal_accuracy: Math.round(rawAcc * 1000) / 1000,
    critic_lift: Math.round((criticAcc - rawAcc) * 1000) / 1000,
    by_source: Object.fromEntries(
      Object.entries(bySource).map(([k, v]) => [
        k,
        { accuracy: Math.round((v.correct / v.total) * 1000) / 1000, count: v.total },
      ])
    ),
    by_horizon: Object.fromEntries(
      Object.entries(byHorizon).map(([k, v]) => [
        k,
        { accuracy: Math.round((v.correct / v.total) * 1000) / 1000, count: v.total },
      ])
    ),
    confidence_calibration: {
      avg_confidence_when_correct: Math.round(avg(correctConf) * 1000) / 1000,
      avg_confidence_when_incorrect: Math.round(avg(incorrectConf) * 1000) / 1000,
    },
  };
}
