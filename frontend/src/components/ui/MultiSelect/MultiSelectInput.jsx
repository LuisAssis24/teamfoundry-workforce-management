import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

/**
 * Componente de multi seleção com tags removíveis.
 * Utiliza o padrão DaisyUI dropdown + badges.
 */
export default function MultiSelectInput({
    label,
    placeholder = "Selecione uma ou mais opções",
    options,
    selectedOptions,
    onChange,
    error,
}) {
    const [open, setOpen] = useState(false);

    const availableOptions = useMemo(
        () => options.filter((option) => !selectedOptions.includes(option)),
        [options, selectedOptions],
    );

    const handleSelect = (option) => {
        if (selectedOptions.includes(option)) {
            return;
        }

        onChange([...selectedOptions, option]);
    };

    const handleRemove = (option) => {
        onChange(selectedOptions.filter((item) => item !== option));
    };

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}

            <div className="dropdown w-full">
                <div
                    tabIndex={0}
                    role="button"
                    className={`input input-bordered w-full cursor-pointer ${error ? "input-error" : ""}`}
                    onClick={() => setOpen((prev) => !prev)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setOpen((prev) => !prev);
                        }
                    }}
                    aria-expanded={open}
                    aria-haspopup="listbox"
                >
                    {selectedOptions.length === 0 && (
                        <span className="text-base-content/60">{placeholder}</span>
                    )}

                    {selectedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedOptions.map((option) => (
                                <span key={option} className="badge badge-primary gap-1">
                                    {option}
                                    <button
                                        type="button"
                                        className="ml-1 text-xs"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleRemove(option);
                                        }}
                                        aria-label={`Remover ${option}`}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {open && (
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu menu-sm p-2 shadow bg-base-100 rounded-box w-full mt-2 max-h-60 overflow-auto border border-base-200"
                        role="listbox"
                    >
                        {availableOptions.length === 0 ? (
                            <li className="text-base-content/60 px-2 py-1 text-sm">
                                Todas as opções estão selecionadas.
                            </li>
                        ) : (
                            availableOptions.map((option) => (
                                <li key={option}>
                                    <button
                                        type="button"
                                        className="btn btn-ghost justify-start"
                                        onClick={() => {
                                            handleSelect(option);
                                            setOpen(false);
                                        }}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            {error && <p className="mt-2 text-sm text-error">{error}</p>}
        </div>
    );
}

MultiSelectInput.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};
