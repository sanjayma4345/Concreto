# Craft Command

Full design-build cycle. Shape the UX/UI, then implement end-to-end.

## Philosophy

Craft uses a "shape-first" approach:
1. Understand the problem
2. Plan the solution
3. Build with precision
4. Validate thoroughly

## Flow

### Phase 1: Understand

Research and gather context:

```
1. Read PRODUCT.md, DESIGN.md
2. Understand existing patterns in codebase
3. Identify the core user need
4. Define success criteria
```

Ask clarifying questions:
- "What's the primary action users should take?"
- "What existing patterns should this follow?"
- "Any constraints or non-goals?"

### Phase 2: Plan (Shape)

Before writing code, plan:

```
/concreto shape [feature]

Creates:
├─ User flow diagram
├─ Component hierarchy
├─ State requirements
├─ Edge cases list
└─ Responsive behavior plan
```

### Phase 3: Build

Implementation with continuous validation:

```
1. Scaffold the structure
2. Implement core functionality
3. Add polish and interactions
4. Handle edge cases
5. Verify accessibility
```

### Phase 4: Validate

Run checks:

```bash
/concreto audit [built-component]
/concreto verify [built-component]
```

## Example

```
> /concreto craft user dashboard

Let me understand the requirements...

Reading PRODUCT.md... ✓
Reading DESIGN.md... ✓
Scanning existing dashboard components... ✓

Before I build, I plan:

USER FLOW:
1. User lands on dashboard
2. Sees key metrics (tasks, projects, deadlines)
3. Can drill down into each section
4. Quick actions available

COMPONENTS:
├─ DashboardShell
├─ MetricsGrid
│  ├─ MetricCard (reusable)
│  └─ MetricChart
├─ TaskList
└─ QuickActions

RESPONSIVE:
- Desktop: 12-column grid
- Tablet: 6-column, stacked metrics
- Mobile: Single column, collapsible sections

Shall I proceed with implementation?

[User confirms]

Building DashboardShell...
Building MetricCard...
Building TaskList...

Running Concreto audit...

✓ 0 critical
✓ 0 high
⚠ 2 medium (non-blocking)

Dashboard complete. Next:
- /concreto audit dashboard --ml
- /concreto harden dashboard
```

## Options

```bash
/concreto craft [feature] [--skip-shape] [--iterative]
```

- `--skip-shape` - Skip planning, go straight to build
- `--iterative` - Build in visible iterations with review
