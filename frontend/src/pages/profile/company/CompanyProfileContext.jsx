import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "../../../auth/AuthContext.jsx";
import { fetchCompanyProfile, updateCompanyManager } from "../../../api/profile/companyProfile.js";
import { fetchCompanyRequests } from "../../../api/profile/companyRequests.js";

/**
 * Contexto de perfil da empresa: guarda dados básicos, responsável e requisições.
 */
const CompanyProfileContext = createContext(null);

export function CompanyProfileProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [requestsData, setRequestsData] = useState(null);
  const [requestsLoaded, setRequestsLoaded] = useState(false);

  /**
   * Obtém o perfil da empresa autenticada e guarda em cache.
   */
  const refreshProfile = useCallback(
    async (force = false) => {
      if (!isAuthenticated) {
        setCompanyProfile(null);
        return null;
      }
      // Evita refetch se já temos cache e não é pedido force.
      if (!force && companyProfile) {
        return companyProfile;
      }
      setLoadingProfile(true);
      try {
        const data = await fetchCompanyProfile();
        setCompanyProfile(data);
        setProfileError("");
        return data;
      } catch (err) {
        setProfileError(err.message || "Não foi possível carregar o perfil.");
        return null;
      } finally {
        setLoadingProfile(false);
      }
    },
    [isAuthenticated, companyProfile]
  );

  /**
   * Atualiza os dados do responsável e sincroniza o estado local.
   */
  const saveManager = useCallback(
    async (payload) => {
      const data = await updateCompanyManager(payload);
      setCompanyProfile(data);
      return data;
    },
    []
  );

  /**
   * Carrega (uma vez) as requisições da empresa.
   */
  const refreshRequests = useCallback(async () => {
    if (!isAuthenticated) {
      setRequestsData(null);
      setRequestsLoaded(false);
      return null;
    }
    if (requestsLoaded && requestsData) return requestsData;
    const data = await fetchCompanyRequests();
    setRequestsData(Array.isArray(data) ? data : []);
    setRequestsLoaded(true);
    return data;
  }, [isAuthenticated, requestsLoaded, requestsData]);

  useEffect(() => {
    // Só busca se ainda não houver perfil em cache.
    if (!companyProfile && !loadingProfile) {
      refreshProfile();
    }
  }, [refreshProfile, companyProfile, loadingProfile]);

  const value = useMemo(
    () => ({
      companyProfile,
      loadingProfile,
      profileError,
      refreshProfile,
      saveManager,
      requestsData,
      setRequestsData,
      requestsLoaded,
      setRequestsLoaded,
      refreshRequests,
    }),
    [
      companyProfile,
      loadingProfile,
      profileError,
      refreshProfile,
      saveManager,
      requestsData,
      requestsLoaded,
      refreshRequests,
    ]
  );

  return <CompanyProfileContext.Provider value={value}>{children}</CompanyProfileContext.Provider>;
}

CompanyProfileProvider.propTypes = {
  children: PropTypes.node,
};

/**
 * Hook helper para consumir o contexto.
 */
export function useCompanyProfile() {
  const ctx = useContext(CompanyProfileContext);
  if (!ctx) {
    throw new Error("useCompanyProfile deve ser usado dentro de CompanyProfileProvider");
  }
  return ctx;
}
