import { Outlet } from "react-router-dom";
import SuperAdminNavbar from "./SuperAdminNavbar.jsx";
import { SuperAdminDataProvider } from "./SuperAdminDataContext.jsx";

export default function SuperAdminLayout() {
  return (
    <SuperAdminDataProvider>
      <div className="min-h-screen bg-base-200">
        <SuperAdminNavbar />
        <main className="px-6 pb-16 pt-10">
          <div className="mx-auto w-full max-w-6xl px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SuperAdminDataProvider>
  );
}
