import { Link } from "react-router-dom";

export default function TeamManagementCard({ id, company, email, phone, workforce }) {
  return (
    <div
      className="relative rounded-2xl border border-[#111827] bg-[#F5F5F5] px-6 py-4"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <dl className="grid grid-cols-1 gap-1 text-base text-[#111827] sm:grid-cols-2">
        <InfoRow label="Nome Empresa" value={company} />
        <InfoRow label="Email Responsavel" value={email} />
        <InfoRow label="Telefone Empresa" value={phone} />
        <InfoRow label="Mao de Obra" value={workforce} />
      </dl>

      <Link
        to={`/admin/team-management/build?team=${id ?? ""}`}
        className="absolute right-6 top-1/2 -translate-y-1/2 rounded-xl bg-[#1F2959] px-8 py-2 text-center text-sm font-semibold text-white shadow"
      >
        Montar
      </Link>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-wrap gap-2">
      <dt className="font-medium text-[#2C3A74]">{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}
