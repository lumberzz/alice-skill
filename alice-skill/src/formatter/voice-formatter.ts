import type { SkillResponse } from '../types/skill-response.js';

function smartClamp(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const hard = text.slice(0, maxLength - 1).trim();
  const sentenceCut = Math.max(hard.lastIndexOf('. '), hard.lastIndexOf('! '), hard.lastIndexOf('? '));
  if (sentenceCut >= 80) {
    return `${hard.slice(0, sentenceCut + 1).trim()}…`;
  }

  const wordCut = hard.lastIndexOf(' ');
  if (wordCut >= 80) {
    return `${hard.slice(0, wordCut).trim()}…`;
  }

  return `${hard}…`;
}

export function formatVoiceResponse(response: SkillResponse): SkillResponse {
  const normalizedText = response.text.replace(/\s+/g, ' ').trim();
  const shortText = smartClamp(normalizedText, 220);

  return {
    ...response,
    text: shortText,
    tts: response.tts ?? shortText,
  };
}
