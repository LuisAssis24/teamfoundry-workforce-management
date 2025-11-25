import { useMemo, useRef, useState } from "react";
import DropZone from "../../../../components/ui/Upload/DropZone.jsx";
import Tabs from "../../../../components/sections/Tabs.jsx";

export default function Documentos() {
  const [active, setActive] = useState("identificacao");
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef(null);

  const cvUrl = useMemo(() => (cvFile ? URL.createObjectURL(cvFile) : null), [cvFile]);

  function downloadCv() {
    if (!cvFile) return;
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = cvFile.name || "curriculo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <i className="bi bi-file-earmark-text text-3xl text-primary" />
        <h2 className="text-2xl font-semibold">Documentos</h2>
      </div>

      <Tabs
        tabs={[
          { key: "identificacao", label: "Identificação" },
          { key: "curriculo", label: "Currículo" },
        ]}
        activeKey={active}
        onTabChange={setActive}
        className="mt-0"
      />

      {active === "identificacao" && (
        <div className="rounded-xl border border-base-300 bg-base-100 shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DropZone label="Documento de Identificação (frente)" onSelect={() => {}} />
            <DropZone label="Documento de Identificação (verso)" onSelect={() => {}} />
            <DropZone label="Comprovativo de Morada" onSelect={() => {}} />
          </div>
        </div>
      )}

      {active === "curriculo" && (
        <div className="rounded-xl border border-base-300 bg-base-100 shadow p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            {/* Barra de título do ficheiro */}
            <div className="rounded-t-xl border border-base-300 bg-base-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <i className="bi bi-paperclip" />
                <span>{cvFile ? cvFile.name : "curriculum.docx"}</span>
              </div>
            </div>

            {/* Moldura do preview */}
            <div className="border-x border-b border-base-300 rounded-b-xl overflow-hidden bg-base-100">
              {cvUrl ? (
                <iframe title="preview" src={cvUrl} className="w-full h-[60vh] bg-white" />
              ) : (
                <div className="w-full h-[60vh] bg-white flex items-center justify-center">
                  <div className="text-center text-base-content/70">
                    <i className="bi bi-file-earmark-text display-block text-4xl" />
                    <p className="mt-2">Pré-visualização indisponível. Carregue o seu currículo.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button className="btn btn-success" onClick={() => fileInputRef.current?.click()}>Alterar</button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e)=> setCvFile(e.target.files?.[0] || null)} />
              <button className="btn btn-accent" disabled={!cvFile} onClick={downloadCv}>Baixar</button>
              <button className="btn btn-error" disabled={!cvFile} onClick={() => setCvFile(null)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
