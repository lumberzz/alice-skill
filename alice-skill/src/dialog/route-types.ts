export type RouteType = 'welcome' | 'help' | 'capabilities' | 'askLLM' | 'fallback';

export interface RouteDecision {
  routeType: RouteType;
  confidence: number;
  reason: string;
}
