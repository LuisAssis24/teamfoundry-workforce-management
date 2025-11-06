import { Navigate, Route, Routes } from "react-router-dom";
import CandidateLogin from "./pages/login-pages/CommunLogin/Login.jsx";
import AdminLogin from "./pages/login-pages/AdminLogin/AdminLogin.jsx";
import ForgotPassword from "./pages/login-pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/login-pages/ResetPassword/ResetPassword.jsx";
import Credenciais from "./pages/SuperAdmin-pages/Credenciais.jsx";
import GestaoTrabalho from "./pages/SuperAdmin-pages/GestaoTrabalho.jsx";
import GestaoSite from "./pages/SuperAdmin-pages/GestaoSite.jsx";
import Metricas from "./pages/SuperAdmin-pages/Metricas.jsx";
import SuperAdminLayout from "./components/layout/SuperAdminLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CandidateLogin />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

    
      <Route path="/credenciais" element={<Navigate to="/super-admin/credenciais" replace />} />

      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="credenciais" replace />} />
        <Route path="credenciais" element={<Credenciais />} />
        <Route path="gestao-trabalho" element={<GestaoTrabalho />} />
        <Route path="gestao-site" element={<GestaoSite />} />
        <Route path="metricas" element={<Metricas />} />
      </Route>
    </Routes>
  );
}

export default App;
