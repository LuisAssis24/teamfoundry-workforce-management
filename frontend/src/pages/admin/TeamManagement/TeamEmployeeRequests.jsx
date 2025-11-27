import React from "react";
import { useNavigate } from "react-router-dom";
import TeamRequestHeader from "./components/TeamRequestHeader.jsx";
import TeamRequestGrid from "./components/TeamRequestGrid.jsx";
import BackButton from "./components/BackButton.jsx";

const TEAM_NAME = "NomeEmpresa";

const TEAM_REQUESTS = [
  { id: 1, role: "Tubista", workforceCurrent: 3, workforceTotal: 3, proposalsSent: 10, status: "COMPLETE" },
  { id: 2, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
  { id: 3, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
  { id: 4, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
  { id: 5, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
  { id: 6, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
  { id: 7, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
  { id: 8, role: "Tubista", workforceCurrent: 2, workforceTotal: 3, proposalsSent: 10, status: "IN_PROGRESS" },
];

export default function TeamEmployeeRequests() {
  const navigate = useNavigate();

  const handleSelect = (request) => {
    navigate(`/admin/team-management/build?request=${request.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-8 py-10">
        <BackButton />
        <TeamRequestHeader teamName={TEAM_NAME} />

        <TeamRequestGrid requests={TEAM_REQUESTS} onSelect={handleSelect} />
      </div>
    </div>
  );
}
