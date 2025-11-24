import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import logo from "../../../assets/images/logo/teamFoundry_LogoWhite.png";

const PROFILE_INFO_ROUTES = [
  "/candidato/dados-pessoais",
  "/candidato/formacao",
  "/candidato/ultimos-trabalhos",
  "/candidato/preferencias",
];

const SIDEBAR_LINKS = [
  {
    to: "/candidato/dados-pessoais",
    label: "Perfil",
    icon: "bi-person",
    matches: PROFILE_INFO_ROUTES,
  },
  { to: "/candidato/ofertas", label: "Ofertas", icon: "bi-bell" },
  { to: "/candidato/documentos", label: "Documentos", icon: "bi-file-earmark-text" },
  { to: "/candidato/proximos-passos", label: "Próximos passos", icon: "bi-flag" },
];

export default function EmployeeSidebar({ isMobile = false, onNavigate, animateOut = false }) {
  const location = useLocation();
  const itemRefs = useRef([]);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const activeIndex = SIDEBAR_LINKS.findIndex(({ to, matches }) => {
      const isProfileSection =
        matches?.some((path) => location.pathname.startsWith(path)) ?? false;
      return location.pathname.startsWith(to) || isProfileSection;
    });
    const el = itemRefs.current[activeIndex];
    if (el) {
      setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    }
  }, [location.pathname]);

  const navWrapperClasses = isMobile ? "w-72 max-w-xs h-full" : "hidden md:block w-64 px-4";
  const navClasses = isMobile
    ? "bg-accent text-primary-content h-full flex flex-col rounded-r-2xl shadow-xl"
    : "bg-accent text-primary-content rounded-lg shadow-lg sticky top-6 px-0 py-6 h-screen";

  return (
    <aside className={`${navWrapperClasses} ${isMobile ? (animateOut ? "animate-drawer-out" : "animate-drawer-in") : ""}`}>
      <div className={navClasses}>
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary-content/20">
            <div className="flex items-center gap-2">
              <img src={logo} alt="TeamFoundry" className="h-8 w-8 object-contain" />
              <span className="font-semibold tracking-wide">TeamFoundry</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-primary-content"
              onClick={onNavigate}
            >
              <i className="bi bi-x-lg text-lg" aria-hidden="true" />
              <span className="sr-only">Fechar menu</span>
            </button>
          </div>
        )}

        <ul className="relative flex flex-col gap-4 py-4 pl-3">
          {indicator.height > 0 && (
            <span
              className="absolute left-1 w-1 rounded-full bg-primary-content/80 transition-all duration-300 ease-out"
              style={{ top: indicator.top + 4, height: indicator.height - 8 }}
              aria-hidden="true"
            />
          )}
          {SIDEBAR_LINKS.map(({ to, label, icon, matches }) => (
            <li key={to} className="pr-2">
              <NavLink
                to={to}
                className={({ isActive }) => {
                  const isProfileSection =
                    matches?.some((path) => location.pathname.startsWith(path)) ?? false;
                  const active = isActive || isProfileSection;
                  const base = "flex items-center gap-3 px-6 py-3 rounded-lg transition-all";
                  const state = active
                    ? "bg-primary-content/15 font-semibold shadow-sm"
                    : "hover:bg-primary-content/10";
                  return `${base} ${state}`;
                }}
                onClick={onNavigate}
                ref={(el) => {
                  if (el) {
                    const idx = SIDEBAR_LINKS.findIndex((link) => link.to === to);
                    itemRefs.current[idx] = el;
                  }
                }}
              >
                <i className={`bi ${icon} text-xl`} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

EmployeeSidebar.propTypes = {
  isMobile: PropTypes.bool,
  onNavigate: PropTypes.func,
  animateOut: PropTypes.bool,
};
