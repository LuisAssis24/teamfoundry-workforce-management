import { httpDelete, httpGet, httpPost, httpPut } from "./http.js";

const BASE_PATH = "/api/candidate/jobs";

export const listCandidateJobs = ({ status = "COMPLETED", page = 0, size = 5 } = {}) =>
  httpGet(`${BASE_PATH}?status=${encodeURIComponent(status)}&page=${page}&size=${size}`);

export const createManualJob = (payload) =>
  httpPost(`${BASE_PATH}/manual`, payload);

export const updateManualJob = (id, payload) =>
  httpPut(`${BASE_PATH}/manual/${id}`, payload);

export const deleteManualJob = (id) =>
  httpDelete(`${BASE_PATH}/manual/${id}`);
