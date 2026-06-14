# Concreto

**Advanced Design Intelligence for AI Coding Agents**

Concreto is a comprehensive design system that empowers AI coding agents to create exceptional, production-grade interfaces. It combines deterministic rules, ML-enhanced detection, and comprehensive design guidance into a unified system.

## Features

### WHAT MAKES CONCRETO DIFFERENT

- **80+ Deterministic Rules**: OWASP-style organized detection rules across accessibility, performance, UX, and visual design
- **ML-Enhanced Detection**: Optional machine learning models for context-aware pattern recognition
- **35+ Commands**: Complete vocabulary for design operations from `analyze` to `synthesize`
- **Multi-Provider Support**: Works with Claude Code, Cursor, Gemini CLI, Codex, OpenCode, and more
- **Real-Time Browser Integration**: Live iteration mode with visual feedback
- **Intelligent Color System**: OKLCH-first with automatic contrast verification

### RULE CATEGORIES

| Category | Code | Rules | Description |
|----------|------|-------|-------------|
| Critical | `A` | 15 | Blocking issues (accessibility, security) |
| Visual Quality | `V` | 25 | Aesthetic and brand consistency |
| Performance | `P` | 12 | Render-blocking, layout thrashing |
| Interaction | `I` | 18 | UX patterns, usability |
| Semantic | `S` | 10 | HTML structure, ARIA, SEO |

## Quick Start

```bash
# Install from npm
npx concreto skills install

# Or install globally
npm install -g concreto
concreto init

# Detect issues
concreto detect src/

# Analyze a URL
concreto detect https://your-site.com

# Run with ML enhancement
concreto detect --ml src/
```

## Commands

### Build & Create
- `/concreto craft [feature]` - Full design-build cycle
- `/concreto shape [feature]` - UX/UI planning
- `/concreto scaffold [component]` - Generate component boilerplate
- `/concreto synthesize [tokens]` - Generate design tokens

### Analyze & Evaluate
- `/concreto audit [target]` - Comprehensive quality check
- `/concreto analyze [target]` - Deep semantic analysis
- `/concreto benchmark [target]` - Performance metrics
- `/concreto critique [target]` - UX design review

### Refine & Polish
- `/concreto polish [target]` - Final quality pass
- `/concreto refine [target]` - Targeted improvements
- `/concreto optimize [target]` - Performance optimization
- `/concreto distill [target]` - Remove complexity

### Transform
- `/concreto bolder [target]` - Amplify visual impact
- `/concreto quieter [target]` - Reduce visual noise
- `/concreto modernize [target]` - Update to current standards
- `/concreto adapt [target]` - Cross-device adaptation

### Enhance
- `/concreto animate [target]` - Purposeful motion
- `/concreto colorize [target]` - Strategic color
- `/concreto typeset [target]` - Typography refinement
- `/concreto layout [target]` - Spacing and rhythm

### Production
- `/concreto harden [target]` - Error handling, edge cases
- `/concreto verify [target]` - Pre-ship validation
- `/concreto document [target]` - Generate documentation

### Live Mode
- `/concreto live` - Visual iteration in browser

## Rule Engine

Concreto uses a structured rule system inspired by OWASP:

```
[CATEGORY][NUMBER]-[SEVERITY]-[NAME]

Examples:
A01-CRITICAL-color-contrast
V12-MEDIUM-gradient-overuse
P03-HIGH-render-blocking
I08-LOW-tap-target-size
S05-CRITICAL-missing-lang
```

### Severity Levels

| Level | Impact | Action |
|-------|--------|--------|
| CRITICAL | Blocks users | Must fix immediately |
| HIGH | Major UX impact | Fix before shipping |
| MEDIUM | Quality issue | Should fix |
| LOW | Minor polish | Nice to have |
| INFO | Suggestion | Consider |

## Architecture

```
concreto/
├── cli/               # Command-line interface
│   ├── bin/           # Entry points
│   └── engine/
│       ├── rules/     # Detection rule implementations
│       ├── engines/   # Browser, static, regex engines
│       ├── ml/        # ML-enhanced detection (optional)
│       ├── registry/  # Rule definitions
│       └── shared/    # Utilities
├── skill/             # AI skill definitions
│   ├── reference/     # Command documentation
│   ├── scripts/       # Helper scripts
│   └── agents/        # Sub-agent definitions
├── extension/         # Browser extension
└── tests/             # Test suites
```

## ML-Enhanced Detection

Concreto can optionally use ONNX models for context-aware detection:

```bash
# Enable ML detection
concreto detect --ml src/

# Download models
concreto ml download

# Train custom models
concreto ml train --dataset ./patterns
```

### ML Capabilities

- **Context-Aware Rules**: Adjust sensitivity based on project type
- **False Positive Reduction**: Learn from accepted/rejected findings
- **Pattern Recognition**: Detect complex anti-patterns beyond regex
- **Trend Analysis**: Identify emerging patterns across codebase

## Supported Providers

- Claude Code
- Cursor
- OpenCode
- Gemini CLI
- Codex CLI
- GitHub Copilot
- Kiro
- Trae
- Pi

## Contributing

See CONTRIBUTING.md for guidelines.

## License

MIT License - see LICENSE file.
