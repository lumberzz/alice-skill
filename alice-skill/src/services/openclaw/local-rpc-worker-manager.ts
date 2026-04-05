import type { RpcCommand, RpcEvent, RpcResponse } from './rpc-types.js';

export interface RpcClient {
  send(command: RpcCommand): Promise<RpcResponse>;
  sendAndCollect(command: RpcCommand, timeoutMs: number): Promise<{ response: RpcResponse; events: RpcEvent[] }>;
}

export interface LocalRpcWorkerManager {
  ensureStarted(): Promise<RpcClient>;
}

export class MockLocalRpcWorkerManager implements LocalRpcWorkerManager {
  async ensureStarted(): Promise<RpcClient> {
    return new MockRpcClient();
  }
}

class MockRpcClient implements RpcClient {
  async send(command: RpcCommand): Promise<RpcResponse> {
    if (command.type === 'new_session') {
      return {
        id: command.id,
        type: 'response',
        command: command.type,
        success: true,
        data: { cancelled: false },
      };
    }

    if (command.type === 'get_state') {
      return {
        id: command.id,
        type: 'response',
        command: command.type,
        success: true,
        data: { sessionFile: `/tmp/${String(command.id)}.jsonl` },
      };
    }

    return {
      id: command.id,
      type: 'response',
      command: command.type,
      success: true,
      data: {},
    };
  }

  async sendAndCollect(command: RpcCommand, _timeoutMs: number): Promise<{ response: RpcResponse; events: RpcEvent[] }> {
    return {
      response: {
        id: command.id,
        type: 'response',
        command: command.type,
        success: true,
        data: {},
      },
      events: [
        {
          type: 'message_end',
          message: {
            role: 'assistant',
            content: [
              { type: 'text', text: 'Mock RPC worker вернул краткий ответ из локальной session-схемы.' },
            ],
            stopReason: 'completed',
          },
        },
      ],
    };
  }
}
