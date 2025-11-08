import { Outlet, Navigate } from "react-router-dom";
import CandidateNavbar from "./CandidateNavbar.jsx";
import CandidateSidebar from "./CandidateSidebar.jsx";

export default function CandidateLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <CandidateNavbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex gap-6">
        <CandidateSidebar />
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

