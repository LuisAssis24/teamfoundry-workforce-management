import { apiFetch } from "./client.js";

async function parseJson(resp) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

async function handleResponse(resp, defaultMessage) {
  if (resp.ok) {
    if (resp.status === 204) return null;
    return (await parseJson(resp)) ?? null;
  }

  const payload = await parseJson(resp);
  throw new Error(payload?.error || defaultMessage);
}

export const teamRequestsAPI = {
  async getSuperAdminList() {
    const data = await handleResponse(
        await apiFetch("/api/super-admin/work-requests"),
        "Falha ao carregar requisições de trabalho."
    );
    return Array.isArray(data) ? data : [];
  },

  async getAdminOptions() {
    const data = await handleResponse(
        await apiFetch("/api/super-admin/work-requests/admin-options"),
        "Falha ao carregar administradores disponíveis."
    );
    return Array.isArray(data) ? data : [];
  },

  async assignToAdmin(requestId, adminId) {
    const data = await handleResponse(
        await apiFetch(`/api/super-admin/work-requests/${requestId}/responsible-admin`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId }),
        }),
        "Falha ao atribuir administrador."
    );
    if (!data) throw new Error("Resposta inesperada do servidor.");
    return data;
  },
};
