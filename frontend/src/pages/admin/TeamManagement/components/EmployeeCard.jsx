import { useState } from "react";
import EmployeeProfileModal from "./EmployeeProfileModal.jsx";

export default function EmployeeCard({ name, role, city, preference }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <article className="flex h-full flex-col gap-4 rounded-2xl border border-[#111827] bg-[#F5F5F5] p-4 shadow">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F2959] text-white shadow-inner">
            <i className="bi bi-person-fill text-2xl" aria-hidden="true"></i>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#111827]">{name}</p>
            <p className="text-sm text-[#1F2959]">Funcao: {role}</p>
          </div>
        </div>

        <dl className="space-y-1 text-sm text-[#111827]">
          <InfoLine label="Localidade" value={city} />
          <InfoLine label="Preferencia" value={preference} />
        </dl>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-[#1F2959]">Experiencias:</p>
          <p className="text-[#8A93C2]">Trabalhou na empresa X atuando sob a funcao de Y.</p>
        </div>

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-xl bg-[#1F2959] py-2 text-sm font-semibold text-white shadow"
            onClick={handleOpen}
          >
            Ver mais
          </button>
          <button className="flex-1 rounded-xl bg-[#1CA74F] py-2 text-sm font-semibold text-white shadow">
            Escolher
          </button>
        </div>
      </article>

      <EmployeeProfileModal
        open={open}
        onClose={handleClose}
        employee={{ name, role, city, preference }}
      />
    </>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <dt className="font-medium text-[#1F2959]">{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}
