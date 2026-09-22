const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: options.cache || 'no-store',
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  return {
    ok: response.ok,
    status: response.status,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
  };
}
