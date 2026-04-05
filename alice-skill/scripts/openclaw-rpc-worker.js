#!/usr/bin/env node
import readline from 'node:readline';

function send(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  if (!line.trim()) return;

  let cmd;
  try {
    cmd = JSON.parse(line);
  } catch {
    send({ type: 'response', command: 'unknown', success: false, error: 'invalid json' });
    return;
  }

  if (cmd.type === 'new_session') {
    send({ id: cmd.id, type: 'response', command: cmd.type, success: true, data: {} });
    return;
  }

  if (cmd.type === 'set_session_name') {
    send({ id: cmd.id, type: 'response', command: cmd.type, success: true, data: {} });
    return;
  }

  if (cmd.type === 'get_state') {
    send({ id: cmd.id, type: 'response', command: cmd.type, success: true, data: { sessionFile: `/tmp/${cmd.id}.jsonl` } });
    return;
  }

  if (cmd.type === 'switch_session') {
    send({ id: cmd.id, type: 'response', command: cmd.type, success: true, data: {} });
    return;
  }

  if (cmd.type === 'prompt') {
    send({ id: cmd.id, type: 'response', command: cmd.type, success: true, data: {} });
    send({
      type: 'message_end',
      message: {
        role: 'assistant',
        content: [
          { type: 'text', text: 'Persistent RPC worker вернул краткий ответ.' }
        ],
        stopReason: 'completed'
      }
    });
    return;
  }

  send({ id: cmd.id, type: 'response', command: cmd.type, success: true, data: {} });
});
