import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo/teamFoundry_LogoWhite.png";

const NAV_LINKS = [
  { to: "#industrias", label: "As Indústrias" },
  { to: "#parceiros", label: "Os Parceiros" },
  { to: "#sobre", label: "Sobre nós" },
];

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isProfileOpen]);

  return (
    <header className="bg-primary text-primary-content">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <Link to="/candidato" className="flex items-center gap-3 shrink-0 group">
          <img src={logo} alt="TeamFoundry" className="h-10 w-10 object-contain" />
        </Link>

        <nav className="flex-1 flex justify-center">
          <ul className="flex items-center gap-8 font-medium">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={label}>
                <a href={to} className="hover:opacity-90">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="btn btn-ghost btn-circle h-12 w-12 text-3xl text-primary-content"
            onClick={() => setIsProfileOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            <i className="bi bi-person-circle" aria-hidden="true" />
            <span className="sr-only">Abrir menu do perfil</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-base-300 bg-base-100 text-base-content shadow-lg z-50">
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm font-semibold text-error hover:bg-error/10 transition-colors duration-150"
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

