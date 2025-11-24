import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/candidato/dados-pessoais", label: "Dados Pessoais" },
  { to: "/candidato/formacao", label: "Formação" },
  { to: "/candidato/ultimos-trabalhos", label: "Últimos Trabalhos" },
  { to: "/candidato/preferencias", label: "Preferências" },
];

export default function ProfileTabs() {
  return (
    <div className="mt-6 flex items-center justify-center gap-6 border-b border-base-300 text-sm md:text-base overflow-hidden">
      {TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => {
            const base = "relative flex flex-col items-center pb-2 -mb-px transition-colors duration-300";
            const state = isActive
              ? "text-base-content font-semibold"
              : "text-base-content/70 hover:text-base-content";
            return `${base} ${state}`;
          }}
        >
          {({ isActive }) => (
            <>
              <span className="relative z-10">{label}</span>
              <span
                aria-hidden="true"
                className={`mt-1 block h-0.5 bg-base-content transition-all duration-300 ease-in-out ${
                  isActive ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

