export function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function isTodayOrFuture(value: string) {
  return Boolean(value) && value >= todayDateString();
}

export function isSameOrAfter(value: string, minimum: string) {
  return Boolean(value) && Boolean(minimum) && value >= minimum;
}
