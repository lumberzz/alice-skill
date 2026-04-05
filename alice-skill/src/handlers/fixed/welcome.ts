import type { SkillResponse } from '../../types/skill-response.js';

export function welcomeHandler(): SkillResponse {
  return {
    text: 'Привет. Я голосовой навык на базе вебхука. Могу коротко отвечать, рассказывать о возможностях и позже работать с LLM и агентными задачами.',
    buttons: [
      { title: 'Помощь' },
      { title: 'Что ты умеешь?' },
    ],
  };
}
