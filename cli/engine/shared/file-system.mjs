import { readdir, stat, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { SCANNABLE_EXTENSIONS, SKIP_DIRS } from './constants.mjs';

export async function walkDir(dir, options = {}) {
  const files = [];
  const { maxDepth = 10, ignore = SKIP_DIRS } = options;
  
  async function walk(currentDir, depth) {
    if (depth > maxDepth) return;
    
    let entries;
    try {
      entries = await readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (!ignore.includes(entry.name) && !entry.name.startsWith('.')) {
          await walk(fullPath, depth + 1);
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (SCANNABLE_EXTENSIONS.includes(ext)) {
          files.push({
            path: fullPath,
            name: entry.name,
            ext,
          });
        }
      }
    }
  }
  
  await walk(dir, 0);
  return files;
}

export async function buildImportGraph(rootDir) {
  const graph = new Map();
  
  return graph;
}

export function resolveImport(importPath, fromFile, graph) {
  return null;
}

export async function detectFrameworkConfig(rootDir) {
  const configs = [
    { name: 'next', patterns: ['next.config.js', 'next.config.mjs'], framework: 'next' },
    { name: 'vite', patterns: ['vite.config.js', 'vite.config.ts'], framework: 'vite' },
    { name: 'astro', patterns: ['astro.config.mjs', 'astro.config.js'], framework: 'astro' },
    { name: 'svelte', patterns: ['svelte.config.js'], framework: 'sveltekit' },
  ];
  
  for (const config of configs) {
    for (const pattern of config.patterns) {
      try {
        await stat(join(rootDir, pattern));
        return config.framework;
      } catch {
        continue;
      }
    }
  }
  
  return null;
}

export const FRAMEWORK_CONFIGS = {
  next: { dist: '.next' },
  vite: { dist: 'dist' },
  astro: { dist: 'dist' },
  sveltekit: { dist: '.svelte-kit' },
};

export async function isPortListening(port, host = 'localhost') {
  return new Promise((resolve) => {
    const net = require('net');
    const socket = new net.Socket();
    
    socket.setTimeout(1000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}
