import type { SkillResponse } from '../../types/skill-response.js';

export function capabilitiesHandler(): SkillResponse {
  return {
    text: 'В текущем каркасе у меня есть Alice webhook, детерминированный роутер и форматирование ответа под голос. Следующие этапы — память сессии, LLM и безопасный OpenClaw bridge.',
  };
}
