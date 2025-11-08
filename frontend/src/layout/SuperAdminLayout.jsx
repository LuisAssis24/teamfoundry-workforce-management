import { Outlet } from "react-router-dom";
import SuperAdminNavbar from "./SuperAdminNavbar";

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <SuperAdminNavbar />
      <main className="flex justify-center px-6 pb-16 pt-10">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
