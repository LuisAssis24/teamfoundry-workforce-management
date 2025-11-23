import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../../../components/sections/Navbar.jsx";
import EmployeeSidebar from "./EmployeeSidebar.jsx";

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />

      <div className="max-w-6xl mx-auto px-1 md:px-2 py-6 flex gap-6">
        <EmployeeSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Fallback element if used as index route
export function CandidateIndexRedirect() {
  return <Navigate to="dados-pessoais" replace />;
}

