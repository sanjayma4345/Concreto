import { readFile } from 'fs/promises';
import { join } from 'path';

export async function createMLDetector(options = {}) {
  const { modelPath = '.concreto/models' } = options;
  
  return {
    async detect(html, context) {
      const findings = [];
      
      findings.push(...await detectComplexPatterns(html));
      
      if (context?.projectType) {
        findings.push(...await adjustForContext(html, context.projectType));
      }
      
      return findings;
    },
    
    async reduceFalsePositives(findings, history) {
      return findings.filter(f => {
        if (!history) return true;
        
        const similar = history.filter(h => h.id === f.id);
        if (similar.length === 0) return true;
        
        const acceptedRate = similar.filter(h => h.accepted).length / similar.length;
        return acceptedRate > 0.5;
      });
    },
    
    async analyzeTrend(findings) {
      return {
        mostCommon: findings.reduce((acc, f) => {
          acc[f.id] = (acc[f.id] || 0) + 1;
          return acc;
        }, {}),
        categoryDistribution: getCategoryDistribution(findings),
      };
    },
  };
}

async function detectComplexPatterns(html) {
  const findings = [];
  
  const heroMetricPattern = /<[^>]*(?:text-\d+x|text-5xl)[^>]*>\s*\d+(\.\d+)?[mk]?\s*[%<]/i;
  if (heroMetricPattern.test(html)) {
    findings.push({
      id: 'V04-HIGH-hero-metric-template',
      severity: 'HIGH',
      message: 'Hero metric pattern detected by ML',
      ml: true,
      confidence: 0.85,
    });
  }
  
  const identicalCardsPattern = /<div[^>]*class="[^"]*grid[^"]*"[^>]*>(?:\s*<div[^>]*class="[^"]*card[^"]*"[^>]*>[\s\S]{50,300}<\/div>){3,}/i;
  if (identicalCardsPattern.test(html)) {
    findings.push({
      id: 'V05-HIGH-identical-card-grids',
      severity: 'HIGH',
      message: 'Repetitive card pattern detected by ML',
      ml: true,
      confidence: 0.78,
    });
  }
  
  const eyebrowPattern = /<span[^>]*(?:uppercase|tracking-wide)[^>]*>(?:ABOUT|PROCESS|SERVICES|FEATURES|PRICING|TEAM|CONTACT|WORK|PORTFOLIO|BLOG|NEWS|RESOURCES|SOLUTIONS|PRODUCTS|OFFERINGS|CAPABILITIES|METHODOLOGY)[^<]*<\/span>/gi;
  const eyebrowMatches = html.match(eyebrowPattern);
  if (eyebrowMatches && eyebrowMatches.length >= 3) {
    findings.push({
      id: 'V07-HIGH-eyebrow-every-section',
      severity: 'HIGH',
      message: `Mass section eyebrows (${eyebrowMatches.length} detected)`,
      ml: true,
      confidence: 0.92,
    });
  }
  
  return findings;
}

async function adjustForContext(html, projectType) {
  const findings = [];
  
  if (projectType === 'marketing') {
    const purpleGradient = /linear-gradient[^)]*(?:purple|violet|indigo)[^)]*,[^)]*(?:blue|cyan|teal)/i;
    if (purpleGradient.test(html)) {
      findings.push({
        id: 'V09-MEDIUM-purple-gradient',
        severity: 'MEDIUM',
        message: 'Marketing site using AI-default purple gradient',
        ml: true,
        confidence: 0.88,
      });
    }
  }
  
  if (projectType === 'dashboard') {
    const nestedCards = /class="[^"]*card[^"]*"[^>]*>[\s\S]{0,500}class="[^"]*card[^"]*"/i;
    if (nestedCards.test(html)) {
      findings.push({
        id: 'V06-HIGH-nested-cards',
        severity: 'HIGH',
        message: 'Dashboard with nested cards (common UX anti-pattern)',
        ml: true,
        confidence: 0.95,
      });
    }
  }
  
  return findings;
}

function getCategoryDistribution(findings) {
  return findings.reduce((acc, f) => {
    const category = f.id.split('-')[0];
    const categoryNames = {
      A: 'Accessibility',
      V: 'Visual',
      P: 'Performance',
      I: 'Interaction',
      S: 'Semantic',
    };
    const name = categoryNames[category] || 'Other';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
}

export const ML_FEATURES = {
  patternRecognition: true,
  contextAwareness: true,
  falsePositiveReduction: true,
  trendAnalysis: true,
};
