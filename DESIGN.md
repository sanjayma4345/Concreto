---
title: Producto Concreto
name: concreto
description: Sistema de diseño industrial - concreto crudo, precisión arquitectónica, funcionalidad brutalista
colors:
  brand:
    raw-concrete: "oklch(58% 0.008 95)"
    poured-concrete: "oklch(45% 0.010 95)"
    polished-concrete: "oklch(72% 0.006 95)"
  
  surfaces:  
    foundation: "oklch(12% 0.005 95)"
    slab: "oklch(18% 0.006 95)"
    formwork: "oklch(25% 0.007 95)"
  
  reinforcement:
    rebar: "oklch(35% 0.008 95)"
    mesh: "oklch(28% 0.007 95)"
  
  accent:
    safety-orange: "oklch(68% 0.20 40)"
    marker-blue: "oklch(55% 0.18 240)"
    grading-yellow: "oklch(80% 0.16 85)"
  
  text:
    structural: "oklch(92% 0 0)"
    architectural: "oklch(78% 0 0)"
    blueprint: "oklch(55% 0 0)"

typography:
  display:
    fontFamily: "'Space Grotesk', 'JetBrains Mono', system-ui, monospace"
    fontWeight: 700
    letterSpacing: "-0.02em"
  
  headline:
    fontFamily: "'Space Grotesk', 'JetBrains Mono', system-ui, monospace"
    fontWeight: 600
    letterSpacing: "-0.01em"
  
  body:
    fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif"
    fontWeight: 400
  
  mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontWeight: 400

spacing:
  grid-unit: "8px"
  module: "24px"
  span: "48px"
  section: "96px"

radius:
  none: "0"
  micro: "2px"
  minimal: "4px"
  soft: "8px"
---

# Design System: Concreto

## Concepto: Arquitectura Industrial

Concreto es un sistema de diseño inspirado en la arquitectura brutalista y la estética industrial. Crudo, honesto, funcional. Material honesto sin ornamentos innecesarios.

### Principios

1. **Honestidad Material** - El diseño refleja su función
2. **Precisión Estructural** - Cada elemento tiene propósito
3. **Textura Cruda** - Imperfecciones como característica
4. **Construcción Modular** - Sistemas repetibles y escalables

## Paleta de Colores

### Superficies

```css
--c-foundation: oklch(12% 0.005 95);  /* Base profunda */
--c-slab: oklch(18% 0.006 95);         /* Superficie principal */
--c-formwork: oklch(25% 0.007 95);     /* Elementos elevados */
--c-polished: oklch(72% 0.006 95);     /* Highlight sutil */
```

### Acentos de Seguridad

```css
--c-safety: oklch(68% 0.20 40);     /* Naranja seguridad */
--c-marker: oklch(55% 0.18 240);    /* Azul marcador */
--c-grading: oklch(80% 0.16 85);    /* Amarillo grading */
```

### Gradiente de Texto

```css
--c-structural: oklch(92% 0 0);     /* Headlines */
--c-architectural: oklch(78% 0 0);  /* Body */
--c-blueprint: oklch(55% 0 0);      /* Labels */
```

## Tipografía

### Familias

- **Display/Headlines**: Space Grotesk (monoespaciada geométrica)
- **Body**: Inter (sans-serif humanista)
- **Código**: JetBrains Mono (monoespaciada)

### Jerarquía

```css
/* Display - H1 */
font-size: clamp(2.5rem, 5vw, 4.5rem);
font-weight: 700;
letter-spacing: -0.02em;

/* Headline - H2 */
font-size: clamp(1.75rem, 3vw, 2.5rem);
font-weight: 600;
letter-spacing: -0.01em;

/* Body */
font-size: 1rem;
font-weight: 400;
line-height: 1.7;
max-width: 75ch;

/* Label/Mono */
font-size: 0.75rem;
font-weight: 500;
letter-spacing: 0.08em;
text-transform: uppercase;
```

## Componentes

### Buttons

```css
/* Primary - Filled */
background: var(--c-safety);
color: var(--c-foundation);
border: none;
border-radius: 0;
padding: 16px 32px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;

/* Secondary - Outlined */
background: transparent;
color: var(--c-structural);
border: 2px solid var(--c-structural);
```

### Cards

```css
background: var(--c-slab);
border: 1px solid oklch(30% 0.008 95);
border-radius: 0;
padding: 24px;
```

### Inputs

```css
background: var(--c-foundation);
border: 2px solid var(--c-formwork);
border-radius: 0;
padding: 12px 16px;
color: var(--c-structural);
font-family: 'JetBrains Mono', monospace;
```

## Grid System

### Container

```css
max-width: 1440px;
padding: 0 24px;
margin: 0 auto;
```

### Grid

```css
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 24px;
```

## Motion

### Transiciones

```css
--ease-structure: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-pour: cubic-bezier(0.4, 0, 0.2, 1);

transition-duration: 200ms;
transition-timing-function: var(--ease-structure);
```

### Hover States

```css
/* Elementos estructurales */
transform: translateY(-2px);
box-shadow: 0 4px 12px oklch(0% 0 0 / 0.3);

/* Botones */
filter: brightness(1.1);
```

## Reglas de Aplicación

### Uso de Color

1. **Fondo**: Siempre foundation o slab
2. **Texto**: Structural para headlines, architectural para body
3. **Acentos**: Solo para calls-to-action y estados activos
4. **Evitar**: Gradientes, sombras decorativas, glossy

### Tipografía

1. **Display**: Solo para H1/H2
2. **Body**: Todo copy de lectura
3. **Mono**: Labels, código, datos
4. **Evitar**: Font weights < 400, line-height < 1.5

### Layout

1. **Espaciado**: Múltiplos de 8px
2. **Alineación**: Izquierda o grid
3. **Evitar**: Centrado decorativo, gaps inconsistentes

## Anti-Patrones Detectados

Concreto detecta y rechaza:

- V13-HIGH: Texto gradiente
- V14-HIGH: Glassmorphism
- V17-MEDIUM: Eyebrows automáticos
- V18-LOW: Numeración automática
- A01-CRITICAL: Contraste insuficiente
- V10-HIGH: Cards anidados
- V01-HIGH: Texto gris sobre color
