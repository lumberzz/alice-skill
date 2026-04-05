import type { OpenClawTaskType } from './permissions.js';

export interface OpenClawBridgeInput {
  taskType: OpenClawTaskType;
  utterance: string;
}

export interface OpenClawBridgeResult {
  text: string;
  source: 'mock-openclaw';
}

export interface OpenClawBridge {
  run(input: OpenClawBridgeInput): Promise<OpenClawBridgeResult>;
}

export class MockOpenClawBridge implements OpenClawBridge {
  async run(input: OpenClawBridgeInput): Promise<OpenClawBridgeResult> {
    return {
      source: 'mock-openclaw',
      text: `Mock OpenClaw обработал задачу типа ${input.taskType}: ${input.utterance}`,
    };
  }
}
