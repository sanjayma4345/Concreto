import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function build() {
  console.log('Building Concreto...\n');
  
  const distDir = path.join(rootDir, 'dist');
  await fs.mkdir(distDir, { recursive: true });
  
  await buildSkill();
  await buildCli();
  
  console.log('\n✓ Build complete');
}

async function buildSkill() {
  console.log('Building skill files...');
  
  const skillSrc = path.join(rootDir, 'skill');
  const skillDest = path.join(distDir, 'skill');
  
  await fs.mkdir(skillDest, { recursive: true });
  
  const files = await walkDir(skillSrc);
  
  for (const file of files) {
    const destPath = path.join(skillDest, path.relative(skillSrc, file));
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(file, destPath);
  }
  
  const providers = ['claude', 'cursor', 'opencode', 'gemini', 'codex'];
  
  for (const provider of providers) {
    const providerDir = path.join(rootDir, `.${provider}`, 'skills', 'concreto');
    await fs.mkdir(providerDir, { recursive: true });
    
    const skillFiles = await walkDir(skillSrc);
    for (const file of skillFiles) {
      const destPath = path.join(providerDir, path.basename(file));
      await fs.copyFile(file, destPath);
    }
    
    console.log(`  ✓ ${provider}`);
  }
}

async function buildCli() {
  console.log('Building CLI...');
  
  const cliSrc = path.join(rootDir, 'cli');
  const cliDest = path.join(distDir, 'cli');
  
  await fs.mkdir(cliDest, { recursive: true });
  
  const files = await walkDir(cliSrc);
  
  for (const file of files) {
    const destPath = path.join(cliDest, path.relative(cliSrc, file));
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(file, destPath);
  }
  
  console.log('  ✓ CLI');
}

async function walkDir(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await walkDir(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

build().catch(console.error);
