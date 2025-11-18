import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import Button from "../ui/Button/Button";
import logo from "../../assets/images/logo/teamFoundry_LogoWhite.png";

const NAV_LINKS = [
  { to: "#industrias", label: "As Indústrias" },
  { to: "#parceiros", label: "Os Parceiros" },
  { to: "#sobre", label: "Sobre nós" },
];

const PUBLIC_ACTIONS = [{ to: "/login", label: "Entrar", variant: "secondary" }];

export default function Navbar({
  variant = "private",
  homePath = "/candidato",
  links = NAV_LINKS,
  actions = PUBLIC_ACTIONS,
  onLogout,
}) {
  const isPublic = variant === "public";
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

  const wrapperClasses = isPublic
    ? "bg-primary text-primary-content sticky top-0 z-30"
    : "bg-primary text-primary-content";

  const actionButtons = isPublic
    ? (actions?.length ? actions : PUBLIC_ACTIONS)
    : [];

  const navItems = Array.isArray(links) ? links : NAV_LINKS;

  return (
    <header className={wrapperClasses}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-6">
        <Link to={homePath} className="flex items-center gap-3 shrink-0 group">
          <img
            src={logo}
            alt="TeamFoundry"
            className={`object-contain ${isPublic ? "h-12 w-12" : "h-10 w-10"}`}
          />
          <span className={`font-semibold tracking-wide ${isPublic ? "text-primary" : "text-primary-content"}`}>
            TeamFoundry
          </span>
        </Link>

        {(!isPublic && navItems.length > 0) && (
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center gap-8 font-medium text-sm uppercase tracking-wide">
              {navItems.map(({ to, label, internal }) => (
                <li key={label}>
                  {internal ? (
                    <Link
                      to={to}
                      className="hover:opacity-90 transition"
                      aria-label={label}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a href={to} className="hover:opacity-90 transition" aria-label={label}>
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {isPublic ? (
          <div className="flex items-center gap-3">
            {actionButtons.map(({ to, label, variant }) => (
              <Button
                key={label}
                as={Link}
                to={to}
                label={label}
                variant={variant}
                className={`w-auto btn-sm ${
                  variant === "primary"
                    ? "btn-outline border-white/80 text-white hover:bg-white/10"
                    : ""
                }`}
              />
            ))}
          </div>
        ) : (
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
                  onClick={onLogout}
                >
                  Fazer logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

Navbar.propTypes = {
  variant: PropTypes.oneOf(["private", "public"]),
  homePath: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      internal: PropTypes.bool,
    })
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      variant: PropTypes.oneOf([
        "primary",
        "secondary",
        "accent",
        "neutral",
        "outline",
        "ghost",
        "warning",
        "success",
      ]),
    })
  ),
  onLogout: PropTypes.func,
};
