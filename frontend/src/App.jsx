import { Navigate, Route, Routes } from "react-router-dom";

// Home
import HomeLayout from "./pages/home/HomeLayout.jsx";
import WeeklyTipsPage from "./pages/home/WeeklyTipsPage.jsx";

// Auth
import CandidateLogin from "./pages/login/UserLogin/UserLogin.jsx";
import AdminLogin from "./pages/login/AdminLogin/AdminLogin.jsx";

// Register - Employee
import EmployeeRegisterLayout from "./pages/register/EmployeeRegister/EmployeeRegisterLayout.jsx";
import EmployeeRegisterStep1 from "./pages/register/EmployeeRegister/EmployeeRegisterStep1.jsx";
import EmployeeRegisterStep2 from "./pages/register/EmployeeRegister/EmployeeRegisterStep2.jsx";
import EmployeeRegisterStep3 from "./pages/register/EmployeeRegister/EmployeeRegisterStep3.jsx";
import EmployeeRegisterStep4 from "./pages/register/EmployeeRegister/EmployeeRegisterStep4.jsx";

// Register - Company
import CompanyRegisterLayout from "./pages/register/CompanyRegister/CompanyRegisterLayout.jsx";
import CompanyRegisterStep1 from "./pages/register/CompanyRegister/CompanyRegisterStep1.jsx";
import CompanyRegisterStep2 from "./pages/register/CompanyRegister/CompanyRegisterStep2.jsx";
import CompanyRegisterStep3 from "./pages/register/CompanyRegister/CompanyRegisterStep3.jsx";

// Profile - Employee
import EmployeeLayout, { CandidateIndexRedirect } from "./pages/profile/Employee/EmployeeLayout.jsx";
import PersonalDetails from "./pages/profile/Employee/Info/PersonalDetails.jsx";
import Certificates from "./pages/profile/Employee/Info/Certificates.jsx";
import RecentJobs from "./pages/profile/Employee/Info/RecentJobs.jsx";
import Preferences from "./pages/profile/Employee/Info/Preferences.jsx";
import JobOffers from "./pages/profile/Employee/JobOffers/JobOffers.jsx";
import Documentos from "./pages/profile/Employee/Documents/Documentos.jsx";
import ProximosPassos from "./pages/profile/Employee/NextSteps/ProximosPassos.jsx";

// Profile - Company
import CompanyLayout, { CompanyIndexRedirect } from "./pages/profile/company/CompanyLayout.jsx";
import CompanyInfo from "./pages/profile/company/CompanyInfo.jsx";
import CompanyRequests from "./pages/profile/company/CompanyRequests.jsx";

// Admin / SuperAdmin
import SuperAdminLayout from "./pages/admin/SuperAdmin/SuperAdminLayout.jsx";
import Credentials from "./pages/admin/SuperAdmin/Credentials/Credentials.jsx";
import Staffing from "./pages/admin/SuperAdmin/Staffing/Staffing.jsx";
import VariableManagement from "./pages/admin/SuperAdmin/VariableManagement/VariableManagement.jsx";
import Metrics from "./pages/admin/SuperAdmin/Metrics/Metrics.jsx";
import TeamManagement from "./pages/admin/TeamManagement/TeamManagement.jsx";
import BuildTeamSearch from "./pages/admin/TeamManagement/BuildTeamSearch.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/dicas" element={<WeeklyTipsPage />} />
      <Route path="/login" element={<CandidateLogin />} />
      <Route
        path="/forgot-password"
        element={<Navigate to="/login" state={{ openForgotModal: true }} replace />}
      />

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
      <Route path="/admin/team-management" element={<TeamManagement />} />
      <Route path="/admin/team-management/build" element={<BuildTeamSearch />} />

      <Route path="/admin/super" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="credenciais" replace />} />
        <Route path="credenciais" element={<Credentials />} />
        <Route path="gestao-trabalho" element={<Staffing />} />
        <Route path="gestao-site" element={<VariableManagement />} />
        <Route path="metricas" element={<Metrics />} />
      </Route>

      <Route path="/candidato" element={<EmployeeLayout />}>
        <Route index element={<CandidateIndexRedirect />} />
        <Route path="dados-pessoais" element={<PersonalDetails />} />
        <Route path="certificacoes" element={<Certificates />} />
        <Route path="ultimos-trabalhos" element={<RecentJobs />} />
        <Route path="preferencias" element={<Preferences />} />
        <Route path="ofertas" element={<JobOffers />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="proximos-passos" element={<ProximosPassos />} />
      </Route>

      <Route path="/empresa" element={<CompanyLayout />}>
        <Route index element={<CompanyIndexRedirect />} />
        <Route path="informacoes" element={<CompanyInfo />} />
        <Route path="requisicoes" element={<CompanyRequests />} />
      </Route>
    </Routes>
  );
}

export default App;
