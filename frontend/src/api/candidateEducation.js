import { httpDelete, httpGet, httpPost, httpPut } from "./http.js";

const BASE_PATH = "/api/candidate/education";

export const listCandidateEducation = () => httpGet(BASE_PATH);

export const createCandidateEducation = (payload) => httpPost(BASE_PATH, payload);

export const updateCandidateEducation = (id, payload) => httpPut(`${BASE_PATH}/${id}`, payload);

export const deleteCandidateEducation = (id) => httpDelete(`${BASE_PATH}/${id}`);
