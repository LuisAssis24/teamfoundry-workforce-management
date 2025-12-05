import { useRef } from "react";
import PropTypes from "prop-types";

export default function DropZone({
  label,
  onSelect,
  disabled = false,
  hasFile = false,
  fileName,
  onRemove,
}) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || disabled) return;
    onSelect(file);
  };

  function handleDrop(e) {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  }
  function prevent(e) { e.preventDefault(); }

  return (
    <div className="relative">
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      {hasFile && onRemove && (
        <button
          type="button"
          className="btn btn-ghost btn-xs absolute right-2 top-[38px] z-10"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
        >
          <i className="bi bi-x" />
        </button>
      )}
      <div
        className={`border rounded-xl p-6 text-center ${hasFile ? "border-base-300 bg-base-200" : "border-dashed border-base-300 bg-base-50"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        {hasFile ? (
          <div className="flex flex-col items-center gap-2 text-base-content">
            <i className="bi bi-file-earmark-text text-2xl" />
            <span className="font-semibold">{fileName || "ficheiro.pdf"}</span>
            <button
              type="button"
              className="btn btn-sm btn-accent btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Alterar
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-base-content/80">
            <i className="bi bi-plus-square text-2xl" />
            <span>Arraste ficheiro aqui / clique para escolher</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );
}

DropZone.propTypes = {
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hasFile: PropTypes.bool,
  fileName: PropTypes.string,
  onRemove: PropTypes.func,
};

