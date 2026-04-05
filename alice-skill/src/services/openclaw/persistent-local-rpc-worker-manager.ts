import { spawn, type ChildProcessByStdio } from 'node:child_process';
import type { Readable, Writable } from 'node:stream';
import readline from 'node:readline';
import type { LocalRpcWorkerManager, RpcClient } from './local-rpc-worker-manager.js';
import type { RpcCommand, RpcEvent, RpcResponse } from './rpc-types.js';

function extractAssistantTextFromEvent(event: RpcEvent): string {
  const topLevelContent = event.message?.role === 'assistant' ? event.message.content ?? [] : [];
  const partialContent = (event as RpcEvent & {
    assistantMessageEvent?: {
      partial?: {
        role?: string;
        content?: Array<{ type?: string; text?: string }>;
      };
    };
  }).assistantMessageEvent?.partial?.role === 'assistant'
    ? ((event as RpcEvent & {
        assistantMessageEvent?: {
          partial?: {
            role?: string;
            content?: Array<{ type?: string; text?: string }>;
          };
        };
      }).assistantMessageEvent?.partial?.content ?? [])
    : [];

  const content = partialContent.length > 0 ? partialContent : topLevelContent;
  return content
    .filter((item) => item.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join(' ')
    .trim();
}

function isAssistantFinalizingEvent(event: RpcEvent): boolean {
  const assistantRelated = event.message?.role === 'assistant' || (event as RpcEvent & { assistantMessageEvent?: { partial?: { role?: string } } }).assistantMessageEvent?.partial?.role === 'assistant';
  return assistantRelated && (event.type === 'message_end' || event.type === 'turn_end' || event.type === 'agent_end');
}

interface PendingCollection {
  events: RpcEvent[];
  response?: RpcResponse;
  resolve: (value: { response: RpcResponse; events: RpcEvent[] }) => void;
  done: boolean;
  latestAssistantText: string;
  timer?: NodeJS.Timeout;
}

export class PersistentLocalRpcWorkerManager implements LocalRpcWorkerManager {
  private child: ChildProcessByStdio<Writable, Readable, null> | null = null;
  private client: PersistentRpcClient | null = null;

  constructor(
    private readonly command: string,
    private readonly args: string[],
  ) {}

  async ensureStarted(): Promise<RpcClient> {
    if (this.client) {
      return this.client;
    }

    const child = spawn(this.command, this.args, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'inherit'],
      env: process.env,
    });

    this.child = child;
    this.client = new PersistentRpcClient(child);
    return this.client;
  }

  dispose(): void {
    this.child?.kill();
    this.child = null;
    this.client = null;
  }
}

class PersistentRpcClient implements RpcClient {
  private readonly pendingResponses = new Map<string, (response: RpcResponse) => void>();
  private readonly pendingCollections = new Map<string, PendingCollection>();
  private readonly traceEnabled = process.env.OPENCLAW_RPC_TRACE === '1';

  constructor(private readonly child: ChildProcessByStdio<Writable, Readable, null>) {
    const rl = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
    rl.on('line', (line) => this.handleLine(line));
  }

  async send(command: RpcCommand): Promise<RpcResponse> {
    return new Promise((resolve) => {
      this.pendingResponses.set(command.id, resolve);
      this.child.stdin.write(`${JSON.stringify(command)}\n`);
    });
  }

  async sendAndCollect(command: RpcCommand, timeoutMs: number): Promise<{ response: RpcResponse; events: RpcEvent[] }> {
    return new Promise((resolve) => {
      const entry: PendingCollection = {
        events: [],
        resolve,
        done: false,
        latestAssistantText: '',
      };
      entry.timer = setTimeout(() => {
        const pending = this.pendingCollections.get(command.id);
        if (!pending || pending.done || !pending.response) {
          return;
        }

        pending.done = true;
        this.pendingCollections.delete(command.id);

        if (pending.latestAssistantText) {
          pending.events.push({
            type: 'turn_end',
            message: {
              role: 'assistant',
              content: [{ type: 'text', text: pending.latestAssistantText }],
            },
          });
        }

        pending.resolve({ response: pending.response, events: pending.events });
      }, timeoutMs);

      this.pendingCollections.set(command.id, entry);
      this.child.stdin.write(`${JSON.stringify(command)}\n`);
    });
  }

  private handleLine(line: string): void {
    if (!line.trim()) return;
    if (this.traceEnabled) {
      console.log(JSON.stringify({ event: 'openclaw_rpc_line', line }));
    }
    const parsed = JSON.parse(line) as RpcResponse | RpcEvent;

    if (parsed.type === 'response') {
      const response = parsed as RpcResponse;
      const pendingResponse = response.id ? this.pendingResponses.get(response.id) : undefined;
      if (pendingResponse) {
        this.pendingResponses.delete(response.id!);
        pendingResponse(response);
        return;
      }

      const collection = response.id ? this.pendingCollections.get(response.id) : undefined;
      if (collection) {
        collection.response = response;
      }
      return;
    }

    const event = parsed as RpcEvent;
    const assistantText = extractAssistantTextFromEvent(event);

    for (const [commandId, collection] of this.pendingCollections.entries()) {
      collection.events.push(event);

      if (assistantText) {
        collection.latestAssistantText = assistantText;
      }

      if (!collection.done && collection.response && isAssistantFinalizingEvent(event) && collection.latestAssistantText) {
        collection.done = true;
        if (collection.timer) {
          clearTimeout(collection.timer);
        }
        this.pendingCollections.delete(commandId);
        collection.resolve({ response: collection.response, events: collection.events });
      }
    }
  }
}
