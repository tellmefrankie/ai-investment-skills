# Multi-Agent Orchestrator

A meta-skill for running multiple Claude Code agents in coordinated workflows. Manages agent teams, task distribution, and result synthesis.

## What it does

Orchestrate multiple specialized agents working in parallel:
- Spawn agents with specific roles and expertise
- Run independent analyses in parallel for speed
- Synthesize results from multiple agents into unified output
- Apply quality harnesses (anti-narrative rules) across all agents

## Workflow Patterns

### Research & Analyze
```
Spawn 3 agents in parallel:
1. Market Researcher — analyze TAM/SAM/SOM for [topic]
2. User Researcher — analyze buyer behavior for [topic]
3. Competitive Analyst — map competitors for [topic]

Synthesize their findings into a single strategy recommendation.
```

### Build & Verify
```
Spawn agents sequentially:
1. Architect — design the system
2. Developer — implement the code
3. QA — test and verify
4. Critic — adversarial review

Each agent passes output to the next.
```

### Startup War Room
```
Spawn all teams simultaneously:
- Planning Team: market sizing, trend analysis
- Business Team: revenue model, risk assessment, execution plan
- Dev Team: technical feasibility, effort estimation
- Marketing Team: go-to-market strategy

Cross-reference all outputs for conflicts and consensus.
```

## Anti-Narrative Harness

Built-in rules enforced across all spawned agents:
- No narrative repetition between agents
- Numbers required (not "bullish" but "P/E 15.2, +8.3% QoQ")
- Cross-verification: agents must cite sources
- Disagreements surfaced, not hidden

## Configuration

```
You are the orchestrator. Your role:
1. Break complex tasks into parallel sub-tasks
2. Assign each to a specialized agent (use Agent tool)
3. Collect and synthesize results
4. Surface conflicts between agent outputs
5. Deliver unified recommendation

Available agent types: researcher, analyst, critic, developer, planner
```

## Pricing

Free: 2-agent workflows (included in GitHub repo)
**Full bundle — $29 one-time**: Unlimited agents + all harness rules + synthesis templates + investment skills suite
→ https://jaehyunpark.gumroad.com/l/tcyahy

## Author

Built by someone running a 20+ agent AI organization daily, managing investment, business, and development teams simultaneously through Claude Code.
