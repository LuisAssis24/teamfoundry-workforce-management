import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import { registerStep4, resendVerificationCode } from "../../../api/auth/auth.js";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

const maskEmail = (email = "") => {
    if (!email.includes("@")) {
        return email;
    }
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
        return `${localPart[0] || ""}***@${domain}`;
    }
    return `${localPart.slice(0, 2)}***@${domain}`;
};

/**
 * Passo 4: recebe os 5 dígitos do código enviado ao email e confirma a conta.
 * Também permite reenviar o código reaproveitando as credenciais inseridas no passo 1.
 */
export default function EmployeeRegisterStep4() {
    const { registerData, updateStepData, completeStep, goToStep } = useOutletContext();
    const emailFromState = registerData.credentials?.email || "";

    const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
    const [resent, setResent] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef([]);

    // Se o utilizador regressar a este passo, repõe o código previamente digitado.
    useEffect(() => {
        const storedCode = registerData.verification?.code || "";
        if (storedCode) {
            const padded = storedCode.padEnd(CODE_LENGTH, "");
            setCode(padded.slice(0, CODE_LENGTH).split(""));
        }
    }, [registerData.verification?.code]);

    const isComplete = useMemo(() => code.every((digit) => digit !== ""), [code]);

    const focusInput = (index) => {
        const input = inputRefs.current[index];
        if (input) {
            input.focus();
            input.select();
        }
    };

    // Countdown para evitar spam no endpoint de reenvio.
    useEffect(() => {
        if (resendCooldown <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setResendCooldown((prev) => Math.max(prev - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleChange = (index, value) => {
        const sanitized = value.replace(/\D/g, "");
        if (!sanitized) {
            setCode((prev) => {
                const next = [...prev];
                next[index] = "";
                return next;
            });
            return;
        }

        const digit = sanitized.slice(-1);
        setCode((prev) => {
            const next = [...prev];
            next[index] = digit;
            return next;
        });

        if (index < CODE_LENGTH - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            focusInput(index - 1);
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusInput(index - 1);
        }

        if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
            event.preventDefault();
            focusInput(index + 1);
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
        if (!pasted) {
            return;
        }

        setCode((prev) => {
            const next = [...prev];
            pasted.split("").forEach((digit, index) => {
                next[index] = digit;
            });
            return next;
        });

        if (pasted.length < CODE_LENGTH) {
            focusInput(pasted.length);
        }
    };

    // Valida o código final e, se aprovado, marca o registo como completo.
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isComplete) {
            return;
        }

        try {
            await registerStep4({ email: emailFromState, verificationCode: code.join("") });
            setSuccess(true);
            setServerError("");
            updateStepData("verification", { code: code.join("") });
            completeStep(4);
        } catch (error) {
            setServerError(error.message || "Não foi possível validar o código.");
        }
    };

    // Reutiliza o email capturado no passo 1 para reenviar o OTP.
    const handleResend = async () => {
        if (resendCooldown > 0 || isResending) {
            return;
        }
        setIsResending(true);
        try {
            await resendVerificationCode(emailFromState);
            setResent(true);
            setServerError("");
            setResendCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (error) {
            setServerError(error.message || "Não foi possível reenviar o código.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <section className="flex h-full flex-col">
            <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Passo 4 de 4
                </p>
                <h1 className="mt-2 text-3xl font-bold text-accent">
                    Confirmar identidade
                </h1>
                <p className="mt-4 text-base text-base-content/70">
                    Foi enviado um código de verificação para{" "}
                    <span className="font-semibold">{maskEmail(emailFromState)}</span>. Insira o código abaixo para
                    concluir o registo.
                </p>
            </div>

            <form className="mt-8 flex-1 space-y-6" onSubmit={handleSubmit}>
                <div className="flex items-center justify-between gap-3">
                    {code.map((digit, index) => (
                        <InputField
                            key={index}
                            label=""
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(event) => handleChange(index, event.target.value)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            onPaste={handlePaste}
                            aria-label={`Dígito ${index + 1} do código`}
                            className="w-16"
                            fullWidth={false}
                            inputClassName="input-lg h-16 text-center text-2xl font-semibold"
                            inputRef={(element) => {
                                inputRefs.current[index] = element;
                            }}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm px-0 text-primary"
                            onClick={handleResend}
                            disabled={resendCooldown > 0 || isResending}
                        >
                            {resendCooldown > 0
                                ? `Aguarde ${resendCooldown}s`
                                : "Reenviar código de confirmação"}
                        </button>

                    </div>
                    {resent && resendCooldown > 0 && (
                        <span className="text-sm text-success">Novo código enviado!</span>
                    )}
                </div>

                {serverError && (
                    <div className="alert alert-error">
                        <span>{serverError}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span>Identidade confirmada com sucesso!</span>
                    </div>
                )}

                <div className="mt-10 grid grid-cols-2 gap-4">
                    <Button
                        label="← Voltar"
                        variant="outline"
                        className="btn-outline border-base-300"
                        onClick={() => goToStep(3)}
                    />
                    <Button
                        label="Concluir"
                        type="submit"
                        variant="primary"
                        disabled={!isComplete}
                    />
                </div>
            </form>
        </section>
    );
}
