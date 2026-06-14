import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { detectHtml, detectText, detectUrl } from '../engines/static-html/detect-html.mjs';
import { walkDir } from '../shared/file-system.mjs';
import { ANTIPATTERNS, SEVERITY_LEVELS } from '../registry/antipatterns.mjs';

export async function detectFromCli(options) {
  const { target, json, ml, fast, format } = options;
  
  const spinner = ora('Analyzing...').start();
  
  try {
    let findings = [];
    
    if (!target) {
      spinner.text = 'Scanning current directory...';
      findings = await scanDirectory(process.cwd(), { ml, fast });
    } else if (target.startsWith('http://') || target.startsWith('https://')) {
      spinner.text = `Fetching ${target}...`;
      findings = await detectUrl(target, { ml });
    } else {
      try {
        await fs.stat(target);
        spinner.text = `Scanning ${target}...`;
        findings = await scanDirectory(target, { ml, fast });
      } catch {
        findings = detectText(target, { ml });
      }
    }
    
    spinner.stop();
    
    if (json) {
      console.log(JSON.stringify(findings, null, 2));
    } else {
      printFindings(findings, format);
    }
    
    const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = findings.filter(f => f.severity === 'HIGH').length;
    
    if (criticalCount > 0 || highCount > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function scanDirectory(dir, options) {
  const findings = [];
  const files = await walkDir(dir);
  
  for (const file of files) {
    const content = await fs.readFile(file.path, 'utf-8');
    
    if (file.ext === '.html' || file.ext === '.astro') {
      const htmlFindings = await detectHtml(content, { ml: options.ml });
      htmlFindings.forEach(f => {
        findings.push({ ...f, file: file.path });
      });
    } else {
      const textFindings = detectText(content, { ml: options.ml });
      textFindings.forEach(f => {
        findings.push({ ...f, file: file.path });
      });
    }
  }
  
  return findings;
}

function printFindings(findings, format = 'text') {
  if (findings.length === 0) {
    console.log(chalk.green('\n✓ No anti-patterns detected\n'));
    return;
  }
  
  const bySeverity = {
    CRITICAL: [],
    HIGH: [],
    MEDIUM: [],
    LOW: [],
    INFO: [],
  };
  
  findings.forEach(f => {
    bySeverity[f.severity]?.push(f);
  });
  
  const severityColors = {
    CRITICAL: chalk.red.bold,
    HIGH: chalk.yellow.bold,
    MEDIUM: chalk.blueBright,
    LOW: chalk.cyan,
    INFO: chalk.gray,
  };
  
  console.log('\n');
  
  Object.entries(bySeverity).forEach(([severity, items]) => {
    if (items.length === 0) return;
    
    const color = severityColors[severity];
    const label = SEVERITY_LEVELS[severity];
    
    console.log(color(`\n${severity} (${items.length})`));
    console.log(color('─'.repeat(40)));
    
    items.forEach((finding, idx) => {
      const rule = ANTIPATTERNS.find(r => r.id === finding.id);
      
      console.log(chalk.bold(`\n  [${finding.id}]`));
      console.log(chalk.white(`  ${rule?.name || finding.id}`));
      console.log(chalk.gray(`  ${finding.details || ''}`));
      
      if (finding.file) {
        console.log(chalk.dim(`  File: ${finding.file}`));
      }
      
      if (finding.snippet && format !== 'compact') {
        console.log(chalk.dim(`  Snippet: ${finding.snippet.slice(0, 80)}${finding.snippet.length > 80 ? '...' : ''}`));
      }
      
      if (finding.ml) {
        console.log(chalk.magenta('  [ML-detected]'));
      }
    });
  });
  
  console.log('\n');
  printSummary(findings);
}

function printSummary(findings) {
  const total = findings.length;
  const critical = findings.filter(f => f.severity === 'CRITICAL').length;
  const high = findings.filter(f => f.severity === 'HIGH').length;
  const medium = findings.filter(f => f.severity === 'MEDIUM').length;
  
  console.log(chalk.bold('Summary:'));
  console.log(chalk.red(`  ${critical} critical`) + ' (must fix)');
  console.log(chalk.yellow(`  ${high} high`) + ' (fix before ship)');
  console.log(chalk.blueBright(`  ${medium} medium`) + ' (should fix)');
  console.log(chalk.gray(`  ${total} total findings`));
}

export { printFindings };
