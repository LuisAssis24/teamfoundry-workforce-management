import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import { resetPassword } from "../../../api/auth.js";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setSuccess(false);

    if (!token) {
      setError("Token em falta ou inválido");
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      setError("As passwords não coincidem");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Falha ao redefinir password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <form className="card-body space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-center text-2xl font-bold text-primary">Redefinir Password</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Password redefinida com sucesso. Já pode iniciar sessão.
            </div>
          )}

          <InputField
            label="Nova password"
            type="password"
            placeholder="Insira a nova password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<i className="bi bi-lock"></i>}
            disabled={success}
            required
          />

          <InputField
            label="Confirmar password"
            type="password"
            placeholder="Confirme a nova password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<i className="bi bi-lock"></i>}
            disabled={success}
            required
          />

          <Button
            label={loading ? "A guardar..." : "Redefinir"}
            variant="primary"
            type="submit"
            disabled={loading || success}
          />

          <p className="text-xs text-center">
            <Link to="/" className="link">Ir para login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

