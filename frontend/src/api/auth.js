import { apiFetch } from './client.js';
import { setTokens, clearTokens } from '../auth/tokenStorage.js';

export async function login(email, password) {
  const resp = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }, { autoRefresh: false });

  if (!resp.ok) {
    const msg = await safeText(resp);
    throw new Error(msg || 'Falha no login');
  }
  const data = await resp.json();
  const accessToken = data.accessToken || data.acessToken;
  setTokens({ accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function logout() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      }, { autoRefresh: false });
    }
  } finally {
    clearTokens();
  }
}

async function safeText(resp) {
  try { return await resp.text(); } catch { return ''; }
}

