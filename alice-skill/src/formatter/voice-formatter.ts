import type { SkillResponse } from '../types/skill-response.js';

export function formatVoiceResponse(response: SkillResponse): SkillResponse {
  const normalizedText = response.text.replace(/\s+/g, ' ').trim();
  const shortText = normalizedText.length > 220
    ? `${normalizedText.slice(0, 217).trim()}…`
    : normalizedText;

  return {
    ...response,
    text: shortText,
    tts: response.tts ?? shortText,
  };
}
