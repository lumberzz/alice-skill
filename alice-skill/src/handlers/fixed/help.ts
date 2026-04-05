import type { SkillResponse } from '../../types/skill-response.js';

export function helpHandler(): SkillResponse {
  return {
    text: 'Пока я умею базовые вещи: приветствие, помощь, краткий рассказ о возможностях и безопасный fallback. Следом сюда можно подключить LLM и ограниченный мост к OpenClaw.',
    buttons: [
      { title: 'Возможности' },
      { title: 'Привет' },
    ],
  };
}
