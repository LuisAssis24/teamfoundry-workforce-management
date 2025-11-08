// Permite configurar a API via .env. Se não houver valor, usamos caminhos relativos (útil em dev com proxy Vite).
const envBase = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
const API_BASE = envBase;

/**
 * Lê o corpo textual de uma response e tenta convertê-lo para JSON com segurança.
 * @param {Response} res
 * @returns {Promise<any|null>}
 */
async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Executa um fetch contra o backend garantindo base URL, headers e tratamento de erros.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any|null>}
 */
async function request(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : API_BASE
        ? `${API_BASE}${path}`
        : path;
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers, credentials: "include" });
  const data = await parseBody(response);

  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return data;
}

export const httpGet = (path) => request(path);
export const httpPost = (path, body) =>
  request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
export const httpPut = (path, body) =>
  request(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
export const httpDelete = (path) => request(path, { method: "DELETE" });
