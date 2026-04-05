import type { TurnContext } from '../types/turn-context.js';
import type { SkillResponse } from '../types/skill-response.js';
import { routeTurn } from './router.js';
import { welcomeHandler } from '../handlers/fixed/welcome.js';
import { helpHandler } from '../handlers/fixed/help.js';
import { capabilitiesHandler } from '../handlers/fixed/capabilities.js';
import { fallbackHandler } from '../handlers/fixed/fallback.js';
import { formatVoiceResponse } from '../formatter/voice-formatter.js';

export function orchestrateTurn(context: TurnContext): SkillResponse {
  const decision = routeTurn(context);

  let response: SkillResponse;

  switch (decision.routeType) {
    case 'welcome':
      response = welcomeHandler();
      break;
    case 'help':
      response = helpHandler();
      break;
    case 'capabilities':
      response = capabilitiesHandler();
      break;
    case 'fallback':
    default:
      response = fallbackHandler();
      break;
  }

  return formatVoiceResponse({
    ...response,
    meta: {
      ...(response.meta ?? {}),
      route: decision.routeType,
      routeReason: decision.reason,
      routeConfidence: decision.confidence,
    },
  });
}
