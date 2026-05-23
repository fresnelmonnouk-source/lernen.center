/**
 * Normalized API error. The backend returns `{ error: string }` (and may add
 * `code` / `details`); we wrap everything — including network failures — in a
 * single typed error so screens can show a friendly French message without
 * touching technical causes.
 */
export class ApiError extends Error {
  constructor(
    /** HTTP status, or 0 for a network/transport failure. */
    readonly status: number,
    /** User-facing French message. */
    message: string,
    readonly code?: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** True when the failure is auth-related (missing/expired session). */
  get isAuth(): boolean {
    return this.status === 401;
  }

  /** True when no response was received (offline, DNS, timeout). */
  get isNetwork(): boolean {
    return this.status === 0;
  }
}
