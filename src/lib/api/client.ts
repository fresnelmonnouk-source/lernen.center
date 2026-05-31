import { COPY } from '../copy';
import { env } from '../env';
import { supabase } from '../supabase';
import { ApiError } from './errors';

type RequestOptions = {
  /** Attach the Supabase JWT as Bearer. Default true. Set false for public endpoints. */
  auth?: boolean;
  signal?: AbortSignal;
};

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

  if (options?.auth !== false) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      throw new ApiError(401, COPY.errSession);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: options?.signal,
    });
  } catch {
    // fetch only rejects on transport failure (offline, DNS, aborted).
    throw new ApiError(0, COPY.errNetwork);
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
