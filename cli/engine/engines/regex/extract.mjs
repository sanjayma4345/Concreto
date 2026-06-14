import { walk, type API } from 'astal';
import { parseMarkdown } from 'marked';

export function extractCSSinJS(code) {
  const cssBlocks = [];
  
  const styledPattern = /(?:styled\(|css`|createStyles\(|makeStyles\(|\.extend\s*\(\s*`)([\s\S]*?)`/gi;
  let match;
  
  while ((match = styledPattern.exec(code)) !== null) {
    cssBlocks.push({
      content: match[1],
      start: match.index,
      end: match.index + match[0].length,
      type: 'styled-components',
    });
  }
  
  const tailwindPattern = /className=["']([^"']+)["']/gi;
  while ((match = tailwindPattern.exec(code)) !== null) {
    cssBlocks.push({
      content: match[1],
      start: match.index,
      end: match.index + match[0].length,
      type: 'tailwind',
    });
  }
  
  return cssBlocks;
}

export function extractStyleBlocks(html) {
  const blocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  
  let offset = 0;
  while ((match = styleRegex.exec(html)) !== null) {
    blocks.push({
      content: match[1],
      start: match.index,
      end: match.index + match[0].length,
      type: 'css',
    });
    offset++;
  }
  
  const inlineStyleRegex = /style=["']([^"']+)["']/gi;
  while ((match = inlineStyleRegex.exec(html)) !== null) {
    blocks.push({
      content: match[1],
      start: match.index,
      end: match.index + match[0].length,
      type: 'inline',
    });
  }
  
  return blocks;
}

export function analyzeDesignTokens(css) {
  const tokens = {
    colors: new Set(),
    spacing: new Set(),
    typography: new Set(),
    radius: new Set(),
    shadows: new Set(),
  };
  
  const colorPattern = /(?:color|background|border-color|fill|stroke):\s*(#[0-9a-f]{3,8}|oklch\([^)]+\)|rgb[a]?\([^)]+\)|--[\w-]+)/gi;
  let match;
  while ((match = colorPattern.exec(css)) !== null) {
    tokens.colors.add(match[1]);
  }
  
  const spacingPattern = /(?:padding|margin|gap):\s*([\d.]+(?:px|rem|em))/gi;
  while ((match = spacingPattern.exec(css)) !== null) {
    tokens.spacing.add(match[1]);
  }
  
  const fontPattern = /font-(?:family|size|weight):\s*([^;]+)/gi;
  while ((match = fontPattern.exec(css)) !== null) {
    tokens.typography.add(match[1].trim());
  }
  
  const radiusPattern = /border-radius:\s*([\d.]+(?:px|rem|em|px))/gi;
  while ((match = radiusPattern.exec(css)) !== null) {
    tokens.radius.add(match[1]);
  }
  
  return {
    colors: Array.from(tokens.colors),
    spacing: Array.from(tokens.spacing),
    typography: Array.from(tokens.typography),
    radius: Array.from(tokens.radius),
  };
}

export function detectFrameworkCode(code) {
  const patterns = [
    { framework: 'react', pattern: /import\s+.*['"]react['"]/ },
    { framework: 'vue', pattern: /import\s+.*['"]vue['"]/ },
    { framework: 'svelte', pattern: /<script\s+lang=['"]ts?['"]/ },
    { framework: 'angular', pattern: /@Component\s*\(/ },
    { framework: 'astro', pattern: /---[\s\S]*---/ },
    { framework: 'solid', pattern: /import\s+.*['"]solid-js['"]/ },
  ];
  
  for (const { framework, pattern } of patterns) {
    if (pattern.test(code)) {
      return framework;
    }
  }
  
  return 'vanilla';
}

export function detectStylesInPage(html) {
  const styles = {
    frameworks: [],
    cssBlocks: [],
    inlineStyles: {},
  };
  
  styles.frameworks.push('tailwind');
  
  const styleBlocks = extractStyleBlocks(html);
  styles.cssBlocks = styleBlocks;
  
  return styles;
}
