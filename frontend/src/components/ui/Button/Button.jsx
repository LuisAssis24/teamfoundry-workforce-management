
import PropTypes from "prop-types";

/**
 * Botão reutilizável
 * Props:
 * - label: texto do botão
 * - icon: elemento React opcional (ex: <i className="bi bi-lock" />)
 * - variant: 'primary' | 'secondary' | 'accent' | 'neutral' | 'outline'
 * - className: estilos extra opcionais
 */
export default function Button({
                                   label,
                                   icon,
                                   variant = "primary",
                                   className = "",
                                   ...props
                               }) {
    const baseClass = `btn btn-${variant} w-full flex items-center justify-center gap-2 ${className}`;

    return (
        <button type="button" className={baseClass} {...props}>
            {icon && <span className="text-lg">{icon}</span>}
            <span>{label}</span>
        </button>
    );
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    variant: PropTypes.oneOf(["primary", "secondary", "accent", "neutral", "outline", "warning", "success"]),
    className: PropTypes.string,
};
