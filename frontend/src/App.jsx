import { Navigate, Route, Routes } from "react-router-dom";
import CandidateLogin from "./pages/login/CandidateLogin/Login.jsx";
import AdminLogin from "./pages/login/AdminLogin/AdminLogin.jsx";
import Credenciais from "./pages/admin/SuperAdmin/Credenciais.jsx";
import GestaoTrabalho from "./pages/admin/SuperAdmin/GestaoTrabalho.jsx";
import GestaoSite from "./pages/admin/SuperAdmin/GestaoSite.jsx";
import Metricas from "./pages/admin/SuperAdmin/Metricas.jsx";
import SuperAdminLayout from "./components/layout/SuperAdminLayout.jsx";
import RegisterStep1 from "./pages/register/RegisterStep1.jsx";
import RegisterStep2 from "./pages/register/RegisterStep2.jsx";
import RegisterStep3 from "./pages/register/RegisterStep3.jsx";
import RegisterStep4 from "./pages/register/RegisterStep4.jsx";
import RegisterLayout from "./components/layout/RegisterLayout.jsx";
import CandidateLogin from "./pages/login-pages/CommunLogin/Login.jsx";
import AdminLogin from "./pages/login-pages/AdminLogin/AdminLogin.jsx";
import ForgotPassword from "./pages/login-pages/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./pages/login-pages/ResetPassword/ResetPassword.jsx";
import Credenciais from "./pages/SuperAdmin-pages/Credenciais.jsx";
import GestaoTrabalho from "./pages/SuperAdmin-pages/GestaoTrabalho.jsx";
import GestaoSite from "./pages/SuperAdmin-pages/GestaoSite.jsx";
import Metricas from "./pages/SuperAdmin-pages/Metricas.jsx";
import SuperAdminLayout from "./components/layout/SuperAdminLayout.jsx";
import CandidateLayout, { CandidateIndexRedirect } from "./components/layout/CandidateLayout.jsx";
import DadosPessoais from "./pages/candidate/DadosPessoais.jsx";
import Formacao from "./pages/candidate/Formacao.jsx";
import UltimosTrabalhos from "./pages/candidate/UltimosTrabalhos.jsx";
import Preferencias from "./pages/candidate/Preferencias.jsx";
import AlertasEmprego from "./pages/candidate/alertas/AlertasEmprego.jsx";
import Documentos from "./pages/candidate/documentos/Documentos.jsx";
import ProximosPassos from "./pages/candidate/proximos/ProximosPassos.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CandidateLogin />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/register" element={<RegisterLayout />}>
        <Route index element={<Navigate to="step1" replace />} />
        <Route path="step1" element={<RegisterStep1 />} />
        <Route path="step2" element={<RegisterStep2 />} />
        <Route path="step3" element={<RegisterStep3 />} />
        <Route path="step4" element={<RegisterStep4 />} />
      </Route>
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Candidato */}
      <Route path="/candidato" element={<CandidateLayout />}>
        <Route index element={<CandidateIndexRedirect />} />
        <Route path="dados-pessoais" element={<DadosPessoais />} />
        <Route path="formacao" element={<Formacao />} />
        <Route path="ultimos-trabalhos" element={<UltimosTrabalhos />} />
        <Route path="preferencias" element={<Preferencias />} />
        {/* Secções fora do Perfil */}
        <Route path="alertas" element={<AlertasEmprego />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="proximos-passos" element={<ProximosPassos />} />
      </Route>

    
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
