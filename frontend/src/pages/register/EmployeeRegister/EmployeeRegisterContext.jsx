import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const EmployeeRegisterContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [pendingStep, setPendingStep] = useState(null);
  const navigate = useNavigate();

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

  const canAccessStep = useCallback((stepNumber) => {
    if (stepNumber === 1) return true;
    return completedSteps.includes(stepNumber - 1);
  }, [completedSteps]);

  const goToStep = useCallback((stepNumber) => {
    if (canAccessStep(stepNumber)) {
      navigate(`/employee-register/step${stepNumber}`);
    }
  }, [canAccessStep, navigate]);

  useEffect(() => {
    if (!pendingStep) {
      return;
    }

    if (canAccessStep(pendingStep)) {
      navigate(`/employee-register/step${pendingStep}`);
      setPendingStep(null);
    }
  }, [pendingStep, completedSteps, navigate, canAccessStep]);

  const value = useMemo(
    () => ({ completedSteps, completeStep, canAccessStep, goToStep }),
    [completedSteps, canAccessStep, goToStep]
  );

  return (
    <EmployeeRegisterContext.Provider value={value}>
      {children}
    </EmployeeRegisterContext.Provider>
  );
}

RegistrationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useRegistration() {
  const ctx = useContext(EmployeeRegisterContext);
  if (!ctx) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return ctx;
}
