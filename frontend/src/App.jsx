import { Routes, Route } from "react-router-dom";
import CandidateLogin from "./pages/login-pages/CandidateLogin/CandidateLogin.jsx";
import AdminLogin from "./pages/login-pages/AdminLogin/AdminLogin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CandidateLogin />} />
      <Route path="/admin" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
