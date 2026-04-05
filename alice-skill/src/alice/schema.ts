import { z } from 'zod';

export const aliceRequestSchema = z.object({
  version: z.string(),
  session: z.object({
    new: z.boolean(),
    session_id: z.string(),
    user_id: z.string(),
  }),
  request: z.object({
    command: z.string().default(''),
    original_utterance: z.string().default(''),
  }),
  meta: z
    .object({
      locale: z.string().default('ru-RU'),
      timezone: z.string().optional(),
    })
    .optional(),
});

export type AliceRequest = z.infer<typeof aliceRequestSchema>;
