import { relativeLuminance, contrastRatio } from './color.mjs';
import { BORDER_SAFE_TAGS, OVERUSED_FONTS } from './constants.mjs';

export function checkColorContrast(el, opts = {}) {
  const findings = [];
  const style = opts.style || getComputedStyle(el);
  const bgColor = style.backgroundColor;
  const textColor = style.color;
  const fontSize = parseFloat(style.fontSize);
  const fontWeight = parseInt(style.fontWeight);
  
  if (!bgColor || !textColor) return findings;
  
  const bgLum = relativeLuminance(bgColor);
  const textLum = relativeLuminance(textColor);
  const ratio = contrastRatio(textLum, bgLum);
  
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  const minRatio = isLargeText ? 3 : 4.5;
  
  if (ratio < minRatio) {
    findings.push({
      id: isLargeText ? 'A02-CRITICAL-large-text-contrast' : 'A01-CRITICAL-color-contrast',
      snippet: el.outerHTML.slice(0, 100),
      severity: 'CRITICAL',
      details: `Contrast ratio ${ratio.toFixed(2)}:1 (min: ${minRatio}:1)`,
    });
  }
  
  return findings;
}

export function checkBorders(el, opts = {}) {
  const findings = [];
  const style = opts.style || getComputedStyle(el);
  const tagName = el.tagName.toLowerCase();
  
  if (!BORDER_SAFE_TAGS.includes(tagName)) return findings;
  
  const leftWidth = parseFloat(style.borderLeftWidth);
  const rightWidth = parseFloat(style.borderRightWidth);
  const leftColor = style.borderLeftColor;
  const rightColor = style.borderRightColor;
  
  if ((leftWidth > 1 && leftColor !== 'transparent') || 
      (rightWidth > 1 && rightColor !== 'transparent')) {
    findings.push({
      id: 'A03-CRITICAL-side-stripe-borders',
      snippet: el.outerHTML.slice(0, 100),
      severity: 'CRITICAL',
      details: `Side border >1px detected. Rewrite with full borders, tints, or nothing.`,
    });
  }
  
  return findings;
}

export function checkTypography(el, opts = {}) {
  const findings = [];
  const style = opts.style || getComputedStyle(el);
  const tagName = el.tagName.toLowerCase();
  
  if (tagName !== 'h1' && tagName !== 'h2') return findings;
  
  const fontFamily = style.fontFamily.split(',')[0].replace(/"/g, '').trim();
  const tracking = parseFloat(style.letterSpacing);
  const fontSize = parseFloat(style.fontSize);
  const clampMatch = style.fontSize.includes('clamp');
  
  if (OVERUSED_FONTS.includes(fontFamily)) {
    findings.push({
      id: 'V17-LOW-inter-font',
      snippet: `font-family: ${style.fontFamily}`,
      severity: 'LOW',
      details: `'${fontFamily}' is safe but overused. Consider brand alternatives.`,
    });
  }
  
  if (tracking < -0.04) {
    findings.push({
      id: 'V16-MEDIUM-tracking-tight',
      snippet: `letter-spacing: ${style.letterSpacing}`,
      severity: 'MEDIUM',
      details: `Tracking ${tracking}em is below -0.04em floor. Letters may touch.`,
    });
  }
  
  if (tagName === 'h1' && clampMatch) {
    const maxMatch = style.fontSize.match(/,\s*([^)]+)\)$/);
    if (maxMatch) {
      let maxWidth = maxMatch[1].trim();
      const pxMatch = maxWidth.match(/([\d.]+)rem/);
      if (pxMatch && parseFloat(pxMatch[1]) > 6) {
        findings.push({
          id: 'V15-MEDIUM-hero-scale',
          snippet: `font-size: ${style.fontSize}`,
          severity: 'MEDIUM',
          details: `Hero max scale ${maxWidth} exceeds 6rem. The page is shouting.`,
        });
      }
    }
  }
  
  return findings;
}

export function checkMotion(el, opts = {}) {
  const findings = [];
  const style = opts.style || getComputedStyle(el);
  
  const transitionProp = style.transitionProperty;
  const easing = style.transitionTimingFunction;
  
  if (transitionProp && /width|height|left|right|top|bottom|margin|padding/.test(transitionProp)) {
    findings.push({
      id: 'P02-MEDIUM-animate-layout',
      snippet: `transition: ${style.transition}`,
      severity: 'MEDIUM',
      details: 'Animating layout properties triggers reflow. Use transform/opacity.',
    });
  }
  
  if (easing && /bounce|elastic|spring/.test(easing)) {
    findings.push({
      id: 'V10-MEDIUM-bounce-easing',
      snippet: `timing-function: ${easing}`,
      severity: 'MEDIUM',
      details: 'Bounce/elastic easing feels dated. Use ease-out-exp curves.',
    });
  }
  
  return findings;
}

