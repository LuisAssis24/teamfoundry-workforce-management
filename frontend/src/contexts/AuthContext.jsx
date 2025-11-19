import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { fetchCandidateProfile } from "../api/candidateProfile.js";
import { clearTokens, getAccessToken } from "../auth/tokenStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const refreshProfile = useCallback(async () => {
    const hasToken = Boolean(getAccessToken());
    if (!hasToken) {
      setProfile(null);
      return null;
    }
    setLoadingProfile(true);
    try {
      const data = await fetchCandidateProfile();
      setProfile(data);
      setProfileError(null);
      return data;
    } catch (error) {
      setProfileError(error.message || "N\u00e3o foi poss\u00edvel carregar o perfil.");
      return null;
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const logout = useCallback(() => {
    clearTokens();
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      loadingProfile,
      profileError,
      refreshProfile,
      logout,
    }),
    [profile, loadingProfile, profileError, refreshProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
