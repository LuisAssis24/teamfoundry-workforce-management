import { API_URL } from './config';

const BASE_URL = `${API_URL}/admin/team-requests`;

export const teamRequestsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erro ao buscar requisicoes de equipa');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar requisicoes de equipa:', error);
      throw error;
    }
  },
};
