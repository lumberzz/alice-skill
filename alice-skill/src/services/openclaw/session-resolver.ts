import type { OpenClawTaskType } from './permissions.js';

export interface ResolvedOpenClawSessionTarget {
  sessionKey: string;
  routingMode: 'dedicated-alice-worker';
}

export function resolveOpenClawSessionTarget(taskType: OpenClawTaskType, aliceUserId: string): ResolvedOpenClawSessionTarget {
  const sanitizedUserId = aliceUserId.replace(/[^a-zA-Z0-9_-]/g, '-');

  return {
    sessionKey: `alice-worker:${taskType}:${sanitizedUserId}`,
    routingMode: 'dedicated-alice-worker',
  };
}
