/**
 * Resolve `promise`, or fall back to `fallback` if it hasn't settled within `ms`.
 *
 * Never rejects: a rejected promise and a timed-out one both yield `fallback`.
 * Used to keep network-backed auth calls (Supabase `getSession`, the profile
 * query) from hanging the UI forever on a flaky connection — a real risk for our
 * audience (West/Central Africa + Europe, mobile networks).
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}
