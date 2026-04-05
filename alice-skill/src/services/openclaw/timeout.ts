export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, onTimeout: () => T | Promise<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(async () => resolve(await onTimeout()), timeoutMs);
  });

  const result = await Promise.race([promise, timeoutPromise]);

  if (timer) {
    clearTimeout(timer);
  }

  return result;
}
