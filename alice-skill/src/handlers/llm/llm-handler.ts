import type { RequestContext } from '../../middleware/request-context.js';
import type { SkillResponse } from '../../types/skill-response.js';
import type { LlmProvider } from '../../services/llm/provider.js';
import type { SessionState } from '../../state/session-types.js';

export async function llmHandler(
  context: RequestContext,
  provider: LlmProvider,
  sessionState: SessionState,
): Promise<SkillResponse> {
  const result = await provider.generateSpokenAnswer({
    utterance: context.utterance,
    shortSummary: sessionState.shortSummary,
    locale: context.locale,
  });

  return {
    text: result.text,
    meta: {
      llmProvider: result.provider,
    },
  };
}
