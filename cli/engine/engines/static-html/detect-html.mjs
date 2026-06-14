import { ANTIPATTERNS, SEVERITY_LEVELS } from '../registry/antipatterns.mjs';
import { checkColorContrast, checkBorders, checkTypography, checkMotion, checkLayout, checkStructure, checkLineLength } from '../rules/checks.mjs';
import { checkPageStructure } from '../rules/checks.mjs';
import { SAFE_TAGS, SKIP_DIRS, SCANNABLE_EXTENSIONS } from '../shared/constants.mjs';

export async function detectHtml(html, options = {}) {
  const findings = [];
  const { url, ml = false } = options;
  
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  const pageFindings = checkPageStructure(doc);
  findings.push(...pageFindings);
  
  const walker = doc.createTreeWalker(doc.body || doc, NodeFilter.SHOW_ELEMENT);
  let el = walker.currentNode;
  
  while (el) {
    if (!SAFE_TAGS.includes(el.tagName?.toLowerCase())) {
      el = walker.nextNode(el);
      continue;
    }
    
    const style = dom.window.getComputedStyle(el);
    
    findings.push(...checkColorContrast(el, { style }));
    findings.push(...checkBorders(el, { style }));
    findings.push(...checkTypography(el, { style }));
    findings.push(...checkMotion(el, { style }));
    findings.push(...checkLayout(el, { style }));
    findings.push(...checkStructure(el));
    findings.push(...checkLineLength(el, { style }));
    
    el = walker.nextNode();
  }
  
  if (ml) {
    const mlFindings = await runMLDetection(doc, html);
    findings.push(...mlFindings);
  }
  
  return dedupeFindings(findings);
}

export function detectText(text, options = {}) {
  const findings = [];
  
  const gradientTextPattern = /background-clip\s*:\s*text/i;
  if (gradientTextPattern.test(text)) {
    const matches = text.match(/background-clip\s*:\s*text[^;}]*/gi) || [];
    matches.forEach(match => {
      findings.push({
        id: 'V02-HIGH-gradient-text',
        snippet: match,
        severity: 'HIGH',
        details: 'Gradient text detected. Use solid color instead.',
      });
    });
  }
  
  const bounceEasingPattern = /transition-timing-function\s*:\s*[^;]*bounce/i;
  if (bounceEasingPattern.test(text)) {
    findings.push({
      id: 'V10-MEDIUM-bounce-easing',
      snippet: text.match(/transition-timing-function[^;]+/i)?.[0] || 'bounce easing',
      severity: 'MEDIUM',
      details: 'Bounce/elastic easing detected.',
    });
  }
  
  const skippedHeadings = text.match(/<h(\d)[^>]*>[\s\S]*?<h(\d)/gi);
  if (skippedHeadings) {
    skippedHeadings.forEach(match => {
      const levels = match.match(/<h(\d)/gi)?.map(h => parseInt(h.slice(2)));
      if (levels && levels[1] > levels[0] + 1) {
        findings.push({
          id: 'S01-CRITICAL-skipped-headings',
          snippet: match.slice(0, 50),
          severity: 'CRITICAL',
          details: `Heading skipped from h${levels[0]} to h${levels[1]}`,
        });
      }
    });
  }
  
  const nestedCardsPattern = /class="[^"]*card[^"]*"[^>]*>[\s\S]*?<[^>]*class="[^"]*card[^"]*"/i;
  if (nestedCardsPattern.test(text)) {
    findings.push({
      id: 'V06-HIGH-nested-cards',
      snippet: 'Nested card elements',
      severity: 'HIGH',
      details: 'Cards detected inside cards. Use spacing or dividers instead.',
    });
  }
  
  return findings;
}

async function runMLDetection(doc, html) {
  const findings = [];
  
  const buttons = doc.querySelectorAll('button, [role="button"], .btn, .button');
  buttons.forEach(btn => {
    const bbox = btn.getBoundingClientRect ? btn.getBoundingClientRect() : null;
    const width = bbox?.width || parseFloat(btn.style.width) || 100;
    const height = bbox?.height || parseFloat(btn.style.height) || 40;
    
    if (width < 44 || height < 44) {
      findings.push({
        id: 'I01-HIGH-tap-target-size',
        snippet: btn.outerHTML?.slice(0, 100) || `button ${width}x${height}`,
        severity: 'HIGH',
        details: `Button ${Math.round(width)}x${Math.round(height)} below 44×44px minimum.`,
        ml: true,
      });
    }
  });
  
  const toastNotifications = doc.querySelectorAll('[class*="toast"], [class*="notification"], [role="alert"]');
  toastNotifications.forEach(toast => {
    if (!toast.textContent.trim()) {
      findings.push({
        id: 'I08-HIGH-empty-button-text',
        snippet: toast.outerHTML?.slice(0, 100) || 'empty toast',
        severity: 'HIGH',
        details: 'Toast/reminder without text content detected.',
        ml: true,
      });
    }
  });
  
  return findings;
}

async function runMLPatternRecognition(html) {
  try {
    const findings = [];
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const heroMetricPattern = /\d+(\.\d+)?[km]?\s*(%|users|customers|projects|teams)?\s*<\/span>\s*<(?:p|div|span)[^>]*(?:class|label|caption)/i;
    if (heroMetricPattern.test(html)) {
      const match = html.match(heroMetricPattern);
      findings.push({
        id: 'V04-HIGH-hero-metric-template',
        snippet: match[0].slice(0, 100),
        severity: 'HIGH',
        details: 'Hero metric pattern detected. Avoid number+label+gradient template.',
        ml: true,
      });
    }
    
    return findings;
  } catch {
    return [];
  }
}

function dedupeFindings(findings) {
  const seen = new Map();
  const result = [];
  
  findings.forEach(finding => {
    const key = `${finding.id}:${finding.snippet}`;
    if (!seen.has(key)) {
      seen.set(key, true);
      result.push(finding);
    }
  });
  
  return result;
}

export async function detectUrl(url, options = {}) {
  const puppeteer = await import('puppeteer');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  let findings = [];
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    findings = await page.evaluate(() => {
      const results = [];
      
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName[1]);
        if (lastLevel > 0 && level > lastLevel + 1) {
          results.push({
            id: 'S01-CRITICAL-skipped-headings',
            snippet: `<h${level}>`,
            severity: 'CRITICAL',
            details: `Heading skipped from h${lastLevel} to h${level}`,
          });
        }
        lastLevel = level;
      });
      
      document.querySelectorAll('*').forEach(el => {
        const style = getComputedStyle(el);
        if (/bounce|elastic|spring/.test(style.transitionTimingFunction)) {
          results.push({
            id: 'V10-MEDIUM-bounce-easing',
            snippet: 'bounce easing',
            severity: 'MEDIUM',
            details: 'Bounce/elastic easing detected.',
          });
        }
      });
      
      return results;
    });
    
    if (options.ml) {
      findings.push(...await runMLPatternRecognition(await page.content()));
    }
  } finally {
    await browser.close();
  }
  
  return dedupeFindings(findings);
}

export function createBrowserDetector() {
  return {
    detect: () => {
      const findings = [];
      
      const style = document.createElement('style');
      style.textContent = '.concreto-highlight { outline: 3px solid var(--c-safety, #f59e0b) !important; }';
      document.head.appendChild(style);
      
      document.querySelectorAll('*').forEach(el => {
        
      });
      
      return findings;
    },
    highlight: (selector) => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('concreto-highlight');
      });
    },
    clearHighlights: () => {
      document.querySelectorAll('.concreto-highlight').forEach(el => {
        el.classList.remove('concreto-highlight');
      });
    },
  };
}
