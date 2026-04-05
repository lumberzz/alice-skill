import type { RpcEvent } from './rpc-types.js';

function extractTextParts(messageLike: unknown): string {
  const content = (messageLike as { content?: Array<{ type?: string; text?: string }> } | undefined)?.content ?? [];
  return content
    .filter((item) => item.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join(' ')
    .trim();
}

export class RpcEventCollector {
  private assistantText = '';
  private completed = false;

  push(event: RpcEvent): void {
    const topLevelMessage = event.message;
    const partialMessage = (event as RpcEvent & {
      assistantMessageEvent?: {
        partial?: {
          role?: string;
          content?: Array<{ type?: string; text?: string }>;
        };
      };
    }).assistantMessageEvent?.partial;

    const topLevelText = topLevelMessage?.role === 'assistant' ? extractTextParts(topLevelMessage) : '';
    const partialText = partialMessage?.role === 'assistant' ? extractTextParts(partialMessage) : '';
    const nextText = partialText || topLevelText;

    if (nextText) {
      this.assistantText = nextText;
    }

    const assistantRelated = topLevelMessage?.role === 'assistant' || partialMessage?.role === 'assistant';
    const completedEvent = event.type === 'message_end' || event.type === 'turn_end' || event.type === 'agent_end';

    if (assistantRelated && completedEvent && this.assistantText) {
      this.completed = true;
    }
  }

  getResult(): { completed: boolean; text: string } {
    return {
      completed: this.completed,
      text: this.assistantText,
    };
  }
}
