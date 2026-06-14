import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PRODUCT_MD = `# Product

## Register

brand

## Users

[Describe your target users]

## Product Purpose

[What does this product do? What does success look like?]

## Brand Personality

[Three words that describe your brand]

## Design Principles

1. Practice what you preach
2. Show, don't tell
3. [Add project-specific principles]
`;

const DESIGN_MD = `---
title: Design System
name: project
description: Design system configuration
colors:
  brand-primary: "oklch(55% 0.15 240)"
  brand-secondary: "oklch(70% 0.12 180)"
  background: "oklch(98% 0.005 95)"
  surface: "oklch(95% 0.008 95)"
  text: "oklch(15% 0.01 95)"
  muted: "oklch(50% 0.01 95)"

typography:
  display:
    fontFamily: "system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 700
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
---

# Design System

## Colors

Use OKLCH for all color definitions.

## Typography

Define your type scale here.

## Components

Document reusable component patterns.
`;

async function initializeProject() {
  console.log('\nInitializing Concreto...\n');
  
  let hasProduct = false;
  try {
    await fs.promises.access('PRODUCT.md');
    hasProduct = true;
  } catch {}
  
  let hasDesign = false;
  try {
    await fs.promises.access('DESIGN.md');
    hasDesign = true;
  } catch {}
  
  if (hasProduct && hasDesign) {
    console.log('✓ Project already initialized');
    console.log('  PRODUCT.md exists');
    console.log('  DESIGN.md exists');
    return;
  }
  
  if (!hasProduct) {
    await fs.promises.writeFile('PRODUCT.md', PRODUCT_MD);
    console.log('✓ Created PRODUCT.md');
  }
  
  if (!hasDesign) {
    await fs.promises.writeFile('DESIGN.md', DESIGN_MD);
    console.log('✓ Created DESIGN.md');
  }
  
  console.log('\nNext steps:');
  console.log('  1. Edit PRODUCT.md with your project details');
  console.log('  2. Customize DESIGN.md with your design tokens');
  console.log('  3. Run /concreto audit to check your codebase');
}

export { initializeProject };
