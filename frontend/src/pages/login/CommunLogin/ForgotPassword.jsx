import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import Modal from "../../../components/ui/Modal/Modal.jsx";
import { forgotPassword } from "../../../api/auth.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    navigate("..");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Falha ao solicitar redefinição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title="Recuperar Password"
      onClose={handleClose}
      actions={
        <div className="flex flex-col gap-3 w-full">
          <Button
            label={loading ? "A enviar..." : success ? "Fechar" : "Enviar link"}
            variant="primary"
            onClick={success ? handleClose : handleSubmit}
            disabled={loading || (!success && !email.trim())}
          />
            <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
            >
                Voltar ao Login
            </button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Se o email existir, enviámos um código para redefinir a password.
          </div>
        )}

        <InputField
          label="Email"
          placeholder="Insira o seu email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<i className="bi bi-envelope"></i>}
          disabled={success}
          required
        />
      </form>
    </Modal>
  );
}

