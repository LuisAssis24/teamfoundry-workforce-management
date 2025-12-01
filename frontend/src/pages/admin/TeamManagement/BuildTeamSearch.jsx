import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar.jsx";
import EmployeeCard from "./components/EmployeeCard.jsx";
import MultiSelectDropdown from "../../../components/ui/MultiSelect/MultiSelectDropdown.jsx";

const GEO_OPTIONS = ["Opcao 1", "Opcao 2"];
const SKILL_OPTIONS = ["Opcao 1", "Opcao 2"];

const EMPLOYEES = [
  { id: 1, name: "Ceblerson", role: "Tubista", city: "Aveiro", preference: "Portugal" },
  { id: 2, name: "Anabela Duarte", role: "Soldador", city: "Lisboa", preference: "Portugal" },
  { id: 3, name: "Luiz Miguel", role: "Tornerio", city: "Porto", preference: "Espanha" },
  { id: 4, name: "Sara Valente", role: "Tubista", city: "Coimbra", preference: "Portugal" },
];

export default function BuildTeamSearch() {
  const navigate = useNavigate();
  const [geoSelected, setGeoSelected] = useState([]);
  const [skillsSelected, setSkillsSelected] = useState([]);

  return (
    <div className="min-h-screen bg-base-200">
      <AdminNavbar />
      <main className="flex justify-center px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl space-y-6 rounded-2xl bg-[#F5F5F5] p-6 text-[#1F2959] shadow overflow-hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F2959] transition hover:text-[#0f1635]"
            onClick={() => navigate("/admin/team-management/requests")}
          >
            <span aria-hidden="true">&larr;</span>
            Voltar
          </button>
          <HeroHeader />
          <div className="flex flex-col gap-6 lg:flex-row">
            <FiltersPanel
              geoSelected={geoSelected}
              skillsSelected={skillsSelected}
              onGeoChange={setGeoSelected}
              onSkillsChange={setSkillsSelected}
            />
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

function FiltersPanel({ geoSelected, skillsSelected, onGeoChange, onSkillsChange }) {
  return (
    <aside className="w-full rounded-2xl bg-white p-6 shadow-md lg:w-80">
      <div className="space-y-4">
        <FilterTitle label="Empresa" value="Cleber Lda" />
        <FilterTitle label="Funcao" value="Tubista" />
      </div>

      <div className="mt-6 space-y-6">
        <MultiSelectDropdown
          label="Area(s) Geografica(s)"
          options={GEO_OPTIONS}
          selectedOptions={geoSelected}
          onChange={onGeoChange}
          placeholder="Selecione area(s)"
        />
        <MultiSelectDropdown
          label="Competencias"
          options={SKILL_OPTIONS}
          selectedOptions={skillsSelected}
          onChange={onSkillsChange}
          placeholder="Selecione competencias"
        />
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
