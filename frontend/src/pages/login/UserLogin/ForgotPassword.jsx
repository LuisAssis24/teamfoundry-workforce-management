import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import Modal from "../../../components/ui/Modal/Modal.jsx";
import { forgotPassword, resetPassword, verifyResetCode } from "../../../api/auth.js";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 45;

// Finite state machine para os 3 passos do modal.
const STEPS = {
  EMAIL: "email",
  CODE: "code",
  RESET: "reset",
};

// Ajuda a mascarar o email no copy do código sem expor totalmente o endereço.
const maskEmail = (email = "") => {
  if (!email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (!local) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${local.length > 2 ? "***" : ""}@${domain}`;
};

// Mesmo conjunto de regras usado no registo de colaboradores/empresas.
const passwordRequirements = [
  { id: "length", label: "Pelo menos 8 caracteres", test: (value) => value.length >= 8 },
  { id: "uppercase", label: "Uma letra maiúscula", test: (value) => /[A-Z]/.test(value) },
  { id: "lowercase", label: "Uma letra minúscula", test: (value) => /[a-z]/.test(value) },
  { id: "number", label: "Um número", test: (value) => /[0-9]/.test(value) },
  { id: "symbol", label: "Um símbolo", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export default function ForgotPassword({ open, onClose, initialEmail }) {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState(initialEmail || "");
  const [codeDigits, setCodeDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [codeError, setCodeError] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef([]);

  const isCodeComplete = useMemo(
    () => codeDigits.every((digit) => digit !== ""),
    [codeDigits]
  );
  const codeValue = useMemo(() => codeDigits.join(""), [codeDigits]);
  const passwordChecks = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        ...requirement,
        valid: requirement.test(newPassword),
      })),
    [newPassword]
  );
  const isPasswordValid = useMemo(
    () => passwordChecks.every((item) => item.valid),
    [passwordChecks]
  );

  // Controla o countdown para reenvio de código.
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(
        () =>
          setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0)),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Sempre que o modal fecha limpamos o estado completo.
  useEffect(() => {
    if (!open) {
      resetModalState();
    } else {
      setEmail(initialEmail || "");
    }
  }, [open, initialEmail]);

  // Foca automaticamente o primeiro campo da OTP sempre que entramos na etapa de código.
  useEffect(() => {
    if (step === STEPS.CODE && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Restabelece todos os campos e mensagens para o estado inicial.
  const resetModalState = () => {
    setStep(STEPS.EMAIL);
    setEmail(initialEmail || "");
    setCodeDigits(Array(CODE_LENGTH).fill(""));
    setNewPassword("");
    setConfirmPassword("");
    setPasswordFocused(false);
    setLoading(false);
    setError("");
    setInfoMessage("");
    setSuccessMessage("");
    setResendCooldown(0);
    setResent(false);
    setCodeError("");
  };

  // Passo 1: valida o email, chama o endpoint e avança para o passo de código.
  const handleRequestCode = async (event) => {
    event?.preventDefault?.();
    if (!email.trim()) {
      setError("Informe o email associado à conta.");
      return;
    }
    setLoading(true);
    setError("");
    setInfoMessage("");
    setSuccessMessage("");
    setCodeError("");
    try {
      await forgotPassword(email.trim());
      setStep(STEPS.CODE);
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setInfoMessage("Enviámos um código para o seu email. Verifique a caixa de entrada ou spam.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setResent(false);
    } catch (err) {
      setError(err.message || "Não foi possível enviar o código.");
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: valida os 6 dígitos junto ao backend antes de permitir trocar a password.
  const handleCodeSubmit = async (event) => {
    event?.preventDefault?.();
    if (!isCodeComplete) {
      const message = "Insira o código completo.";
      setError(message);
      setCodeError(message);
      return;
    }
    setLoading(true);
    setError("");
    setInfoMessage("");
    setCodeError("");
    try {
      await verifyResetCode(email.trim(), codeValue);
      setStep(STEPS.RESET);
    } catch (err) {
      const message = err.message || "Código inválido ou expirado.";
      setError(message);
      setCodeError(message);
    } finally {
      setLoading(false);
    }
  };

  // Passo 3: aplica exatamente as mesmas regras de password do registo e envia o update.
  const handleResetPassword = async (event) => {
    event?.preventDefault?.();
    if (!isPasswordValid) {
      setError("A nova password não cumpre os requisitos mínimos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(email.trim(), codeValue, newPassword);
      setSuccessMessage("Password atualizada com sucesso. Já pode iniciar sessão.");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Não foi possível atualizar a password.");
    } finally {
      setLoading(false);
    }
  };

  // Permite reenviar o código respeitando o cooldown e preservando o email informado.
  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return;
    if (!email.trim()) {
      setError("Email inválido. Volte ao passo anterior para informar o email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email.trim());
      setResent(true);
      setInfoMessage("Novo código enviado. Pode demorar alguns minutos.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.message || "Não foi possível reenviar o código.");
    } finally {
      setLoading(false);
    }
  };

  // Helpers de usabilidade do input OTP (mudança, setas, paste etc.).
  const handleCodeChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "");
    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = sanitized ? sanitized.slice(-1) : "";
      return next;
    });
    if (sanitized && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (event, index) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH)
      .split("");
    if (!pasted.length) return;
    setCodeDigits((prev) => {
      const next = [...prev];
      pasted.forEach((digit, idx) => {
        if (idx < CODE_LENGTH) {
          next[idx] = digit;
        }
      });
      return next;
    });
    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const renderEmailStep = () => (
    <form className="space-y-4" onSubmit={handleRequestCode}>
      <p className="text-sm text-base-content/80">
        Iremos enviar um código de confirmação para o email associado à sua conta.
      </p>
      <InputField
        label="Email"
        placeholder="Insira o seu email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<i className="bi bi-envelope" />}
        required
      />
      <Button
        label={loading ? "A enviar..." : "Enviar código"}
        type="submit"
        variant="primary"
        disabled={loading || !email.trim()}
      />
    </form>
  );

  const renderCodeStep = () => (
    <form className="space-y-6" onSubmit={handleCodeSubmit}>
      <div className="space-y-1">
        <p className="text-sm text-base-content/70">
          Introduza o código enviado para{" "}
          <span className="font-semibold">{maskEmail(email)}</span>.
        </p>
        {resent && (
          <span className="text-success text-xs">
            Novo código enviado. Verifique o email.
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        {codeDigits.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleCodeChange(index, event.target.value)}
            onKeyDown={(event) => handleCodeKeyDown(event, index)}
            onPaste={handleCodePaste}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            className="input input-bordered w-12 h-14 text-center text-xl font-semibold"
            aria-label={`Dígito ${index + 1} do código`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="btn btn-link px-0 text-primary"
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || loading}
        >
          {resendCooldown > 0
            ? `Reenviar código em ${resendCooldown}s`
            : "Reenviar código"}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setInfoMessage("");
            setCodeError("");
            setStep(STEPS.EMAIL);
          }}
        >
          Alterar email
        </button>
      </div>

      {codeError && (
        <div className="alert alert-error">
          <span>{codeError}</span>
        </div>
      )}

      <Button
        label="Continuar"
        type="submit"
        variant="primary"
        disabled={!isCodeComplete || loading}
      />
    </form>
  );

  const renderResetStep = () => (
    <form className="space-y-4" onSubmit={handleResetPassword}>
      <p className="text-sm text-base-content/70">
        Define a nova password para a conta{" "}
        <span className="font-semibold">{email}</span>.
      </p>
      <div className="relative">
        <InputField
          label="Nova password"
          type="password"
          placeholder="Insira a nova password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          icon={<i className="bi bi-lock" />}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          required
        />
        {passwordFocused && newPassword && !isPasswordValid && (
          <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-lg z-20">
            <p className="text-sm font-medium text-base-content">
              A password deve incluir:
            </p>
            <ul className="mt-2 space-y-1">
              {passwordChecks.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-2 text-sm ${
                    item.valid ? "text-success" : "text-error"
                  }`}
                >
                  <i
                    className={`bi ${
                      item.valid ? "bi-check-circle-fill" : "bi-x-circle-fill"
                    }`}
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <InputField
        label="Confirmar password"
        type="password"
        placeholder="Confirme a nova password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={<i className="bi bi-lock" />}
        required
      />
      <Button
        label={loading ? "A atualizar..." : "Atualizar password"}
        type="submit"
        variant="primary"
        disabled={loading}
      />
    </form>
  );

  let content;
  if (step === STEPS.EMAIL) content = renderEmailStep();
  if (step === STEPS.CODE) content = renderCodeStep();
  if (step === STEPS.RESET) content = renderResetStep();

  return (
    <Modal
      open={open}
      title="Recuperar Password"
      onClose={onClose}
      actions={
        <button
          type="button"
          className="text-primary font-medium w-full cursor-pointer"
          onClick={onClose}
        >
          Voltar ao Login
        </button>
      }
    >
      <div className="space-y-4">
        {error && step !== STEPS.CODE && (
          <div className="alert alert-error">{error}</div>
        )}
        {infoMessage && <div className="alert alert-info">{infoMessage}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {content}
      </div>
    </Modal>
  );
}

ForgotPassword.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  initialEmail: PropTypes.string,
};

ForgotPassword.defaultProps = {
  open: false,
  onClose: () => {},
  initialEmail: "",
};
