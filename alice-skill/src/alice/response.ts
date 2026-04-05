import type { AliceRequest } from './schema.js';
import type { SkillResponse } from '../types/skill-response.js';

export function toAliceResponse(request: AliceRequest, response: SkillResponse) {
  return {
    version: request.version,
    response: {
      text: response.text,
      tts: response.tts ?? response.text,
      end_session: response.endSession ?? false,
      buttons: response.buttons ?? [],
    },
  };
}
