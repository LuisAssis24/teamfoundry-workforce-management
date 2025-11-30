import PropTypes from "prop-types";

/**
 * Cartão simples para exibir uma requisição de equipa da empresa.
 */
export default function CompanyRequestCard({ request }) {
  const { teamName, description, location, startDate, endDate, createdAt, computedStatus } = request;
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{teamName}</h3>
          <p className="text-sm text-base-content/70">{location || "Local não definido"}</p>
        </div>
        <span className="badge badge-ghost">{statusLabel(computedStatus)}</span>
      </div>
      {description && <p className="text-sm text-base-content/80">{description}</p>}
      <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
        <span>Início: {formatDate(startDate)}</span>
        <span>Fim: {formatDate(endDate)}</span>
        <span>Criada em: {formatDate(createdAt)}</span>
      </div>
    </div>
  );
}

CompanyRequestCard.propTypes = {
  request: PropTypes.object.isRequired,
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status) {
  switch (status) {
    case "ACTIVE":
      return "Ativa";
    case "PENDING":
      return "Pendente";
    case "PAST":
      return "Passada";
    default:
      return "Indefinida";
  }
}
