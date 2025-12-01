import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearTokens } from "../../../auth/tokenStorage.js";
import logo from "../../../assets/images/logo/teamFoundry_LogoPrimary.png";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    clearTokens();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isProfileOpen]);

  return (
    <header className="bg-base-100 border-b border-base-200 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/admin/team-management" className="flex items-center gap-3">
          <div className="h-10 w-10">
            <img src={logo} alt="TeamFoundry" className="h-10 w-10 object-contain" />
          </div>
          <span className="text-lg font-semibold text-[#1F2959]">TeamFoundry</span>
        </Link>

        <div
          className="relative flex justify-end"
          ref={profileRef}
        >
          <button
            type="button"
            className="btn btn-ghost btn-circle h-12 w-12 text-3xl"
            onClick={() => setIsProfileOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            <i className="bi bi-person-circle" aria-hidden="true" />
            <span className="sr-only">Abrir menu do perfil</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-base-300 bg-base-100 shadow-lg z-50">
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm font-semibold text-error hover:bg-error/10 transition-colors duration-150"
                onClick={handleLogout}
              >
                Fazer logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
