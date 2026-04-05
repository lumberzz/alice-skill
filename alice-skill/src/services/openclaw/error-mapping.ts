export function classifyOpenClawCliError(message: string): 'timeout' | 'error' {
  return /timed out|ETIMEDOUT|SIGTERM|timeout/i.test(message) ? 'timeout' : 'error';
}

export function summarizeOpenClawCliError(message: string): string {
  if (/No API key|login|authenticate/i.test(message)) {
    return 'Локальный OpenClaw не настроен для реального вызова модели.';
  }

  if (/timed out|ETIMEDOUT|SIGTERM|timeout/i.test(message)) {
    return 'Локальный OpenClaw не успел ответить в пределах таймаута.';
  }

  if (/Unexpected token|JSON/i.test(message)) {
    return 'Локальный OpenClaw вернул неожиданный формат ответа.';
  }

  return 'Локальный OpenClaw завершился с ошибкой.';
}
