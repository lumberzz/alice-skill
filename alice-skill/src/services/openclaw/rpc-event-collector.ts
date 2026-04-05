import type { RpcEvent } from './rpc-types.js';

export class RpcEventCollector {
  private assistantText = '';
  private completed = false;

  push(event: RpcEvent): void {
    if (event.type !== 'message_end' || event.message?.role !== 'assistant') {
      return;
    }

    const text = (event.message.content ?? [])
      .filter((item) => item.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text)
      .join(' ')
      .trim();

    this.assistantText = text;
    this.completed = true;
  }

  getResult(): { completed: boolean; text: string } {
    return {
      completed: this.completed,
      text: this.assistantText,
    };
  }
}
