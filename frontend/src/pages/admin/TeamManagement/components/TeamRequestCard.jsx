import React from "react";
import PropTypes from "prop-types";

export default function TeamRequestCard({
  role,
  workforceCurrent,
  workforceTotal,
  proposalsSent,
  status,
  onAssemble,
  onCompleteClick,
}) {
  const isComplete = status?.toUpperCase() === "COMPLETE";
  const buttonLabel = isComplete ? "Completo" : "Montar";
  const handleClick = isComplete ? onCompleteClick || onAssemble : onAssemble;

  return (
    <div
      className="relative rounded-2xl border border-[#111827] bg-[#F5F5F5] px-6 py-4"
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <dl className="grid grid-cols-1 gap-1 text-base text-[#111827] sm:grid-cols-2">
        <InfoRow label="Funcao" value={role} />
        <InfoRow label="Mao de Obra" value={`${workforceCurrent} de ${workforceTotal}`} />
        <InfoRow label="Propostas Enviadas" value={proposalsSent} />
      </dl>

      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={handleClick}
          className={`rounded-xl px-8 py-2 text-center text-sm font-semibold text-white shadow transition ${
            isComplete
              ? "bg-[#1CA74F] hover:bg-[#168C41]"
              : "bg-[#1F2959] hover:bg-[#172145]"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-wrap gap-2">
      <dt className="font-medium text-[#2C3A74]">{label}:</dt>
      <dd className="text-[#111827]">{value}</dd>
    </div>
  );
}

TeamRequestCard.propTypes = {
  role: PropTypes.string.isRequired,
  workforceCurrent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  workforceTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  proposalsSent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.string,
  onAssemble: PropTypes.func,
  onCompleteClick: PropTypes.func,
};

TeamRequestCard.defaultProps = {
  status: "IN_PROGRESS",
  onAssemble: undefined,
  onCompleteClick: undefined,
};
