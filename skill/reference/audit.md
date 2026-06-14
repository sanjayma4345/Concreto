# Audit Command

Comprehensive technical quality check: accessibility, performance, responsive behavior, and anti-patterns.

## Categories

| Category | Checks |
|----------|--------|
| Accessibility | Contrast, keyboard nav, ARIA, landmarks |
| Performance | Render blocking, images, CSS/JS size |
| Responsive | Breakpoints, overflow, touch targets |
| Semantic | Heading hierarchy, labels, titles |
| Visual Anti-Patterns | All 40+ detector rules |

## Flow

### 1. Scope Definition

```bash
concreto audit [target]
```

- No target → Full project
- File path → Single file
- Directory → That directory
- Component name → Find and audit matching components

### 2. Run Detection

Execute all rule checks:

```
[A01-CRITICAL] Color contrast
[A02-CRITICAL] Large text contrast
[A03-CRITICAL] Side-stripe borders
[V01-HIGH] Gray on colored background
... (all 40+ rules)
```

### 3. ML Enhancement (Optional)

With `--ml` flag:
- Context-aware sensitivity
- False positive learning
- Complex pattern detection

### 4. Output

```
Filename: src/components/Hero.astro

CRITICAL (2)
├─ A01-CRITICAL-color-contrast
│  └─ Line 45: "Learn More" button contrast 3.2:1
├─ S01-CRITICAL-skipped-headings
│  └─ h1 → h3 skip in accessibility section

HIGH (3)
├─ V06-HIGH-nested-cards
│  └─ Card contains inner card
...

Summary: Fix 2 critical, 3 high before shipping.
```

## Severities

| Level | Badge | Action |
|-------|-------|--------|
| CRITICAL | 🔴 | Fix immediately |
| HIGH | 🟠 | Fix before shipping |
| MEDIUM | 🔵 | Should fix |
| LOW | ⚪ | Polish |
| INFO | ⚪ | Suggestion |

## Options

```bash
concreto audit [target] [options]

Options:
  --json          JSON output
  --ml            ML-enhanced detection
  --fail-severity Exit 1 on findings at/below this level
  --ignore        Comma-separated rule IDs to ignore
  --only          Run only specified rules
```

## Integration

### CI/CD

```yaml
- name: Concreto Audit
  run: npx concreto audit src/ --fail-severity HIGH --json > report.json
  
- name: Upload Report
  uses: actions/upload-artifact@v4
  with:
    name: concrete-report
    path: report.json
```

### Pre-commit

```bash
#!/bin/bash
npx concreto audit $(git diff --name-only HEAD | grep -E '\.(html|css|js|jsx|ts|tsx|vue|astro)$')
```

## Example

```
> concreto audit src/components/Header.astro

Running 42 rules against Header.astro...

PASSED: 38 rules
FAILED: 4 rules

V01-HIGH-gray-on-colored
  Location: line 72, ".nav-link:hover"
  Issue: Gray text (#888) on dark background
  Fix: Use lighter tint of background or structural text color

V11-MEDIUM-inconsistent-radius
  Location: line 45, ".logo-badge"
  Issue: border-radius: 12px (system uses 0, 4, 8, 16)
  Fix: Use --c-radius-soft (8px) or --c-radius-minimal (4px)

2 more medium findings...

Run `concreto fix Header.astro` for suggested fixes.
```
