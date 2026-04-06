import type { RequestContext } from '../../middleware/request-context.js';
import type { SkillResponse } from '../../types/skill-response.js';
import type { LlmProvider } from '../../services/llm/provider.js';
import type { SessionState } from '../../state/session-types.js';

export async function llmHandler(
  context: RequestContext,
  provider: LlmProvider,
  sessionState: SessionState,
): Promise<SkillResponse> {
  try {
    const result = await provider.generateSpokenAnswer({
      utterance: context.utterance,
      shortSummary: sessionState.shortSummary,
      locale: context.locale,
    });

    return {
      text: result.text,
      meta: {
        llmProvider: result.provider,
        llmStatus: 'ok',
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(JSON.stringify({
      event: 'llm_handler_error',
      sessionId: context.sessionId,
      requestId: context.requestId,
      message,
    }));

    return {
      text: 'Сейчас не получилось получить ответ от языковой модели. Попробуй переформулировать запрос или повторить чуть позже.',
      meta: {
        llmProvider: 'error',
        llmStatus: 'error',
        llmError: message,
      },
    };
  }
}
