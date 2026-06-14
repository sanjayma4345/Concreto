chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight') {
    highlightElements(request.selectors);
    sendResponse({ success: true });
  }
  
  if (request.action === 'clearHighlights') {
    clearHighlights();
    sendResponse({ success: true });
  }
});

function highlightElements(selectors) {
  const style = document.createElement('style');
  style.id = 'concreto-highlight-styles';
  style.textContent = `
    .concreto-highlight-critical {
      outline: 3px solid #ef4444 !important;
      outline-offset: 2px !important;
    }
    .concreto-highlight-high {
      outline: 3px solid #f59e0b !important;
      outline-offset: 2px !important;
    }
    .concreto-highlight-medium {
      outline: 3px solid #3b82f6 !important;
      outline-offset: 2px !important;
    }
    .concreto-highlight-low {
      outline: 3px solid #22c55e !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
  
  selectors.forEach(({ selector, severity }) => {
    try {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add(`concreto-highlight-${severity.toLowerCase()}`);
      });
    } catch (e) {
    }
  });
}

function clearHighlights() {
  document.querySelectorAll('[class*="concreto-highlight-"]').forEach(el => {
    el.classList.remove(
      'concreto-highlight-critical',
      'concreto-highlight-high',
      'concreto-highlight-medium',
      'concreto-highlight-low'
    );
  });
  
  const style = document.getElementById('concreto-highlight-styles');
  if (style) style.remove();
}

window.concreto = {
  highlight: highlightElements,
  clear: clearHighlights,
};
