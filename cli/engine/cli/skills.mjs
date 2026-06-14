import fs from 'fs/promises';
import path from 'path';

const PROVIDERS = {
  claude: '.claude/skills/concreto',
  cursor: '.cursor/skills/concreto',
  opencode: '.opencode/skills/concreto',
  gemini: '.gemini/skills/concreto',
  codex: '.agents/skills/concreto',
};

async function handleSkillsCommand(options) {
  const { action, providers } = options;
  
  switch (action) {
    case 'install':
      await installSkills(providers);
      break;
    case 'update':
      await updateSkills(providers);
      break;
    case 'link':
      console.log('Linking skills...');
      break;
    default:
      console.log(`Unknown skills action: ${action}`);
  }
}

async function installSkills(providers) {
  console.log('\nInstalling Concreto skills...\n');
  
  const skillDir = path.join(process.cwd(), 'skill');
  const providerList = providers.length > 0 ? providers : Object.keys(PROVIDERS);
  
  for (const provider of providerList) {
    const destDir = PROVIDERS[provider];
    
    if (!destDir) {
      console.log(`  ✗ Unknown provider: ${provider}`);
      continue;
    }
    
    try {
      await fs.mkdir(destDir, { recursive: true });
      
      const files = await fs.readdir(skillDir);
      for (const file of files) {
        const srcFile = path.join(skillDir, file);
        const destFile = path.join(destDir, file);
        
        const stat = await fs.stat(srcFile);
        if (stat.isFile()) {
          await fs.copyFile(srcFile, destFile);
        }
      }
      
      console.log(`  ✓ ${provider} (${destDir})`);
    } catch (error) {
      console.log(`  ✗ ${provider}: ${error.message}`);
    }
  }
  
  console.log('\nNext: Reload your AI coding tool to activate the skill.');
}

async function updateSkills(providers) {
  console.log('\nUpdating Concreto skills...\n');
  await installSkills(providers);
}

export { handleSkillsCommand };
