import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/Button/Button.jsx";

export default function BackButton({ to = "/admin/team-management" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Voltar"
      onClick={() => navigate(to)}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1F2959] shadow hover:bg-base-100 focus:outline-none focus:ring-2 focus:ring-[#1F2959]/50"
    >
      <span className="text-2xl leading-none">←</span>
    </button>
  );
}
