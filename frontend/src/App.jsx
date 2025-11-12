import { Navigate, Route, Routes } from "react-router-dom";

import CandidateLogin from "./pages/login/UserLogin/UserLogin.jsx";
import AdminLogin from "./pages/login/AdminLogin/AdminLogin.jsx";
import ForgotPassword from "./pages/login/UserLogin/components/ForgotPassword.jsx";
import ResetPassword from "./pages/login/UserLogin/ResetPassword.jsx";

import EmployeeRegisterLayout from "./pages/register/EmployeeRegister/EmployeeRegisterLayout.jsx";
import EmployeeRegisterStep1 from "./pages/register/EmployeeRegister/EmployeeRegisterStep1.jsx";
import EmployeeRegisterStep2 from "./pages/register/EmployeeRegister/EmployeeRegisterStep2.jsx";
import EmployeeRegisterStep3 from "./pages/register/EmployeeRegister/EmployeeRegisterStep3.jsx";
import EmployeeRegisterStep4 from "./pages/register/EmployeeRegister/EmployeeRegisterStep4.jsx";
import CompanyRegisterLayout from "./pages/register/CompanyRegister/CompanyRegisterLayout.jsx";
import CompanyRegisterStep1 from "./pages/register/CompanyRegister/CompanyRegisterStep1.jsx";
import CompanyRegisterStep2 from "./pages/register/CompanyRegister/CompanyRegisterStep2.jsx";
import CompanyRegisterStep3 from "./pages/register/CompanyRegister/CompanyRegisterStep3.jsx";

import EmployeeLayout, {
  CandidateIndexRedirect,
} from "./pages/profile/Employee/EmployeeLayout.jsx";
import PersonalDetails from "./pages/profile/Employee/Info/PersonalDetails.jsx";
import Education from "./pages/profile/Employee/Info/Education.jsx";
import RecentJobs from "./pages/profile/Employee/Info/RecentJobs.jsx";
import Preferences from "./pages/profile/Employee/Info/Preferences.jsx";
import AlertasEmprego from "./pages/profile/Employee/JobAlerts/AlertasEmprego.jsx";
import Documentos from "./pages/profile/Employee/Documents/Documentos.jsx";
import ProximosPassos from "./pages/profile/Employee/NextSteps/ProximosPassos.jsx";

import SuperAdminLayout from "./pages/admin/SuperAdmin/SuperAdminLayout.jsx";
import Credenciais from "./pages/admin/SuperAdmin/Credentials/Credenciais.jsx";
import Staffing from "./pages/admin/SuperAdmin/Staffing/Staffing.jsx";
import VariableManagement from "./pages/admin/SuperAdmin/VariableManagement/VariableManagement.jsx";
import Metrics from "./pages/admin/SuperAdmin/Metrics/Metrics.jsx";
import { HomeNoLogin } from "./pages/home/HomeNoLogin/HomeNoLogin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeNoLogin />} />

      <Route path="/login" element={<CandidateLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/employee-register" element={<EmployeeRegisterLayout />}>
        <Route index element={<Navigate to="step1" replace />} />
        <Route path="step1" element={<EmployeeRegisterStep1 />} />
        <Route path="step2" element={<EmployeeRegisterStep2 />} />
        <Route path="step3" element={<EmployeeRegisterStep3 />} />
        <Route path="step4" element={<EmployeeRegisterStep4 />} />
      </Route>

      <Route path="/company-register" element={<CompanyRegisterLayout />}>
        <Route index element={<Navigate to="step1" replace />} />
        <Route path="step1" element={<CompanyRegisterStep1 />} />
        <Route path="step2" element={<CompanyRegisterStep2 />} />
        <Route path="step3" element={<CompanyRegisterStep3 />} />
      </Route>

      <Route path="/admin" element={<AdminLogin />} />

      <Route path="/admin/super" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="credenciais" replace />} />
        <Route path="credenciais" element={<Credenciais />} />
        <Route path="gestao-trabalho" element={<Staffing />} />
        <Route path="gestao-site" element={<VariableManagement />} />
        <Route path="metricas" element={<Metrics />} />
      </Route>

      <Route path="/candidato" element={<EmployeeLayout />}>
        <Route index element={<CandidateIndexRedirect />} />
        <Route path="dados-pessoais" element={<PersonalDetails />} />
        <Route path="formacao" element={<Education />} />
        <Route path="ultimos-trabalhos" element={<RecentJobs />} />
        <Route path="preferencias" element={<Preferences />} />
        <Route path="alertas" element={<AlertasEmprego />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="proximos-passos" element={<ProximosPassos />} />
      </Route>
    </Routes>
  );
}

export default App;
