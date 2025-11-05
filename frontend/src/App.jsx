import { Navigate, Route, Routes } from "react-router-dom";
import CandidateLogin from "./pages/login-pages/CandidateLogin/Login.jsx";
import AdminLogin from "./pages/login-pages/AdminLogin/AdminLogin.jsx";
import Credenciais from "./pages/SuperAdmin/Credenciais.jsx";
import GestaoTrabalho from "./pages/SuperAdmin/GestaoTrabalho.jsx";
import GestaoSite from "./pages/SuperAdmin/GestaoSite.jsx";
import Metricas from "./pages/SuperAdmin/Metricas.jsx";
import SuperAdminLayout from "./components/layout/SuperAdminLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CandidateLogin />} />
      <Route path="/admin" element={<AdminLogin />} />
      
    
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
