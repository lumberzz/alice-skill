export interface SkillButton {
  title: string;
  hide?: boolean;
}

export interface SkillResponse {
  text: string;
  tts?: string;
  endSession?: boolean;
  buttons?: SkillButton[];
  meta?: Record<string, unknown>;
}
