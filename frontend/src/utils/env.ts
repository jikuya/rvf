export function getApiBaseUrl() {
  return (globalThis as any).__VITE_API_BASE_URL__ || 'http://localhost:3000/api/v1';
} 