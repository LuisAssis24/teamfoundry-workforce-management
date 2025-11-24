import { useNavigate } from "react-router-dom";
import SuperAdminNavbar from "../SuperAdmin/SuperAdminNavbar.jsx";
import EmployeeCard from "./EmployeeCard.jsx";

const GEO_OPTIONS = ["Opcao 1", "Opcao 2"];
const SKILL_OPTIONS = ["Opcao 1", "Opcao 2"];
const OFFER_FILTER = "Ofertas Ativas: 5 ou Menos";

const EMPLOYEES = [
  { id: 1, name: "Ceblerson", role: "Tubista", city: "Aveiro", preference: "Portugal" },
  { id: 2, name: "Anabela Duarte", role: "Soldador", city: "Lisboa", preference: "Portugal" },
  { id: 3, name: "Luiz Miguel", role: "Tornerio", city: "Porto", preference: "Espanha" },
  { id: 4, name: "Sara Valente", role: "Tubista", city: "Coimbra", preference: "Portugal" },
];

export default function BuildTeamSearch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200">
      <SuperAdminNavbar />
      <main className="flex justify-center px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl space-y-6 rounded-2xl bg-[#F5F5F5] p-6 text-[#1F2959] shadow overflow-hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F2959] transition hover:text-[#0f1635]"
            onClick={() => navigate("/admin/team-management")}
          >
            <span aria-hidden="true">&larr;</span>
            Voltar
          </button>
          <HeroHeader />
          <div className="flex flex-col gap-6 lg:flex-row">
            <FiltersPanel />
            <CandidatesPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroHeader() {
  return <header className="h-2" />;
}

function FiltersPanel() {
  return (
    <aside className="w-full rounded-2xl bg-white p-6 shadow-md lg:w-80">
      <div className="space-y-4">
        <FilterTitle label="Empresa" value="Cleber Lda" />
        <FilterTitle label="Funcao" value="Tubista" />
      </div>

      <div className="mt-6 space-y-6">
        <FilterSection title="Area(s) Geografica(s)" chips={GEO_OPTIONS} />
        <FilterSection title="Competencias" chips={SKILL_OPTIONS} />

        <div className="space-y-2">
          <p className="px-2 text-sm font-semibold text-[#111827]">Ofertas</p>
          <div className="flex items-center justify-between rounded-xl border border-[#111827] bg-[#F0F0F0] px-4 py-3">
            <span className="text-sm font-medium text-[#09101D]">{OFFER_FILTER}</span>
            <IconBar />
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterTitle({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F0F0F0] px-4 py-2">
      <p className="text-lg font-semibold">
        {label}: <span className="text-[#111827]">{value}</span>
      </p>
    </div>
  );
}

function FilterSection({ title, chips }) {
  return (
    <div className="space-y-2">
      <p className="px-2 text-sm font-semibold text-[#111827]">{title}</p>
      <div className="rounded-xl border border-[#111827] bg-[#F0F0F0] p-3">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-2 rounded-xl bg-[#60678E] px-3 py-2 text-sm text-white"
            >
              {chip}
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-xs text-white">
                v
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconBar() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#60678E]" aria-hidden="true">
      <span className="block h-1 w-3 bg-white" />
    </div>
  );
}

function CandidatesPanel() {
  return (
    <section className="flex-1 rounded-2xl border border-[#111827]/20 bg-white p-4 shadow-inner">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {EMPLOYEES.map((employee) => (
          <EmployeeCard key={employee.id} {...employee} />
        ))}
      </div>
    </section>
  );
}
