import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import { forgotPassword } from "../../../api/auth.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    <main className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <form className="card-body space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-center text-2xl font-bold text-primary">Recuperar Password</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Se o email existir, enviaremos instruções para recuperar a password.
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

          <Button
            label={loading ? "A enviar..." : "Enviar link"}
            variant="primary"
            type="submit"
            disabled={loading || !email.trim()}
          />

          <p className="text-xs text-center">
            <Link to="/" className="link">Voltar ao login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

