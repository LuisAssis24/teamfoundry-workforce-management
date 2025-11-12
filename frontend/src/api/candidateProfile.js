import { httpGet, httpPut } from "./http.js";

const PROFILE_ENDPOINT = "/api/candidate/profile";

export async function fetchCandidateProfile() {
  return httpGet(PROFILE_ENDPOINT);
}

export async function updateCandidateProfile(payload) {
  return httpPut(PROFILE_ENDPOINT, payload);
}
