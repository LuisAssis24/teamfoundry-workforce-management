import { httpGet, httpPut } from "../http.js";

const PROFILE_ENDPOINT = "/api/employee/profile";

export async function fetchEmployeeProfile() {
  return httpGet(PROFILE_ENDPOINT);
}

export async function updateEmployeeProfile(payload) {
  return httpPut(PROFILE_ENDPOINT, payload);
}
