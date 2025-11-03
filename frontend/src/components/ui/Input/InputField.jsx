import React from "react";
import PropTypes from "prop-types";

/**
 * Campo de input com label, placeholder e ícone opcional.
 * Props:
 * - label: texto exibido acima do campo
 * - placeholder: texto dentro do input
 * - icon: elemento React opcional (ex: <i className="bi bi-envelope" />)
 * - type: tipo do input (text, email, password, etc.)
 */
export default function InputField({
                                       label,
                                       placeholder,
                                       icon,
                                       type = "text",
                                       ...props
                                   }) {
    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}

            <div className="relative">
                {icon && (
                    <span className="absolute inset-y-0 left-3 flex items-center text-base-content z-10">
            {icon}
          </span>
                )}

                <input
                    type={type}
                    placeholder={placeholder}
                    className={`input input-bordered w-full ${
                        icon ? "pl-10" : ""
                    } focus:outline-none`}
                    {...props}
                />
            </div>
        </div>
    );
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    icon: PropTypes.node,
    type: PropTypes.string,
};
