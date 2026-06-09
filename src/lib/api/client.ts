import { withTimeout } from '../async';
import { COPY } from '../copy';
import { env } from '../env';
import { supabase } from '../supabase';
import { ApiError } from './errors';

type RequestOptions = {
  /** Attach the Supabase JWT as Bearer. Default true. Set false for public endpoints. */
  auth?: boolean;
  signal?: AbortSignal;
  /** Hard ceiling for the whole request (ms). Defaults to REQUEST_TIMEOUT_MS. */
  timeoutMs?: number;
};

/**
 * Hard ceiling for the network fetch. Generous enough for the slow AI-generation
 * endpoints (DeepSeek behind Vercel Pro, maxDuration 60s) while still guaranteeing
 * a call can never hang forever.
 */
const REQUEST_TIMEOUT_MS = 60_000;

/**
 * Tighter bound for reading the Supabase session. `getSession()` can hang while
 * it refreshes an expired token over a flaky network (observed: an authenticated
 * action spinning forever). 12s is far beyond a healthy refresh, so reaching it
 * means the call is wedged — fail cleanly as an expired session instead.
 */
const AUTH_TIMEOUT_MS = 12_000;

function safeParse(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function request<TResponse>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<TResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const timeoutMs = options?.timeoutMs ?? REQUEST_TIMEOUT_MS;

  if (options?.auth !== false) {
    // Bound the session read: a hung getSession() must fail as an expired session
    // (recoverable — the user reconnects) rather than spin the caller forever.
    const session = await withTimeout(
      supabase.auth.getSession().then((r) => r.data.session),
      AUTH_TIMEOUT_MS,
      null,
    );
    const token = session?.access_token;
    if (!token) {
      throw new ApiError(401, COPY.errSession);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  // Abort the fetch after timeoutMs (and honour a caller-provided signal) so a
  // stalled connection can never leave the UI spinning indefinitely.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const callerSignal = options?.signal;
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // fetch only rejects on transport failure (offline, DNS, timeout/abort).
    throw new ApiError(0, COPY.errNetwork);
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  const json = text ? safeParse(text) : null;

  if (!response.ok) {
    const message =
      json && typeof json.error === 'string'
        ? json.error
        : `Une erreur est survenue (${response.status}). Réessaie plus tard.`;
    const code = json && typeof json.code === 'string' ? json.code : undefined;
    throw new ApiError(response.status, message, code, json?.details);
  }

  return json as TResponse;
}

/** Authenticated GET by default. Pass `{ auth: false }` for public endpoints. */
export function apiGet<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
  return request<TResponse>('GET', path, undefined, options);
}

/** Authenticated POST by default. Pass `{ auth: false }` for public endpoints. */
export function apiPost<TResponse>(path: string, body?: unknown, options?: RequestOptions): Promise<TResponse> {
  return request<TResponse>('POST', path, body, options);
}

/** Authenticated DELETE by default. */
export function apiDelete<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
  return request<TResponse>('DELETE', path, undefined, options);
}
