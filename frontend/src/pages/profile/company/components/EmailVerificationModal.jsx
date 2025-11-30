import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Modal from "../../../../components/ui/Modal/Modal.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";

/**
 * Modal reutilizável para confirmação do novo email do responsável da empresa.
 */
export default function EmailVerificationModal({
  open,
  email,
  codeDigits,
  resendCooldown,
  sending,
  error,
  onClose,
  onChangeDigit,
  onResend,
  onSubmit,
}) {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [open]);

  const handleChange = (idx, value) => {
    const sanitized = value.replace(/\D/g, "");
    onChangeDigit(idx, sanitized ? sanitized.slice(-1) : "");
    if (sanitized && idx < codeDigits.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Confirmar novo email" className="max-w-xl">
      <form className="space-y-4" onSubmit={onSubmit}>
        <p className="text-sm text-base-content/80">
          Enviámos um código para <span className="font-semibold">{email}</span>. Confirme para
          alterar o email do responsável.
        </p>
        <div className="flex items-center justify-center gap-2">
          {codeDigits.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              className="input input-bordered w-12 h-14 text-center text-xl font-semibold"
              aria-label={`Dígito ${idx + 1} do código`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="btn btn-link px-0 text-primary"
            onClick={onResend}
            disabled={resendCooldown > 0 || sending}
          >
            {resendCooldown > 0
              ? `Reenviar código em ${resendCooldown}s`
              : "Reenviar código"}
          </button>
          <Button
            label={sending ? "A validar..." : "Confirmar"}
            type="submit"
            fullWidth={false}
            disabled={sending}
          />
        </div>
        {error && (
          <div className="alert alert-error text-sm" role="alert">
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
}

EmailVerificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  codeDigits: PropTypes.arrayOf(PropTypes.string).isRequired,
  resendCooldown: PropTypes.number.isRequired,
  sending: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChangeDigit: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
