import React, { useState } from "react";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import { login } from "../../../api/auth.js";

export default function LoginCandidate() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const data = await login(email, password);
            console.log("Login OK:", data);
            setSuccess(true);
            // redirecionar aqui se houver roteamento (ex.: react-router)
        } catch (e) {
            setError(e.message || "Falha no login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md shadow-md bg-base-100">
                <div className="card-body space-y-6">
                    <h2 className="text-center text-2xl font-bold text-primary mb-4">
                        Login
                    </h2>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">Login efetuado com sucesso!</div>}

                    <InputField
                        label="Email"
                        placeholder="Insira o seu email"
                        icon={<i className="bi bi-envelope"></i>}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputField
                        label="Password"
                        placeholder="Insira a sua password"
                        icon={<i className="bi bi-lock"></i>}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button label={loading ? "Entrando..." : "Entrar"} variant="primary" onClick={handleLogin} />

                    <div className="divider">Ou</div>

                    <Button
                        label="Entrar com o Google"
                        className="bg-[#1a73e8] hover:bg-[#1669c1] text-white border-none flex items-center justify-center gap-2"
                        icon={<i className="bi bi-google"></i>}
                    />

                    <Button
                        label="Entrar com o LinkedIn"
                        className="bg-[#0a66c2] hover:bg-[#004182] text-white border-none flex items-center justify-center gap-2"
                        icon={<i className="bi bi-linkedin"></i>}
                    />

                </div>
            </div>
        </main>
    );
}
