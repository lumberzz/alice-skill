import express from 'express';
import { parseAliceRequest, toTurnContext } from '../alice/mapper.js';
import { toAliceResponse } from '../alice/response.js';
import { orchestrateTurn } from '../dialog/orchestrator.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'alice-skill' });
});

app.post('/alice/webhook', (req, res) => {
  try {
    const aliceRequest = parseAliceRequest(req.body);
    const context = toTurnContext(aliceRequest);
    const response = orchestrateTurn(context);

    console.log(JSON.stringify({
      event: 'alice_turn',
      requestId: context.requestId,
      sessionId: context.sessionId,
      userId: context.userId,
      utterance: context.utterance,
      route: response.meta?.route,
    }));

    res.json(toAliceResponse(aliceRequest, response));
  } catch (error) {
    console.error('alice_webhook_error', error);
    res.status(400).json({
      error: 'invalid_request',
    });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`alice-skill listening on :${port}`);
});
