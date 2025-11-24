import { useState } from "react";
import Modal from "../../../../components/ui/Modal/Modal.jsx";

export default function OfertasEmprego() {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <i className="bi bi-bell-fill text-4xl text-primary" aria-hidden="true" />
        <h2 className="text-3xl font-semibold">Ofertas de Trabalho</h2>
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-4 md:p-6">
          {/* Card de alerta */}
          <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden max-w-3xl mx-auto">
            {/* Linha 1: Empresa + Local/ Data */}
            <div className="flex items-start justify-between px-4 py-3">
              <div className="flex items-center gap-3 text-sm">
                <i className="bi bi-building" aria-hidden="true" />
                <span className="font-medium">Empresa: Blabla Corp</span>
              </div>
              <div className="text-right text-xs text-base-content/80 flex flex-col items-end gap-1">
                <div className="flex items-center gap-2"><span>Angra dos reis</span><i className="bi bi-person-fill" /></div>
                <div className="flex items-center gap-2"><span>24/12/2024</span><i className="bi bi-calendar-event" /></div>
              </div>
            </div>

            {/* Linha 2: Função + Ver mais */}
            <div className="border-t border-base-300 px-4 py-3 grid grid-cols-1 md:grid-cols-3 items-center gap-3 text-sm">
              <div className="md:col-span-2 flex items-center gap-2">
                <i className="bi bi-tools" aria-hidden="true" />
                <span className="text-base-content/90">Função: Tubista</span>
              </div>
              <div className="flex justify-end">
                <button type="button" className="btn btn-primary btn-sm w-32" onClick={() => setOpen(true)}>Ver mais</button>
              </div>
            </div>

            {/* Linha 3: Pagamento */}
            <div className="border-t border-base-300 px-4 py-3 flex items-center gap-2 text-sm">
              <i className="bi bi-cash-coin" aria-hidden="true" />
              <span className="text-base-content/90">Pagamento: 17€/ hora</span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Emprego"
        actions={(
          <>
            <button type="button" className="btn btn-error" onClick={() => setOpen(false)}>Recusar</button>
            <button type="button" className="btn btn-success" onClick={() => setOpen(false)}>Aceitar</button>
          </>
        )}
      >
        <p className="leading-relaxed text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="leading-relaxed text-justify mt-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <p className="mt-4">Ass. Louco</p>
      </Modal>
    </section>
  );
}
