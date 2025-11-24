import { API_URL } from './config';
import { getAccessToken } from '../auth/tokenStorage';

const BASE_URL = `${API_URL}/api/super-admin/team-requests`;

export const teamRequestsAPI = {
  getAll: async () => {
    const token = getAccessToken();
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Erro ao buscar requisicoes de equipa");
    return response.json();
  },
};
