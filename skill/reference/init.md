---
name: concrete-life
description: "Liquid, adaptable, living design. Clay becomes architecture. Flow patterns merge with solid foundations."
---

# Init Command

Initialize Concreto in your project. Creates configuration, detects framework, and sets up the design system.

## Flow

### 1. Check Existing Configuration

```bash
if [ -f PRODUCT.md ]; then
  echo "Concreto already initialized"
  exit 0
fi
```

### 2. Detect Project Type

Look for:
- Framework configs (next.config.js, vite.config.ts, astro.config.mjs)
- Package manager (package.json)
- Existing design system

### 3. Create PRODUCT.md

```markdown
# Product

## Register

[brand | product]

## Users

[Describe target users]

## Product Purpose

[What success looks like]

## Brand Personality

[Three words]

## Design Principles

1. Practice what you preach
2. Show, don't tell
3. [Project-specific principles]
```

### 4. Offer DESIGN.md

Ask: "Would you like me to create a DESIGN.md with design tokens and system guidelines?"

If yes:
- Detect existing colors/fonts from codebase
- Generate token file
- Create component catalog

### 5. Install Skill

Copy skill files to appropriate provider directories:
- `.claude/skills/concreto/` for Claude Code
- `.cursor/skills/concreto/` for Cursor
- `.opencode/skills/concreto/` for OpenCode

### 6. Recommend Next Steps

Based on project state:
- New project → `/concreto shape [feature]`
- Existing project → `/concreto audit` or `/concreto document`
- Something broken → `/concreto audit [component]`

## Options

```bash
concreto init [--minimal] [--force]
```

- `--minimal` - Skip DESIGN.md, just PRODUCT.md
- `--force` - Overwrite existing configuration

## Example

```
> concreto init

Detected Astro project with existing component library.

Created PRODUCT.md with 'product' register.
Created DESIGN.md with extracted design tokens.

Installed Concreto skill for:
  ✓ Claude Code (.claude/skills/concreto/)
  ✓ Cursor (.cursor/skills/concreto/)

Recommended next steps:
  1. /concreto audit - Check current quality
  2. /concreto document - Capture design system
  3. /concreto shape [feature] - Plan new work
```
