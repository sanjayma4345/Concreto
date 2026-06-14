export const SAFE_TAGS = ['div', 'section', 'article', 'aside', 'nav', 'main', 'header', 'footer', 'span', 'p', 'a', 'button', 'input', 'label', 'li', 'td'];
export const BORDER_SAFE_TAGS = ['div', 'section', 'article', 'aside', 'li', 'tr', 'td'];
export const OVERUSED_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'];
export const GENERIC_FONTS = ['Arial', 'Helvetica', 'sans-serif', 'system-ui'];
export const KNOWN_SERIF_FONTS = ['Georgia', 'Times New Roman', 'Times', 'serif'];

export const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'vendor', '__pycache__'];
export const SCANNABLE_EXTENSIONS = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro'];

export function parseRgb(color) {
  if (!color || color === 'transparent') return null;
  
  const match = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+)\s*)?\)/i);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] !== undefined ? parseFloat(match[4]) : 1,
    };
  }
  
  const hexMatch = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
      a: hexMatch[4] ? parseInt(hexMatch[4], 16) / 255 : 1,
    };
  }
  
  return null;
}

export function relativeLuminance(color) {
  const rgb = parseRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function parseGradientColors(gradient) {
  if (!gradient || gradient === 'none') return [];
  
  const colors = [];
  const colorRegex = /(oklch|rgb|rgba|hsl|hsla|#[0-9a-f]+)\s*\([^)]+\)|#[0-9a-f]+/gi;
  let match;
  
  while ((match = colorRegex.exec(gradient)) !== null) {
    colors.push(match[0]);
  }
  
  return colors;
}

export function hasChroma(color) {
  const oklchMatch = color.match(/oklch\s*\(\s*[\d.]+%\s+([\d.]+)/i);
  if (oklchMatch) {
    return parseFloat(oklchMatch[1]) > 0.01;
  }
  return false;
}

export function getHue(color) {
  const oklchMatch = color.match(/oklch\s*\(\s*[\d.]+%\s+[\d.]+\s+([\d.]+)/i);
  if (oklchMatch) {
    return parseFloat(oklchMatch[1]);
  }
  
  const { r, g, b } = parseRgb(color) || { r: 0, g: 0, b: 0 };
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  if (d === 0) return 0;
  
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  
  return Math.round(h * 60 + 360) % 360;
}

export function colorToHex(color) {
  const rgb = parseRgb(color);
  if (!rgb) return null;
  
  const toHex = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function isNeutralColor(color) {
  const hue = getHue(color);
  return hue >= 80 && hue <= 100;
}
