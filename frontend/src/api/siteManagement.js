import { apiFetch } from "./auth/client.js";

const ADMIN_BASE = "/api/super-admin/site";

async function toJsonOrThrow(resp, defaultMessage) {
  if (!resp.ok) {
    const fallback = defaultMessage || "Opera��ǜo nǜo p��de ser conclu��da.";
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
  return toJsonOrThrow(resp, "Falha ao carregar a home page pǧblica.");
}

// --- Homepage sections ---
export async function fetchHomepageConfig() {
  const resp = await apiFetch(`${ADMIN_BASE}/homepage`);
  return toJsonOrThrow(resp, "Nǜo foi poss��vel carregar as configura����es do site.");
}

export async function updateSection(sectionId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/homepage/sections/${sectionId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel guardar a sec��ǜo.");
}

export async function reorderSections(sectionIds) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/homepage/sections/reorder`,
    jsonOptions("PUT", { ids: sectionIds })
  );
  return toJsonOrThrow(resp, "Ordena��ǜo das sec����es falhou.");
}

// --- Industries ---
export async function createIndustry(payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/industries`, jsonOptions("POST", payload));
  return toJsonOrThrow(resp, "Nǜo foi poss��vel criar a indǧstria.");
}

export async function updateIndustry(industryId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/industries/${industryId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel atualizar a indǧstria.");
}

export async function toggleIndustry(industryId, active) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/industries/${industryId}/visibility`,
    jsonOptions("PATCH", { active })
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel alterar a visibilidade da indǧstria.");
}

export async function reorderIndustries(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/industries/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel reordenar indǧstrias.");
}

export async function deleteIndustry(industryId) {
  const resp = await apiFetch(`${ADMIN_BASE}/industries/${industryId}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = new Error("Nǜo foi poss��vel eliminar a indǧstria.");
    error.status = resp.status;
    throw error;
  }
}

// --- Partners ---
export async function createPartner(payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/partners`, jsonOptions("POST", payload));
  return toJsonOrThrow(resp, "Nǜo foi poss��vel criar o parceiro.");
}

export async function updatePartner(partnerId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/partners/${partnerId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel atualizar o parceiro.");
}

export async function togglePartner(partnerId, active) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/partners/${partnerId}/visibility`,
    jsonOptions("PATCH", { active })
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel alterar a visibilidade do parceiro.");
}

export async function reorderPartners(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/partners/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "Nǜo foi poss��vel reordenar parceiros.");
}

export async function deletePartner(partnerId) {
  const resp = await apiFetch(`${ADMIN_BASE}/partners/${partnerId}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = new Error("Nǜo foi poss��vel eliminar o parceiro.");
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
  return toJsonOrThrow(resp, "Nǜo foi poss��vel carregar a imagem.");
}

// --- Authenticated home ---
export async function fetchAppHomePublic() {
  const resp = await apiFetch("/api/site/app-home", {}, { autoRefresh: false });
  return toJsonOrThrow(resp, "Falha ao carregar a home autenticada.");
}

// --- Weekly tips ---
export async function fetchWeeklyTipsPage() {
  const resp = await apiFetch("/api/site/weekly-tips", {}, { autoRefresh: false });
  return toJsonOrThrow(resp, "Falha ao carregar as dicas.");
}

export async function fetchWeeklyTipsAdmin() {
  const resp = await apiFetch(`${ADMIN_BASE}/weekly-tips`);
  return toJsonOrThrow(resp, "N�o foi poss�vel carregar as dicas da semana.");
}

export async function createWeeklyTip(payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/weekly-tips`, jsonOptions("POST", payload));
  return toJsonOrThrow(resp, "N�o foi poss�vel criar a dica.");
}

export async function updateWeeklyTip(id, payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/weekly-tips/${id}`, jsonOptions("PUT", payload));
  return toJsonOrThrow(resp, "N�o foi poss�vel atualizar a dica.");
}

export async function toggleWeeklyTipVisibility(id, active) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/weekly-tips/${id}/visibility`,
    jsonOptions("PATCH", { active })
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel alterar a visibilidade da dica.");
}

export async function markWeeklyTipFeatured(id) {
  const resp = await apiFetch(`${ADMIN_BASE}/weekly-tips/${id}/featured`, {
    method: "PATCH",
  });
  return toJsonOrThrow(resp, "N�o foi poss�vel definir a dica da semana.");
}

export async function reorderWeeklyTips(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/weekly-tips/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel reordenar as dicas.");
}

export async function deleteWeeklyTip(id) {
  const resp = await apiFetch(`${ADMIN_BASE}/weekly-tips/${id}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = new Error("N�o foi poss�vel eliminar a dica.");
    error.status = resp.status;
    throw error;
  }
}

export async function fetchAppHomeConfig() {
  const resp = await apiFetch(`${ADMIN_BASE}/app-home`);
  return toJsonOrThrow(resp, "N�o foi poss�vel carregar a home autenticada.");
}

export async function updateAppHomeSection(sectionId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/app-home/sections/${sectionId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel atualizar a sec��o.");
}

export async function reorderAppHomeSections(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/app-home/sections/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel reordenar as sec��es.");
}

export async function createAppMetric(payload) {
  const resp = await apiFetch(`${ADMIN_BASE}/app-home/metrics`, jsonOptions("POST", payload));
  return toJsonOrThrow(resp, "N�o foi poss�vel criar a m�trica.");
}

export async function updateAppMetric(metricId, payload) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/app-home/metrics/${metricId}`,
    jsonOptions("PUT", payload)
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel atualizar a m�trica.");
}

export async function toggleAppMetric(metricId, active) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/app-home/metrics/${metricId}/visibility`,
    jsonOptions("PATCH", { active })
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel alterar a visibilidade da m�trica.");
}

export async function reorderAppMetrics(ids) {
  const resp = await apiFetch(
    `${ADMIN_BASE}/app-home/metrics/reorder`,
    jsonOptions("PUT", { ids })
  );
  return toJsonOrThrow(resp, "N�o foi poss�vel reordenar as m�tricas.");
}

export async function deleteAppMetric(metricId) {
  const resp = await apiFetch(`${ADMIN_BASE}/app-home/metrics/${metricId}`, {
    method: "DELETE",
  });
  if (!resp.ok) {
    const error = new Error("N�o foi poss�vel eliminar a m�trica.");
    error.status = resp.status;
    throw error;
  }
}

