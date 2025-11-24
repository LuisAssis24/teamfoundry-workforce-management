import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { EmployeeProfileProvider } from "./pages/profile/Employee/EmployeeProfileContext.jsx";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa icones do Bootstrap
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <EmployeeProfileProvider>
                    <App />
                </EmployeeProfileProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
