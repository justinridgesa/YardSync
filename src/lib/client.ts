/**
 * Basic fetch wrapper with auth
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL || '/api'}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Unknown error',
    }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json() as Promise<T>;
}

/**
 * GET request
 */
export function apiGet<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return apiFetch(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request
 */
export function apiPost<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export function apiPatch<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  return apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export function apiDelete<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return apiFetch(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
