export type OpenClawTaskType = 'research' | 'summary' | 'status';

const ALLOWED_TASKS = new Set<OpenClawTaskType>(['research', 'summary', 'status']);

export function isAllowedTaskType(taskType: string): taskType is OpenClawTaskType {
  return ALLOWED_TASKS.has(taskType as OpenClawTaskType);
}
