import type { SkillResponse } from '../../types/skill-response.js';

export function fallbackHandler(text = 'Я пока не уверена, как это обработать в базовом режиме. Попробуй сказать помощь или что ты умеешь. Дальше сюда можно подключить LLM-маршрут.'): SkillResponse {
  return {
    text,
  };
}
