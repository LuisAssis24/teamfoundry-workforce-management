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

                    <Button label={loading ? "Entrando..." : "Entrar"} variant="primary" onClick={handleLogin}/>

                    <div className="divider">Ou</div>

                    {/* Email */}
                    <button className="btn bg-white text-black border-[#e5e5e5]">
                        <svg aria-label="Email icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="black">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </g>
                        </svg>
                        Login with Email
                    </button>

                    {/* LinkedIn*/}
                    <button className="btn bg-[#0967C2] text-white border-[#0059b3]">
                        <svg aria-label="LinkedIn logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="white" d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fillRule="evenodd"></path></svg>
                        Login with LinkedIn
                    </button>

                </div>
            </div>
        </main>
    );
}
