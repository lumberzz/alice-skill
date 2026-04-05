export interface RpcCommand {
  id: string;
  type: string;
  [key: string]: unknown;
}

export interface RpcResponse {
  id?: string;
  type: 'response';
  command: string;
  success: boolean;
  data?: Record<string, unknown> | null;
  error?: string;
}

export interface RpcEvent {
  type: string;
  message?: {
    role?: string;
    content?: Array<{ type: string; text?: string }>;
    stopReason?: string;
  };
}
