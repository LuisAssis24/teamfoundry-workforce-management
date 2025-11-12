import ProfileHeader from "../../components/candidate/ProfileHeader.jsx";
import CandidateTabs from "../../components/candidate/CandidateTabs.jsx";
import InputField from "../../components/ui/Input/InputField.jsx";
import Button from "../../components/ui/Button/Button.jsx";

export default function Preferences() {
  return (
    <section>
      <ProfileHeader />
      <CandidateTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label"><span className="label-text font-medium">FunÃ§Ã£o</span></label>
              <div className="relative">
                <select className="select select-bordered w-full">
                  <option>Selecione a FunÃ§Ã£o</option>
                  <option>Operador</option>
                  <option>TÃ©cnico</option>
                  <option>Supervisor</option>
                </select>
                <i className="bi bi-caret-down-fill absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-sm" />
              </div>
            </div>

            <div>
              <label className="label"><span className="label-text font-medium">Ãrea(s) GeogrÃ¡fica(s)</span></label>
              <div className="input input-bordered w-full min-h-12 flex items-center gap-2 flex-wrap py-2">
                <span className="px-2 py-1 rounded-md bg-base-200 text-sm">OpÃ§Ã£o 1 <i className="bi bi-x ms-1" /></span>
                <span className="px-2 py-1 rounded-md bg-base-200 text-sm">OpÃ§Ã£o 2 <i className="bi bi-x ms-1" /></span>
              </div>
            </div>

            <div className="md:col-span-2">
              <InputField label="CompetÃªncias" placeholder="Ex.: Soldadura, LogÃ­sticaâ€¦" />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="w-56">
              <Button label="Guardar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


