const pendingLogs: Promise<void>[] = [];

export function enqueueLog(promise: Promise<void>) {
  pendingLogs.push(promise);
}

export async function flushLogs() {
  await Promise.allSettled(pendingLogs);
  pendingLogs.length = 0;
}