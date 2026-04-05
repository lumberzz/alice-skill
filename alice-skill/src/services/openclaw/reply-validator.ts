export interface ReplyValidationResult {
  ok: boolean;
  reason: 'ok' | 'empty' | 'too-long' | 'looks-internal';
  text?: string;
}

export function validateOpenClawReply(rawReplyText: string | undefined): ReplyValidationResult {
  const text = rawReplyText?.replace(/\s+/g, ' ').trim();

  if (!text) {
    return { ok: false, reason: 'empty' };
  }

  if (text.length > 500) {
    return { ok: false, reason: 'too-long', text: `${text.slice(0, 497).trim()}…` };
  }

  if (/^\{.+\}$/.test(text) || /tool|debug|trace|stack/i.test(text)) {
    return { ok: false, reason: 'looks-internal' };
  }

  return { ok: true, reason: 'ok', text };
}
