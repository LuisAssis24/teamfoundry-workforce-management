import { apiFetch } from "./client.js";

const ADMIN_BASE = "/api/super-admin/site";

async function toJsonOrThrow(resp, defaultMessage) {
  if (!resp.ok) {
    const fallback = defaultMessage || "Operação não pôde ser concluída.";
    const error = new Error(fallback);
    error.status = resp.status;
    throw error;
  }
  return resp.json();
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// --- Public ---
export async function fetchPublicHomepage() {
  const resp = await apiFetch("/api/site/homepage", {}, { autoRefresh: false });
  return toJsonOrThrow(resp, "Falha ao carregar a home page pública.");
}

// --- Homepage sections ---
export async function fetchHomepageConfig() {
  const resp = await apiFetch(`${ADMIN_BASE}/homepage`);
  return toJsonOrThrow(resp, "Não foi possível carregar as configurações do site.");
}

export async function updateSection(sectionId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/homepage/sections/${sectionId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "Não foi possível guardar a secção.");
}

export async function reorderSections(sectionIds) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/homepage/sections/reorder`,
    jsonOptions("PUT", { ids: sectionIds })
  );
  return toJsonOrThrow(resp, "Ordenação das secções falhou.");
}

// --- Industries ---
export async function createIndustry(payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/industries`, jsonOptions("POST", payload));
  return toJsonOrThrow(resp, "Não foi possível criar a indústria.");
}

export async function updateIndustry(industryId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/industries/${industryId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "Não foi possível atualizar a indústria.");
}

export async function toggleIndustry(industryId, active) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/industries/${industryId}/visibility`,
    jsonOptions("PATCH", { active })
  );
  return toJsonOrThrow(resp, "Não foi possível alterar a visibilidade da indústria.");
}

export async function reorderIndustries(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/industries/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "Não foi possível reordenar indústrias.");
}

export async function deleteIndustry(industryId) {
  const resp = await apiFetch(`${ADMIN_BASE}/industries/${industryId}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = new Error("Não foi possível eliminar a indústria.");
    error.status = resp.status;
    throw error;
  }
}

// --- Partners ---
export async function createPartner(payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/partners`, jsonOptions("POST", payload));
  return toJsonOrThrow(resp, "Não foi possível criar o parceiro.");
}

export async function updatePartner(partnerId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/partners/${partnerId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "Não foi possível atualizar o parceiro.");
}

export async function togglePartner(partnerId, active) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/partners/${partnerId}/visibility`,
    jsonOptions("PATCH", { active })
  );
  return toJsonOrThrow(resp, "Não foi possível alterar a visibilidade do parceiro.");
}

export async function reorderPartners(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/partners/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "Não foi possível reordenar parceiros.");
}

export async function deletePartner(partnerId) {
  const resp = await apiFetch(`${ADMIN_BASE}/partners/${partnerId}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = new Error("Não foi possível eliminar o parceiro.");
    error.status = resp.status;
    throw error;
  }
}

// --- Media ---
export async function uploadSiteImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const resp = await apiFetch(`${ADMIN_BASE}/media/upload`, {
    method: "POST",
    body: formData,
  });
  return toJsonOrThrow(resp, "Não foi possível carregar a imagem.");
}
