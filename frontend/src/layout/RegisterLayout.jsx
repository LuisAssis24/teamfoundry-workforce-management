import React, { useMemo, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import registerIllustration from "../assets/images/logo/teamFoundry_LogoPrimary.png";
import { RegistrationProvider, useRegistration } from "../context/RegistrationContext.jsx";

const registerSteps = [
    { id: "step1", path: "/register/step1", label: "Credenciais" },
    { id: "step2", path: "/register/step2", label: "Dados pessoais" },
    { id: "step3", path: "/register/step3", label: "Preferências" },
    { id: "step4", path: "/register/step4", label: "Confirmar identidade" },
];

function RegisterLayoutInner() {
    const location = useLocation();
    const navigate = useNavigate();
    const { canAccessStep, goToStep, completeStep, completedSteps } = useRegistration();

    const [registerData, setRegisterData] = useState({
        credentials: {},
        personal: {},
        preferences: {},
        verification: {},
    });

    const currentStepIndex = useMemo(() => {
        const foundIndex = registerSteps.findIndex((step) =>
            location.pathname.startsWith(step.path),
        );
        return foundIndex >= 0 ? foundIndex : 0;
    }, [location.pathname]);

    const updateStepData = (key, value) => {
        setRegisterData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...value,
            },
        }));
    };

    useEffect(() => {
        const currentStepNumber = registerSteps.findIndex((step) => location.pathname.startsWith(step.path)) + 1;
        if (currentStepNumber === 0) {
            navigate(registerSteps[0].path, { replace: true });
            return;
        }

        if (!canAccessStep(currentStepNumber)) {
            const highestAccessible = registerSteps.reduce(
                (acc, _, idx) => (canAccessStep(idx + 1) ? idx + 1 : acc),
                1,
            );
            goToStep(highestAccessible);
        }
    }, [location.pathname, canAccessStep, goToStep, navigate]);

    return (
        <main className="min-h-screen bg-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden border border-base-200">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="hidden md:block bg-base-200">
                        <img
                            src={registerIllustration}
                            alt="Fluxo de registo de candidato"
                            className="h-full w-full object-contain p-8 bg-base-100"
                        />
                    </div>

                    <div className="p-8 sm:p-10 lg:p-12 flex flex-col">
                        <nav className="flex flex-wrap items-center gap-2 text-sm">
                            {registerSteps.map((step, index) => {
                                const isActive = index === currentStepIndex;
                                const isCompleted = completedSteps.includes(index + 1) && !isActive;
                                const baseClasses =
                                    "btn btn-sm rounded-full px-4 normal-case border";
                                const stateClasses = isActive
                                    ? "btn-primary border-primary"
                                    : isCompleted
                                        ? "btn-success border-success"
                                        : "btn-ghost border-base-200";

                                return (
                                    <React.Fragment key={step.id}>
                                        <button
                                            type="button"
                                            className={`${baseClasses} ${stateClasses}`}
                                            onClick={() => goToStep(index + 1)}
                                            disabled={!canAccessStep(index + 1)}
                                        >
                                            {`Passo ${index + 1}: ${step.label}`}
                                        </button>
                                        {index < registerSteps.length - 1 && (
                                            <span className="text-base-content/40">
                                                <i className="bi bi-chevron-right"></i>
                                            </span>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </nav>

                        <div className="mt-8 flex-1">
                            <Outlet
                                context={{
                                    registerData,
                                    updateStepData,
                                    currentStepIndex,
                                    registerSteps,
                                    goToStep,
                                    completeStep,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function RegisterLayout() {
    return (
        <RegistrationProvider>
            <RegisterLayoutInner />
        </RegistrationProvider>
    );
}
