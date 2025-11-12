import { useState } from "react";
import ProfileHeader from "../../components/candidate/ProfileHeader.jsx";
import CandidateTabs from "../../components/candidate/CandidateTabs.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import InputField from "../../components/ui/Input/InputField.jsx";
import Modal from "../../components/ui/Modal/Modal.jsx";

export default function Education() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", local: "", data: "", file: null });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, file }));
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setForm((f) => ({ ...f, file }));
  }

  function prevent(e) { e.preventDefault(); }

  return (
    <section>
      <ProfileHeader />
      <CandidateTabs />

      <div className="mt-6 rounded-xl border border-base-300 bg-base-100 shadow min-h-[55vh]">
        <div className="p-4 md:p-6">
          <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden max-w-2xl mx-auto">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-base-200 flex items-center justify-center">
                  <i className="bi bi-mortarboard" />
                </div>
                <span className="font-semibold">Ensino SecundÃ¡rio</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary text-primary-content text-xs">Certificado</span>
            </div>
            <div className="border-t border-base-300 px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-base-content/80">InstituiÃ§Ã£o: Agrup. dos NÃ³s</span>
              <span className="text-base-content/80">24/12/2004</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="w-56">
              <Button label="Adicionar FormaÃ§Ã£o" onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova FormaÃ§Ã£o"
        actions={(
          <>
            <button type="button" className="btn btn-neutral" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Adicionar
            </button>
          </>
        )}
      >
        <div className="space-y-4">
          <InputField
            label="Nome da FormaÃ§Ã£o"
            name="nome"
            placeholder="Ex.: Ensino SecundÃ¡rio"
            value={form.nome}
            onChange={handleChange}
          />
          <InputField
            label="Local"
            name="local"
            placeholder="Ex.: Escola A"
            value={form.local}
            onChange={handleChange}
          />
          <div>
            <label className="label"><span className="label-text font-medium">Data de ConclusÃ£o</span></label>
            <input
              type="date"
              name="data"
              className="input input-bordered w-full"
              value={form.data}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label"><span className="label-text font-medium">Certificado</span></label>
            <div
              className="border border-dashed border-base-300 rounded-xl p-6 text-center cursor-pointer bg-base-50"
              onDragOver={prevent}
              onDragEnter={prevent}
              onDrop={handleDrop}
              onClick={() => document.getElementById("cert-upload").click()}
            >
              <div className="flex flex-col items-center gap-2 text-base-content/80">
                <i className="bi bi-plus-square text-2xl" />
                <span>Arraste seu Certificado aqui/Explore do seu dispositivo</span>
                {form.file && <span className="text-sm mt-1">Selecionado: {form.file.name}</span>}
              </div>
              <input id="cert-upload" type="file" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}


