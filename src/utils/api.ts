const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

// Empty means same-origin, which is convenient for local development and
// deployments where Express serves both the frontend and API.
const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${API_BASE_URL}${normalizedPath}`, init);
}
