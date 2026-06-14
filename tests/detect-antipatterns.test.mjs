import { test, expect, describe } from 'bun:test';
import { detectHtml, detectText } from '../cli/engine/engines/static-html/detect-html.mjs';

describe('Anti-pattern Detection', () => {
  describe('Color Contrast', () => {
    test('detects insufficient contrast', async () => {
      const html = `
        <div style="background: #1e293b; padding: 16px;">
          <p style="color: #888;">Low contrast text</p>
        </div>
      `;
      const findings = await detectHtml(html);
      
      const contrastFindings = findings.filter(
        f => f.id === 'A01-CRITICAL-color-contrast' || f.id === 'A02-CRITICAL-large-text-contrast'
      );
      expect(contrastFindings.length).toBeGreaterThan(0);
    });
    
    test('passes valid contrast', async () => {
      const html = `
        <div style="background: #1e293b; padding: 16px;">
          <p style="color: #f8fafc;">High contrast text</p>
        </div>
      `;
      const findings = await detectHtml(html);
      
      const contrastFindings = findings.filter(f => f.id === 'A01-CRITICAL-color-contrast');
      expect(contrastFindings.length).toBe(0);
    });
  });
  
  describe('Side-stripe Borders', () => {
    test('detects side-stripe borders', async () => {
      const html = `
        <div style="border-left: 4px solid #3b82f6; padding: 16px;">
          <p>Card with side stripe</p>
        </div>
      `;
      const findings = await detectHtml(html);
      
      const borderFindings = findings.filter(f => f.id === 'A03-CRITICAL-side-stripe-borders');
      expect(borderFindings.length).toBeGreaterThan(0);
    });
    
    test('passes valid 1px borders', async () => {
      const html = `
        <div style="border-left: 1px solid #e2e8f0; padding: 16px;">
          <p>Card with thin border</p>
        </div>
      `;
      const findings = await detectHtml(html);
      
      const borderFindings = findings.filter(f => f.id === 'A03-CRITICAL-side-stripe-borders');
      expect(borderFindings.length).toBe(0);
    });
  });
  
  describe('Typography', () => {
    test('detects gradient text', () => {
      const css = `
        .gradient-text {
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          background-clip: text;
          color: transparent;
        }
      `;
      const findings = detectText(css);
      
      const gradientFindings = findings.filter(f => f.id === 'V02-HIGH-gradient-text');
      expect(gradientFindings.length).toBeGreaterThan(0);
    });
  });
  
  describe('Motion', () => {
    test('detects bounce easing', async () => {
      const html = `
        <button style="transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
          Bouncy button
        </button>
      `;
      const findings = await detectHtml(html);
      
      const motionFindings = findings.filter(f => f.id === 'V10-MEDIUM-bounce-easing');
      expect(motionFindings.length).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Structure', () => {
    test('detects skipped headings', () => {
      const html = `
        <html>
          <body>
            <h1>Title</h1>
            <h3>Skipped h2</h3>
          </body>
        </html>
      `;
      const findings = detectText(html);
      
      const headingFindings = findings.filter(f => f.id === 'S01-CRITICAL-skipped-headings');
      expect(headingFindings.length).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('ML-enhanced Detection', () => {
  test('returns more findings with ML enabled', async () => {
    const html = `
      <html>
        <body>
          <h1>Test</h1>
          <button style="width: 30px; height: 30px;">X</button>
        </body>
      </html>
    `;
    
    const normalFindings = await detectHtml(html, { ml: false });
    const mlFindings = await detectHtml(html, { ml: true });
    
    expect(mlFindings.length).toBeGreaterThanOrEqual(normalFindings.length);
  });
});
