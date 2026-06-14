let currentMode = 'fast';

document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');
    currentMode = option.dataset.mode;
  });
});

document.getElementById('scanBtn').addEventListener('click', async () => {
  const btn = document.getElementById('scanBtn');
  const resultsDiv = document.getElementById('results');
  const summaryDiv = document.getElementById('summary');
  
  btn.disabled = true;
  btn.textContent = 'Scanning...';
  resultsDiv.innerHTML = '<div class="empty-state">Analyzing page...</div>';
  summaryDiv.style.display = 'none';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: runDetection,
      args: [currentMode],
    });
    
    const findings = results[0].result;
    displayResults(findings);
  } catch (error) {
    resultsDiv.innerHTML = `<div class="empty-state">Error: ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Scan Page';
  }
});

function runDetection(mode) {
  const findings = [];
  
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    if (lastLevel > 0 && level > lastLevel + 1) {
      findings.push({
        id: 'S01-CRITICAL-skipped-headings',
        severity: 'CRITICAL',
        message: `Heading skipped from h${lastLevel} to h${level}`,
        element: heading.tagName,
      });
    }
    lastLevel = level;
  });
  
  document.querySelectorAll('*').forEach(el => {
    const style = getComputedStyle(el);
    
    if (/bounce|elastic|spring/.test(style.transitionTimingFunction)) {
      findings.push({
        id: 'V10-MEDIUM-bounce-easing',
        severity: 'MEDIUM',
        message: 'Bounce/elastic easing detected',
        element: el.tagName,
      });
    }
    
    if (el.tagName === 'A' && !el.textContent.trim() && !el.getAttribute('aria-label')) {
      findings.push({
        id: 'I07-HIGH-empty-link-text',
        severity: 'HIGH',
        message: 'Link without text content',
        element: 'a',
      });
    }
    
    if (el.tagName === 'BUTTON' && !el.textContent.trim() && !el.getAttribute('aria-label')) {
      findings.push({
        id: 'I08-HIGH-empty-button-text',
        severity: 'HIGH',
        message: 'Button without text content',
        element: 'button',
      });
    }
  });
  
  const contrastElements = document.querySelectorAll('p, span, a, button, label, h1, h2, h3, h4, h5, h6');
  contrastElements.forEach(el => {
    const style = getComputedStyle(el);
    const bgColor = style.backgroundColor;
    const textColor = style.color;
    
    if (bgColor && textColor && bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
      const bgRgb = parseRgb(bgColor);
      const textRgb = parseRgb(textColor);
      
      if (bgRgb && textRgb) {
        const ratio = getContrastRatio(bgRgb, textRgb);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight);
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        const minRatio = isLargeText ? 3 : 4.5;
        
        if (ratio < minRatio) {
          findings.push({
            id: isLargeText ? 'A02-CRITICAL-large-text-contrast' : 'A01-CRITICAL-color-contrast',
            severity: 'CRITICAL',
            message: `Contrast ratio ${ratio.toFixed(2)}:1 below ${minRatio}:1 minimum`,
            element: el.tagName,
          });
        }
      }
    }
  });
  
  if (mode === 'ml') {
    const buttons = document.querySelectorAll('button, [role="button"], .btn');
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        findings.push({
          id: 'I01-HIGH-tap-target-size',
          severity: 'HIGH',
          message: `Button ${Math.round(rect.width)}x${Math.round(rect.height)} below 44x44px`,
          element: 'button',
          ml: true,
        });
      }
    });
  }
  
  return findings;
  
  function parseRgb(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }
    return null;
  }
  
  function getContrastRatio(rgb1, rgb2) {
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  function getLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
}

function displayResults(findings) {
  const resultsDiv = document.getElementById('results');
  const summaryDiv = document.getElementById('summary');
  
  if (findings.length === 0) {
    resultsDiv.innerHTML = '<div class="empty-state" style="color: #22c55e;">✓ No anti-patterns detected</div>';
    return;
  }
  
  const critical = findings.filter(f => f.severity === 'CRITICAL');
  const high = findings.filter(f => f.severity === 'HIGH');
  const medium = findings.filter(f => f.severity === 'MEDIUM');
  
  document.getElementById('criticalCount').textContent = critical.length;
  document.getElementById('highCount').textContent = high.length;
  document.getElementById('mediumCount').textContent = medium.length;
  document.getElementById('totalF').textContent = findings.length;
  summaryDiv.style.display = 'flex';
  
  findings.sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
    return order[a.severity] - order[b.severity];
  });
  
  resultsDiv.innerHTML = findings.slice(0, 10).map(f => `
    <div class="result-item ${f.severity.toLowerCase()}">
      <div class="result-header">
        <span class="result-id">${f.id}</span>
        <span class="result-severity ${f.severity.toLowerCase()}">${f.severity}</span>
      </div>
      <div class="result-message">${f.message}${f.ml ? '<span class="ml-badge">ML</span>' : ''}</div>
    </div>
  `).join('');
  
  if (findings.length > 10) {
    resultsDiv.innerHTML += `<div class="empty-state">+ ${findings.length - 10} more findings</div>`;
  }
}
