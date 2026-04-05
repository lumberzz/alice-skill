import { spawn, type ChildProcessByStdio } from 'node:child_process';
import type { Readable, Writable } from 'node:stream';
import readline from 'node:readline';
import type { LocalRpcWorkerManager, RpcClient } from './local-rpc-worker-manager.js';
import type { RpcCommand, RpcEvent, RpcResponse } from './rpc-types.js';

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
  private readonly pendingCollections = new Map<string, {
    events: RpcEvent[];
    response?: RpcResponse;
    resolve: (value: { response: RpcResponse; events: RpcEvent[] }) => void;
    timer?: NodeJS.Timeout;
  }>();

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
      this.pendingCollections.set(command.id, {
        events: [],
        resolve,
      });

      this.child.stdin.write(`${JSON.stringify(command)}\n`);

      setTimeout(() => {
        const pending = this.pendingCollections.get(command.id);
        if (!pending || !pending.response) {
          return;
        }

        this.pendingCollections.delete(command.id);
        pending.resolve({ response: pending.response, events: pending.events });
      }, Math.min(timeoutMs, 50));
    });
  }

  private handleLine(line: string): void {
    if (!line.trim()) return;
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
    for (const collection of this.pendingCollections.values()) {
      collection.events.push(event);
    }
  }
}
