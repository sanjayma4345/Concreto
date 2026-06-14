#!/usr/bin/env node

import { Command } from 'clipanion';
import { Cli } from 'clipanion';

class DetectCommand extends Command {
  static paths = [['detect']];
  
  target = Option.String({ required: false });
  json = Option.Boolean('--json', false);
  ml = Option.Boolean('--ml', false);
  fast = Option.Boolean('--fast', false);
  format = Option.String('--format', 'text');
  
  async execute() {
    const { detectFromCli } = await import('../engine/cli/main.mjs');
    await detectFromCli({
      target: this.target,
      json: this.json,
      ml: this.ml,
      fast: this.fast,
      format: this.format,
    });
  }
}

class AnalyzeCommand extends Command {
  static paths = [['analyze']];
  
  target = Option.String({ required: true });
  output = Option.String('--output', '-o');
  
  async execute() {
    const { analyzeTarget } = await import('../engine/cli/analyze.mjs');
    await analyzeTarget({ target: this.target, output: this.output });
  }
}

class SkillsCommand extends Command {
  static paths = [['skills']];
  
  action = Option.String({ required: true });
  providers = Option.Array('--providers', []);
  
  async execute() {
    const { handleSkillsCommand } = await import('../engine/cli/skills.mjs');
    await handleSkillsCommand({ action: this.action, providers: this.providers });
  }
}

class InitCommand extends Command {
  static paths = [['init']];
  
  async execute() {
    const { initializeProject } = await import('../engine/cli/init.mjs');
    await initializeProject();
  }
}

class MLCommand extends Command {
  static paths = [['ml']];
  
  action = Option.String({ required: true });
  dataset = Option.String('--dataset');
  model = Option.String('--model');
  
  async execute() {
    const { handleMLCommand } = await import('../engine/ml/cli.mjs');
    await handleMLCommand({ action: this.action, dataset: this.dataset, model: this.model });
  }
}

const cli = new Cli({
  binaryLabel: 'Concreto',
  binaryName: 'concreto',
  binaryVersion: '1.0.0',
});

cli.register(DetectCommand);
cli.register(AnalyzeCommand);
cli.register(SkillsCommand);
cli.register(InitCommand);
cli.register(MLCommand);

cli.runExit(process.argv.slice(2));
