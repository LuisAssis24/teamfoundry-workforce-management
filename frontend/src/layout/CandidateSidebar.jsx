import { NavLink } from "react-router-dom";

const SIDEBAR_LINKS = [
  { to: "/candidato/dados-pessoais", label: "Perfil", icon: "bi-person" },
  { to: "/candidato/alertas", label: "Alerta de Emprego", icon: "bi-bell" },
  { to: "/candidato/documentos", label: "Documentos", icon: "bi-file-earmark-text" },
  { to: "/candidato/proximos-passos", label: "Próximos passos", icon: "bi-flag" },
];

export default function CandidateSidebar() {
  return (
    <aside className="hidden md:block w-64 px-4">
      <div className="bg-primary text-primary-content rounded-xl shadow-lg sticky top-6 px-0 py-6 min-h-[calc(90vh-6rem)]">
        <ul className="flex flex-col gap-2">
          {SIDEBAR_LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-6 py-3 transition-colors",
                    isActive
                      ? "bg-primary-content/10 font-semibold"
                      : "hover:bg-primary-content/10",
                  ].join(" ")
                }
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