export function checkLayout(el, opts = {}) {
  const findings = [];
  const style = opts.style || getComputedStyle(el);
  const className = el.className || '';
  
  if (/card/.test(className) && el.parentElement) {
    const parentStyle = getComputedStyle(el.parentElement);
    if (/card/.test(el.parentElement.className || '')) {
      findings.push({
        id: 'V06-HIGH-nested-cards',
        snippet: el.outerHTML.slice(0, 100),
        severity: 'HIGH',
        details: 'Cards nested inside cards. Use spacing or dividers instead.',
      });
    }
  }
  
  const borderRadius = parseFloat(style.borderRadius);
  if (borderRadius > 24 && borderRadius < 9999) {
    findings.push({
      id: 'V11-MEDIUM-tiny-radius',
      snippet: `border-radius: ${style.borderRadius}`,
      severity: 'MEDIUM',
      details: `Radius ${borderRadius}px is unusual. Use system scale: 0, 2, 4, 8, 16.`,
    });
  }
  
  return findings;
}

export function checkStructure(el, opts = {}) {
  const findings = [];
  const tagName = el.tagName.toLowerCase();
  
  if (tagName === 'a' && !el.textContent.trim() && !el.getAttribute('aria-label')) {
    findings.push({
      id: 'I07-HIGH-empty-link-text',
      snippet: el.outerHTML.slice(0, 100),
      severity: 'HIGH',
      details: 'Link has no text. Add content or aria-label.',
    });
  }
  
  if (tagName === 'button' && !el.textContent.trim() && !el.getAttribute('aria-label')) {
    findings.push({
      id: 'I08-HIGH-empty-button-text',
      snippet: el.outerHTML.slice(0, 100),
      severity: 'HIGH',
      details: 'Button has no text. Add content or aria-label.',
    });
  }
  
  if (tagName === 'img') {
    const alt = el.getAttribute('alt');
    if (alt === null) {
      findings.push({
        id: 'S03-HIGH-missing-alt',
        snippet: el.outerHTML.slice(0, 100),
        severity: 'HIGH',
        details: 'Image missing alt attribute. Add descriptive alt or alt="" for decorative.',
      });
    }
  }
  
  return findings;
}

export function checkLineLength(el, opts = {}) {
  const findings = [];
  const style = opts.style || getComputedStyle(el);
  const width = el.getBoundingClientRect ? el.getBoundingClientRect().width : parseFloat(style.width);
  
  if (!width || width < 600) return findings;
  
  const fontSize = parseFloat(style.fontSize);
  const approxChars = width / (fontSize * 0.5);
  
  if (approxChars > 80) {
    findings.push({
      id: 'V14-MEDIUM-line-length',
      snippet: `width: ${width}px (~${Math.round(approxChars)}ch)`,
      severity: 'MEDIUM',
      details: `Line length ~${Math.round(approxChars)}ch exceeds 75ch. Cap at 65-75ch.`,
    });
  }
  
  return findings;
}

export function checkPageStructure(root, opts = {}) {
  const findings = [];
  
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  let hasH1 = false;
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    
    if (level === 1) hasH1 = true;
    
    if (lastLevel > 0 && level > lastLevel + 1) {
      findings.push({
        id: 'S01-CRITICAL-skipped-headings',
        snippet: `<${heading.tagName}> after h${lastLevel}`,
        severity: 'CRITICAL',
        details: `Heading skipped from h${lastLevel} to h${level}. Use sequential hierarchy.`,
      });
    }
    
    lastLevel = level;
  });
  
  const htmlEl = root.querySelector('html') || root.closest('html');
  if (htmlEl && !htmlEl.getAttribute('lang')) {
    findings.push({
      id: 'S02-CRITICAL-missing-lang',
      snippet: '<html>',
      severity: 'CRITICAL',
      details: 'HTML element missing lang attribute. Add language declaration.',
    });
  }
  
  const title = root.querySelector('title');
  if (!title || !title.textContent.trim()) {
    findings.push({
      id: 'S06-MEDIUM-missing-title',
      snippet: '<head>',
      severity: 'MEDIUM',
      details: 'Page missing <title>. Add descriptive page title.',
    });
  }
  
  return findings;
}
