import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Mantém o progresso do wizard de colaborador (passos concluídos e proibição de saltos).
const EmployeeRegisterContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [pendingStep, setPendingStep] = useState(null);
  const navigate = useNavigate();

  // Marca um passo como concluído e opcionalmente agenda a navegação para o próximo.
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

  // Um passo só fica acessível depois do imediatamente anterior estar concluído.
  const canAccessStep = useCallback((stepNumber) => {
    if (stepNumber === 1) return true;
    return completedSteps.includes(stepNumber - 1);
  }, [completedSteps]);

  // Encapula a navegação garantindo que respeita o guard acima.
  const goToStep = useCallback((stepNumber) => {
    if (canAccessStep(stepNumber)) {
      navigate(`/employee-register/step${stepNumber}`);
    }
  }, [canAccessStep, navigate]);

  // Depois que `completeStep` define o próximo passo, esta effect executa a navegação real.
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
