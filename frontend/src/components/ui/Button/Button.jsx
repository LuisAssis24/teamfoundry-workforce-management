
import PropTypes from "prop-types";

/**
 * Botão reutilizável
 * Props:
 * - label: texto do botão
 * - icon: elemento React opcional (ex: <i className="bi bi-lock" />)
 * - variant: 'primary' | 'secondary' | 'accent' | 'neutral' | 'outline'
 * - className: estilos extra opcionais
 */
export const BUTTON_VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
  outline: "btn-outline",
  ghost: "btn-ghost",
  warning: "btn-warning",
  success: "btn-success",
};

export function getButtonVariantClass(variant = "primary") {
  return BUTTON_VARIANT_CLASSES[variant] ?? BUTTON_VARIANT_CLASSES.primary;
}

export default function Button({
  label,
  icon,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) {
  const variantClass = getButtonVariantClass(variant);
  const baseClass = `btn ${variantClass} w-full flex items-center justify-center gap-2 ${className}`;
  const finalProps =
    Component === "button" && !("type" in props)
      ? { ...props, type: "button" }
      : props;

  return (
    <Component className={baseClass} {...finalProps}>
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </Component>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "neutral",
    "outline",
    "ghost",
    "warning",
    "success",
  ]),
  className: PropTypes.string,
  as: PropTypes.elementType,
};
