---
name: concreto
description: "Use when the user wants to design, analyze, audit, refine, or improve frontend interfaces. Covers websites, landing pages, dashboards, product UI, applications, components, design systems, and any visual interface. Handles UX review, visual hierarchy, information architecture, accessibility, performance, responsive behavior, theming, anti-patterns, typography, spacing, layout, color, motion, micro-interactions, UX copy, error states, and edge cases."
argument-hint: "[command] [target]"
user-invocable: true
allowed-tools:
  - Bash(npx concreto *)
  - Bash(node {{scripts_path}}/*.mjs)
license: MIT
---

Advanced design intelligence for production-grade frontend interfaces. Deterministic rules, ML-enhanced detection, and comprehensive design guidance.

## Setup

**REQUIRED BEFORE PROCEEDING:**

1. Run `node {{scripts_path}}/context.mjs` once per session. If you've seen its output, skip. The script outputs PRODUCT.md (and DESIGN.md when present). **If output reports `NO_PRODUCT_MD`, stop and run `init` before continuing.**
2. If user invoked a sub-command, read `reference/<command>.md` next. Non-optional. The reference defines the command flow.
3. Read at least one project file (CSS/tokens/theme/component). Required even with a sub-command reference loaded. Use existing patterns.
4. Read the matching register reference:
   - `brand` (marketing, landing, portfolio) → `reference/brand.md`
   - `product` (app UI, dashboard, tool) → `reference/product.md`
   Pick by: task cue → surface in focus → `register` in PRODUCT.md.
5. **If no committed brand colors exist**, run `node {{scripts_path}}/palette.mjs` for color seed and composition guidance. Use OKLCH throughout.

## Core Principles

### Production-Grade Output

Ship complete, polished implementations. Not prototypes. Not starting points. Every page, component, and interaction is battle-tested.

### The Test: Would You Sign It?

If you wouldn't put your name on the code, it's not done. This means:
- Zero warnings in browser console
- No placeholder content
- Responsive at every breakpoint
- Keyboard navigable
- Screen reader tested

## Design Rules

### Color

```
[A01-CRITICAL] Verify contrast ≥4.5:1 for body text
[A02-CRITICAL] Verify contrast ≥3:1 for large text
[V01-HIGH] Never gray text on colored backgrounds
[V02-MEDIUM] Tint neutrals toward brand hue, not warmth-default
[V03-LOW] Document color strategy before picking colors
```

**Color Strategy Commitment Axis:**
- Restrained: Tinted neutrals + one accent ≤10%
- Committed: One color covers 30-60%
- Full Palette: 3-4 named roles
- Drenched: Surface IS the color

### Typography

```
[V04-HIGH] Cap body line length at 65-75ch
[V05-MEDIUM] Display heading ceiling: clamp max ≤6rem
[V06-MEDIUM] Display tracking floor: ≥-0.04em
[V07-LOW] Use text-wrap: balance for headings
[V08-LOW] Reject font pairs from same family category
```

### Layout

```
[V09-MEDIUM] Vary spacing for rhythm
[V10-HIGH] Nested cards are always wrong
[V11-MEDIUM] Flexbox for 1D, Grid for 2D
[V12-LOW] Semantic z-index scale
[S01-CRITICAL] Never skip heading levels
```

### Motion

```
[P01-MEDIUM] No animation of layout properties
[P02-MEDIUM] Ease out with exponential curves
[P03-CRITICAL] Reduce motion alternative required
[I01-LOW] Stagger reveals vary by content
[P04-LOW] Premium materials (blur, mask) when beneficial
```

## Command Reference

| Command | Category | Description |
|---------|----------|-------------|
| `craft` | Build | Shape then build end-to-end |
| `shape` | Build | UX/UI planning before code |
| `scaffold` | Build | Generate component boilerplate |
| `synthesize` | Build | Create design tokens |
| `audit` | Analyze | Comprehensive quality check |
| `analyze` | Analyze | Deep semantic analysis |
| `benchmark` | Analyze | Performance metrics |
| `critique` | Analyze | UX design review |
| `polish` | Refine | Final quality pass |
| `refine` | Refine | Targeted improvements |
| `optimize` | Refine | Performance optimization |
| `distill` | Refine | Remove complexity |
| `bolder` | Transform | Amplify visual impact |
| `quieter` | Transform | Reduce visual noise |
| `modernize` | Transform | Update to current standards |
| `breathe` | Transform | Add intentional spacing |
| `animate` | Enhance | Purposeful motion |
| `colorize` | Enhance | Strategic color |
| `typeset` | Enhance | Typography hierarchy |
| `layout` | Enhance | Spacing and rhythm |
| `delight` | Enhance | Memorable touches |
| `overdrive` | Enhance | Extraordinary effects |
| `harden` | Ship | Error handling, edge cases |
| `verify` | Ship | Pre-ship validation |
| `document` | Ship | Generate documentation |
| `live` | Iterate | Visual variant mode |

## Routing

1. **No argument**: Load context signals, recommend 2-3 highest-value commands with reasoning. Never auto-run.
2. **First word matches command**: Load reference, proceed to flow.
3. **Intent maps to command**: Load matching reference. If ambiguous, ask once.
4. **No match**: Apply setup + general design rules to full argument.

## Absolute Bans

Match-and-refuse. Rewrite with different structure:

```
[A03-CRITICAL] Side-stripe borders >1px on cards/lists
[V13-HIGH] Gradient text (background-clip: text)
[V14-HIGH] Glassmorphism as default
[V15-MEDIUM] Hero-metric template
[V16-MEDIUM] Identical card grids (icon + heading + text)
[V17-MEDIUM] Eyebrow on every section
[V18-LOW] Numbered markers on every section
[S02-HIGH] Text overflow at any breakpoint
```

## ML-Enhanced Detection

When `--ml` flag is active:

```bash
node {{scripts_path}}/ml-detect.mjs <path>
```

ML provides:
- Context-aware rule sensitivity
- False positive reduction
- Complex pattern recognition
- Trend analysis

## The Anti-AI Test

If someone can say "AI made this" without doubt, it failed.

**Two-altitude check:**
1. First-order: Can theme be guessed from category? → Rework.
2. Second-order: Can aesthetic family be guessed from anti-references? → Rework deeper.

Both answers must be non-obvious.
