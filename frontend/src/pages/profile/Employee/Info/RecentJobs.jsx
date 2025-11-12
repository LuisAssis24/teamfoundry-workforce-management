import ProfileHeader from "./components/ProfileHeader.jsx";
import ProfileTabs from "./components/ProfileTabs.jsx";

export default function RecentJobs() {
  return (
    <section>
      <ProfileHeader />
      <ProfileTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-4 md:p-6">
          <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden max-w-2xl mx-auto">
            {/* Linha 1: Empresa + Local/ Data */}
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <i className="bi bi-building text-lg" aria-hidden="true" />
                <span className="font-semibold">Empresa: Blaba Corp</span>
              </div>
              <div className="text-right text-sm text-base-content/80">
                <div>Angra dos Reis</div>
                <div>24/12/2004</div>
              </div>
            </div>

            {/* Linha 2: FunÃ§Ã£o */}
            <div className="border-t border-base-300 px-4 py-3 flex items-center gap-3 text-sm">
              <i className="bi bi-briefcase" aria-hidden="true" />
              <span className="text-base-content/90">FunÃ§Ã£o: Trolhista</span>
            </div>

            {/* Linha 3: Pagamento */}
            <div className="border-t border-base-300 px-4 py-3 flex items-center gap-3 text-sm">
              <i className="bi bi-cash-coin" aria-hidden="true" />
              <span className="text-base-content/90">Pagamento: 17â‚¬/ hora</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


