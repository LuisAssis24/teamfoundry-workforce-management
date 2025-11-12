import React, { useMemo, useState } from "react";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import { useOutletContext } from "react-router-dom";

const passwordRequirements = [
  { id: "length", label: "Pelo menos 8 caracteres", test: (value) => value.length >= 8 },
  { id: "uppercase", label: "Uma letra maiúscula", test: (value) => /[A-Z]/.test(value) },
  { id: "lowercase", label: "Uma letra minúscula", test: (value) => /[a-z]/.test(value) },
  { id: "number", label: "Um número", test: (value) => /[0-9]/.test(value) },
  { id: "symbol", label: "Um símbolo", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+()\s-]{6,20}$/;

/**
 * Passo 1 do registo de empresa: credenciais e responsável.
 */
export default function CompanyRegisterStep1() {
  const { companyData, updateStepData, completeStep } = useOutletContext();

  const [credentialEmail, setCredentialEmail] = useState(companyData.credentials?.credentialEmail || "");
  const [password, setPassword] = useState(companyData.credentials?.password || "");
  const [confirmPassword, setConfirmPassword] = useState(companyData.credentials?.password || "");
  const [responsibleName, setResponsibleName] = useState(companyData.credentials?.responsibleName || "");
  const [responsibleRole, setResponsibleRole] = useState(companyData.credentials?.responsibleRole || "");
  const [responsibleEmail, setResponsibleEmail] = useState(companyData.credentials?.responsibleEmail || "");
  const [responsiblePhone, setResponsiblePhone] = useState(companyData.credentials?.responsiblePhone || "");
  const [errors, setErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => passwordRequirements.map((req) => ({ ...req, valid: req.test(password) })),
    [password],
  );

  const isPasswordValid = passwordChecks.every((item) => item.valid);

  const validate = () => {
    const newErrors = {};
    if (!credentialEmail.trim() || !emailRegex.test(credentialEmail.trim())) {
      newErrors.credentialEmail = "Insira um email válido";
    }
    if (!isPasswordValid) {
      newErrors.password = "A password não cumpre os requisitos mínimos.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As passwords não coincidem.";
    }
    if (!responsibleName.trim()) {
      newErrors.responsibleName = "Informe o nome do responsável.";
    }
    if (!responsibleRole.trim()) {
      newErrors.responsibleRole = "Informe o cargo.";
    }
    if (!responsibleEmail.trim() || !emailRegex.test(responsibleEmail.trim())) {
      newErrors.responsibleEmail = "Informe um email corporativo válido.";
    }
    if (!responsiblePhone.trim()) {
      newErrors.responsiblePhone = "Informe um telefone.";
    } else if (!phoneRegex.test(responsiblePhone.trim())) {
      newErrors.responsiblePhone = "Formato de telefone inválido.";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    updateStepData("credentials", {
      credentialEmail: credentialEmail.trim(),
      password,
      responsibleName: responsibleName.trim(),
      responsibleRole: responsibleRole.trim(),
      responsibleEmail: responsibleEmail.trim(),
      responsiblePhone: responsiblePhone.trim(),
    });
    completeStep(1, 2);
    setLoading(false);
  };

  return (
    <section className="flex h-full flex-col">
      <div>
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Passo 1 de 3</p>
        <h1 className="mt-2 text-3xl font-bold text-accent">Credenciais e Responsável</h1>
        <p className="mt-4 text-base text-base-content/70">
          Crie a credencial de acesso e identifique o responsável pela empresa.
        </p>
      </div>

      <form className="mt-8 flex-1 space-y-6" onSubmit={handleSubmit}>
        <InputField
          label="Email de acesso"
          type="email"
          placeholder="credencial@empresa.com"
          icon={<i className="bi bi-envelope" />}
          value={credentialEmail}
          onChange={(event) => setCredentialEmail(event.target.value)}
          error={errors.credentialEmail}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Crie uma password"
          icon={<i className="bi bi-lock" />}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (!passwordTouched) {
              setPasswordTouched(true);
            }
          }}
          error={errors.password}
        />

        <InputField
          label="Confirmar password"
          type="password"
          placeholder="Repita a password"
          icon={<i className="bi bi-shield-lock" />}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
        />

        {passwordTouched && (
          <div className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm">
            <p className="text-sm font-semibold text-base-content">A password deve incluir:</p>
            <ul className="mt-2 space-y-1">
              {passwordChecks.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-2 text-sm ${item.valid ? "text-success" : "text-error"}`}
                >
                  <i className={`bi ${item.valid ? "bi-check-circle-fill" : "bi-x-circle-fill"}`} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nome do responsável"
            value={responsibleName}
            onChange={(event) => setResponsibleName(event.target.value)}
            error={errors.responsibleName}
          />
          <InputField
            label="Cargo"
            value={responsibleRole}
            onChange={(event) => setResponsibleRole(event.target.value)}
            error={errors.responsibleRole}
          />
          <InputField
            label="Email corporativo"
            type="email"
            value={responsibleEmail}
            onChange={(event) => setResponsibleEmail(event.target.value)}
            error={errors.responsibleEmail}
          />
          <InputField
            label="Telefone"
            value={responsiblePhone}
            onChange={(event) => setResponsiblePhone(event.target.value)}
            error={errors.responsiblePhone}
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <Button label="Anterior" variant="outline" disabled className="btn-outline border-base-300 text-base-content/60" />
          <Button label="Avançar" variant="primary" type="submit" disabled={loading} />
        </div>
      </form>
    </section>
  );
}
