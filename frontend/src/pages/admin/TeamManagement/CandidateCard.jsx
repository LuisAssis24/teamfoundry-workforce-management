export default function CandidateCard({ name, role, city, preference }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-[#111827] bg-[#F5F5F5] p-4 shadow">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 rounded-2xl bg-[#1F2959]/10">
          <span className="absolute inset-0 rounded-2xl bg-[#1F2959]" />
          <span className="absolute left-1/3 top-2 h-6 w-6 rounded-md bg-white/20" />
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
        <button className="flex-1 rounded-xl bg-[#1F2959] py-2 text-sm font-semibold text-white shadow">
          Ver mais
        </button>
        <button className="flex-1 rounded-xl bg-[#1CA74F] py-2 text-sm font-semibold text-white shadow">
          Escolher
        </button>
      </div>
    </article>
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
