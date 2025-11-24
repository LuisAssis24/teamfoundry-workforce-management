import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { fetchEmployeeProfile } from "../../../api/profile/employeeProfile.js";
import { useAuthContext } from "../../../auth/AuthContext.jsx";

const EmployeeProfileContext = createContext(null);

export function EmployeeProfileProvider({ children }) {
  // Mantém cache local do perfil e dos dados das tabs, evitando refetch a cada navegação.
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [preferencesData, setPreferencesData] = useState(null);
  const [educationData, setEducationData] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const { isAuthenticated } = useAuthContext();

  const refreshProfile = useCallback(async () => {
    // Recarrega o perfil do candidato se existir sessão. Caso contrário, limpa o cache.
    if (!isAuthenticated) {
      setProfile(null);
      return null;
    }
    setLoadingProfile(true);
    try {
      const data = await fetchEmployeeProfile();
      setProfile(data);
      setProfileError(null);
      return data;
    } catch (error) {
      setProfileError(error.message || "Não foi possível carregar o perfil.");
      return null;
    } finally {
      setLoadingProfile(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Busca inicial do perfil logo que o provider monta.
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      profile,
      loadingProfile,
      profileError,
      refreshProfile,
      setProfile,
      personalData,
      setPersonalData,
      preferencesData,
      setPreferencesData,
      educationData,
      setEducationData,
      jobsData,
      setJobsData,
    }),
    [
      profile,
      loadingProfile,
      profileError,
      refreshProfile,
      personalData,
      preferencesData,
      educationData,
      jobsData,
    ]
  );

  return <EmployeeProfileContext.Provider value={value}>{children}</EmployeeProfileContext.Provider>;
}

EmployeeProfileProvider.propTypes = {
  children: PropTypes.node,
};

export function useEmployeeProfile() {
  const ctx = useContext(EmployeeProfileContext);
  if (!ctx) {
    throw new Error("useEmployeeProfile deve ser usado dentro de EmployeeProfileProvider");
  }
  return ctx;
}
