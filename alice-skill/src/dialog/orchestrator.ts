import type { SkillResponse } from '../types/skill-response.js';
import { routeTurn } from './router.js';
import { welcomeHandler } from '../handlers/fixed/welcome.js';
import { helpHandler } from '../handlers/fixed/help.js';
import { capabilitiesHandler } from '../handlers/fixed/capabilities.js';
import { fallbackHandler } from '../handlers/fixed/fallback.js';
import { formatVoiceResponse } from '../formatter/voice-formatter.js';
import type { RequestContext } from '../middleware/request-context.js';
import type { SessionStore } from '../state/store.js';
import { createEmptySessionState } from '../state/session-types.js';
import { hasTimeBudget } from './policies.js';
import type { LlmProvider } from '../services/llm/provider.js';
import { llmHandler } from '../handlers/llm/llm-handler.js';

export interface OrchestratorDependencies {
  sessionStore: SessionStore;
  llmProvider: LlmProvider;
}

export async function orchestrateTurn(
  context: RequestContext,
  deps: OrchestratorDependencies,
): Promise<SkillResponse> {
  const priorState = deps.sessionStore.get(context.sessionId) ?? createEmptySessionState();
  const decision = routeTurn(context);

  let response: SkillResponse;

  if (!hasTimeBudget(context)) {
    response = fallbackHandler('Я не успеваю ответить достаточно быстро. Попробуй короткий запрос или повтори чуть позже.');
  } else {
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
      case 'askLLM':
        response = await llmHandler(context, deps.llmProvider, priorState);
        break;
      case 'fallback':
      default:
        response = fallbackHandler();
        break;
    }
  }

  deps.sessionStore.set(context.sessionId, {
    ...priorState,
    lastIntent: decision.routeType,
    shortSummary:
      decision.routeType === 'askLLM'
        ? `Последний LLM-запрос: ${context.utterance.slice(0, 120)}`
        : priorState.shortSummary,
    updatedAt: new Date().toISOString(),
  });

  return formatVoiceResponse({
    ...response,
    meta: {
      ...(response.meta ?? {}),
      route: decision.routeType,
      routeReason: decision.reason,
      routeConfidence: decision.confidence,
      sessionId: context.sessionId,
    },
  });
}
