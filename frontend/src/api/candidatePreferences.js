import { httpGet, httpPut } from "./http.js";
import { getAccessToken } from "../auth/tokenStorage.js";

const PREFERENCES_ENDPOINT = "/api/candidate/preferences";
const DEV_EMAIL_KEY = "tfw.devCandidateEmail";
const envDevEmail = (import.meta.env.VITE_DEV_CANDIDATE_EMAIL ?? "").trim();
let forcedEmailParam = null;

function canUseWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStoredDevEmail() {
  if (!canUseWindow()) {
    return "";
  }
  const stored = window.localStorage.getItem(DEV_EMAIL_KEY);
  return stored ? stored.trim() : "";
}

export function getDevCandidateEmailOverride() {
  return envDevEmail || readStoredDevEmail();
}

export function setDevCandidateEmailOverride(email) {
  if (!canUseWindow()) {
    return;
  }
  const trimmed = email?.trim();
  if (trimmed) {
    window.localStorage.setItem(DEV_EMAIL_KEY, trimmed.toLowerCase());
  } else {
    window.localStorage.removeItem(DEV_EMAIL_KEY);
  }
}

export function setCandidatePreferencesEmail(email) {
  forcedEmailParam = email?.trim().toLowerCase() || null;
}

function resolveEmailParam() {
  if (forcedEmailParam) {
    return forcedEmailParam;
  }
  const hasToken = Boolean(getAccessToken());
  if (!hasToken) {
    const devEmail = getDevCandidateEmailOverride();
    if (devEmail) {
      return devEmail;
    }
  }
  return null;
}

function withCandidateEmail(path) {
  const email = resolveEmailParam();
  if (!email) {
    return path;
  }
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}email=${encodeURIComponent(email)}`;
}

export function fetchCandidatePreferences() {
  return httpGet(withCandidateEmail(PREFERENCES_ENDPOINT));
}

export function updateCandidatePreferences(payload) {
  return httpPut(withCandidateEmail(PREFERENCES_ENDPOINT), payload);
}
