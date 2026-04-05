import express from 'express';
import { parseAliceRequest, toTurnContext } from '../alice/mapper.js';
import { toAliceResponse } from '../alice/response.js';
import { orchestrateTurn } from '../dialog/orchestrator.js';
import { withRequestContext } from '../middleware/request-context.js';
import { logTurnEnd, logTurnError, logTurnStart } from '../middleware/logging.js';
import { MemorySessionStore } from '../state/memory-store.js';

const app = express();
const sessionStore = new MemorySessionStore();

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'alice-skill' });
});

app.post('/alice/webhook', (req, res) => {
  try {
    const aliceRequest = parseAliceRequest(req.body);
    const turn = toTurnContext(aliceRequest);
    const context = withRequestContext(turn);

    logTurnStart({
      requestId: context.requestId,
      sessionId: context.sessionId,
      userId: context.userId,
      utterance: context.utterance,
    });

    const response = orchestrateTurn(context, sessionStore);

    logTurnEnd({
      requestId: context.requestId,
      route: response.meta?.route,
      latencyMs: Date.now() - context.startedAt,
    });

    res.json(toAliceResponse(aliceRequest, response));
  } catch (error) {
    logTurnError({
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(400).json({
      error: 'invalid_request',
    });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`alice-skill listening on :${port}`);
});
