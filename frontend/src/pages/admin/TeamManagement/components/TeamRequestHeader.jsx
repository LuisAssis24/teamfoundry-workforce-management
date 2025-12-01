import React from "react";
import PropTypes from "prop-types";

export default function TeamRequestHeader({ teamName }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h1 className="text-4xl font-bold leading-tight text-[#1F2959]">Equipa - {teamName}</h1>
    </div>
  );
}

TeamRequestHeader.propTypes = {
  teamName: PropTypes.string.isRequired,
};
