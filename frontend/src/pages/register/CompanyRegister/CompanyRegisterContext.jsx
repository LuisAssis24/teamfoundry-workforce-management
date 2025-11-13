import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CompanyRegisterContext = createContext(null);

const buildInitialData = () => ({
  credentials: {},
  company: {},
  submission: {},
});

export function CompanyRegistrationProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [pendingStep, setPendingStep] = useState(null);
  const [companyData, setCompanyData] = useState(buildInitialData);
  const navigate = useNavigate();
  const basePath = "/company-register";

  const completeStep = (stepNumber, nextStepNumber = null) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev
        : [...prev, stepNumber].sort((a, b) => a - b)
    );
    if (nextStepNumber) {
      setPendingStep(nextStepNumber);
    }
  };

  const canAccessStep = useCallback(
    (stepNumber) => (stepNumber === 1 ? true : completedSteps.includes(stepNumber - 1)),
    [completedSteps],
  );

  const goToStep = useCallback(
    (stepNumber) => {
      if (canAccessStep(stepNumber)) {
        navigate(`${basePath}/step${stepNumber}`);
      }
    },
    [basePath, canAccessStep, navigate],
  );

  useEffect(() => {
    if (!pendingStep) return;
    if (canAccessStep(pendingStep)) {
      navigate(`${basePath}/step${pendingStep}`);
      setPendingStep(null);
    }
  }, [pendingStep, canAccessStep, navigate, basePath]);

  const updateStepData = (section, payload) => {
    setCompanyData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...payload,
      },
    }));
  };

  const resetFlow = useCallback(() => {
    setCompletedSteps([]);
    setCompanyData(buildInitialData());
    setPendingStep(null);
  }, []);

  const value = useMemo(
    () => ({
      completedSteps,
      completeStep,
      canAccessStep,
      goToStep,
      companyData,
      updateStepData,
      resetFlow,
    }),
    [completedSteps, canAccessStep, goToStep, companyData, resetFlow],
  );

  return (
    <CompanyRegisterContext.Provider value={value}>
      {children}
    </CompanyRegisterContext.Provider>
  );
}

CompanyRegistrationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCompanyRegistration() {
  const context = useContext(CompanyRegisterContext);
  if (!context) {
    throw new Error("useCompanyRegistration must be used within CompanyRegistrationProvider");
  }
  return context;
}
