import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/candidato/dados-pessoais", label: "Dados Pessoais" },
  { to: "/candidato/formacao", label: "Formação" },
  { to: "/candidato/ultimos-trabalhos", label: "Últimos Trabalhos" },
  { to: "/candidato/preferencias", label: "Preferências" },
];

export default function ProfileTabs() {
  return (
    <div className="mt-6 flex items-center gap-6 border-b border-base-300 text-sm md:text-base">
      {TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              "pb-2 -mb-px",
              isActive
                ? "border-b-2 border-base-content font-semibold"
                : "text-base-content/70 hover:text-base-content",
            ].join(" ")
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}

