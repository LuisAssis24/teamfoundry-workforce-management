import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo/teamFoundry_LogoPrimary.png";

const NAV_LINKS = [
  { to: "/super-admin/credenciais", label: "Credenciais" },
  { to: "/super-admin/gestao-trabalho", label: "Gestao de trabalho" },
  { to: "/super-admin/gestao-site", label: "Gestao do Site" },
  { to: "/super-admin/metricas", label: "Metrics" },
];

export default function SuperAdminNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [underline, setUnderline] = useState({ width: 0, left: 0 });
  const location = useLocation();
  const profileRef = useRef(null);
  const navListRef = useRef(null);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!navListRef.current) return;
    const activeLink = navListRef.current.querySelector('a[aria-current="page"]');
    if (!activeLink) return;

    const linkRect = activeLink.getBoundingClientRect();
    const listRect = navListRef.current.getBoundingClientRect();
    setUnderline({
      width: linkRect.width,
      left: linkRect.left - listRect.left,
    });
  }, [location.pathname]);

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
        <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-12 items-center gap-6">
          <Link
              to="/super-admin/credenciais"
              className="col-span-12 md:col-span-2 flex items-center gap-3 shrink-0 group"
          >
            <div className="h-12 w-12 flex items-center justify-center">
              <img
                  src={logo}
                  alt="TeamFoundry"
                  className="h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="text-xl font-semibold text-primary">TeamFoundry</span>
          </Link>

          <nav className="col-span-12 md:col-span-8 flex justify-center">
            <ul
                ref={navListRef}
                className="relative flex flex-wrap items-center gap-6 text-sm md:text-base font-medium"
            >
              {NAV_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                        to={to}
                        className={({ isActive }) =>
                            [
                              "relative px-1 pb-2 transition-colors duration-200",
                              isActive
                                  ? "text-primary font-semibold"
                                  : "text-base-content/70 hover:text-primary",
                            ].join(" ")
                        }
                    >
                      {label}
                    </NavLink>
                  </li>
              ))}

              <span
                  className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-[width,transform] duration-300 ease-out will-change-transform will-change-width"
                  style={{
                    width: `${underline.width}px`,
                    transform: `translateX(${underline.left}px)`,
                    opacity: underline.width ? 1 : 0,
                  }}
              />
            </ul>
          </nav>

          <div
              className="col-span-12 md:col-span-2 relative flex justify-start md:justify-end"
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
