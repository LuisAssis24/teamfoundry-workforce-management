import TeamManagementCard from "./TeamManagementCard.jsx";
import SuperAdminNavbar from "../SuperAdmin/SuperAdminNavbar.jsx";

const FILTERS = [
  { id: "status", label: "Status", value: "Por fazer" },
  { id: "date", label: "Data", value: "Ascendente" },
  { id: "workforce", label: "MdO", value: "Ascendente" },
];

const TEAM_REQUESTS = [
  {
    id: 1,
    company: "Clebin Ltda",
    email: "clebincria@ua.pt",
    phone: "254 444 555",
    workforce: "12 de 15",
  },
  {
    id: 2,
    company: "Hidalgo Industries",
    email: "equipas@hidalgo.com",
    phone: "912 333 210",
    workforce: "8 de 10",
  },
  {
    id: 3,
    company: "Universal Steel",
    email: "talent@unsteel.io",
    phone: "213 778 944",
    workforce: "3 de 6",
  },
  {
    id: 4,
    company: "Montagens Aurora",
    email: "contato@aurora.com",
    phone: "255 886 420",
    workforce: "15 de 20",
  },
  {
    id: 5,
    company: "Mega Manutencao",
    email: "rh@megamaint.com",
    phone: "918 221 001",
    workforce: "1 de 5",
  },
];

export default function TeamManagement() {
  return (
    <div className="min-h-screen bg-base-200">
      <SuperAdminNavbar />
      <main className="flex justify-center px-6 pb-16 pt-10">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col gap-6 rounded-2xl bg-[#F0F0F0] p-8 shadow">
            <header className="flex flex-wrap items-center justify-center">
              <h1 className="text-3xl font-bold text-[#1F2959]">Equipas</h1>
            </header>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {FILTERS.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-2 rounded-xl border border-[#60678E] bg-[#F5F5F5] px-6 py-3 text-[#2C3A74]"
                >
                  <span className="text-lg font-medium">{filter.label}:</span>
                  <span className="text-lg font-medium text-black">{filter.value}</span>
                </div>
              ))}
            </div>

            <section className="flex flex-col gap-4">
              {TEAM_REQUESTS.map((team) => (
                <TeamManagementCard key={team.id} {...team} />
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
