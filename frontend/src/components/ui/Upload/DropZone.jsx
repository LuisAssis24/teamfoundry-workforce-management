import { useRef } from "react";
import PropTypes from "prop-types";

export default function DropZone({ label, onSelect }) {
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) onSelect(file);
  }
  function prevent(e) { e.preventDefault(); }

  return (
    <div>
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <div
        className="border border-dashed border-base-300 rounded-xl p-6 text-center cursor-pointer bg-base-50"
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2 text-base-content/80">
          <i className="bi bi-plus-square text-2xl" />
          <span>Arraste ficheiro aqui / clique para escolher</span>
        </div>
        <input ref={inputRef} type="file" className="hidden" onChange={(e)=> onSelect(e.target.files?.[0] || null)} />
      </div>
    </div>
  );
}

DropZone.propTypes = {
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

