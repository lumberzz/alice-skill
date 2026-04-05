import type { RequestContext } from '../middleware/request-context.js';

export function hasTimeBudget(context: RequestContext, reserveMs = 250): boolean {
  return Date.now() + reserveMs < context.deadlineAt;
}
