export function isFullPage(el) {
  const tag = el.tagName?.toLowerCase();
  return tag === 'html' || tag === 'body' || el === el.ownerDocument?.documentElement;
}

export function getPageWidth(el) {
  const doc = el.ownerDocument || el;
  return doc.documentElement?.scrollWidth || doc.body?.scrollWidth || window.innerWidth;
}

export function getViewportHeight() {
  if (typeof window !== 'undefined') {
    return window.innerHeight;
  }
  return 768;
}

export function isInViewport(el) {
  if (typeof el.getBoundingClientRect !== 'function') return true;
  
  const rect = el.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.top < window.innerHeight &&
    rect.bottom > 0
  );
}

export function getDepth(el) {
  let depth = 0;
  let current = el;
  
  while (current.parentElement) {
    depth++;
    current = current.parentElement;
  }
  
  return depth;
}

export function getSiblings(el) {
  return Array.from(el.parentElement?.children || []).filter(child => child !== el);
}

export function getTextContent(el) {
  return el.textContent?.trim() || '';
}

export function hasDirectText(el) {
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      return true;
    }
  }
  return false;
}
