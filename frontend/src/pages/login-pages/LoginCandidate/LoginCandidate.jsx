import React from "react";
import InputField from "../../../components/ui/Input/InputField.jsx";
import Button from "../../../components/ui/Button/Button.jsx";

export default function LoginCandidate() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md shadow-md bg-base-100">
                <div className="card-body space-y-6">
                    <h2 className="text-center text-2xl font-bold text-primary mb-4">
                        Login
                    </h2>

                    <InputField
                        label="Email"
                        placeholder="Insira o seu email"
                        icon={<i className="bi bi-envelope"></i>}
                        type="email"
                    />

                    <InputField
                        label="Password"
                        placeholder="Insira a sua password"
                        icon={<i className="bi bi-lock"></i>}
                        type="password"
                    />

                    <Button label="Entrar" variant="primary" />

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
