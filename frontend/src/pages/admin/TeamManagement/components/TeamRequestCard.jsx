import React from "react";
import PropTypes from "prop-types";
import Button from "../../../../components/ui/Button/Button.jsx";

const STATUS_STYLES = {
  COMPLETE: {
    label: "Completo",
    bg: "#1CA74F",
    text: "#F5F5F5",
  },
  IN_PROGRESS: {
    label: "Montar",
    bg: "#1F2959",
    text: "#F5F5F5",
  },
};

export default function TeamRequestCard({
  role,
  workforceCurrent,
  workforceTotal,
  proposalsSent,
  status,
  onAssemble,
  onCompleteClick,
}) {
  const normalizedStatus = status?.toUpperCase() === "COMPLETE" ? "COMPLETE" : "IN_PROGRESS";
  const statusStyle = STATUS_STYLES[normalizedStatus];
  const handleComplete = onCompleteClick || onAssemble;

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 text-center shadow-md"
      style={{ minWidth: 240 }}
    >
      <InfoLine label="Função" value={role} />
      <InfoLine label="Mão de Obra" value={`${workforceCurrent} de ${workforceTotal}`} />
      <InfoLine label="Propostas Enviadas" value={proposalsSent} />

      {normalizedStatus === "COMPLETE" ? (
        <Button
          label={statusStyle.label}
          variant="success"
          fullWidth={false}
          className="px-8"
          onClick={handleComplete}
        />
      ) : (
        <Button
          label={statusStyle.label}
          variant="primary"
          fullWidth={false}
          className="px-8"
          onClick={onAssemble}
        />
      )}
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <p className="text-base leading-6 text-[#111827]">
      <span className="font-semibold text-[#2C3A74]">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </p>
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
