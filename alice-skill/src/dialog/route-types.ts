export type RouteType = 'welcome' | 'help' | 'capabilities' | 'askLLM' | 'askOpenClaw' | 'fallback';

export interface RouteDecision {
  routeType: RouteType;
  confidence: number;
  reason: string;
}
