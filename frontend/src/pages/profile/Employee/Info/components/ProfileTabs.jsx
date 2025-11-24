import { NavLink, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";

// Guarda a última posição/lagura do indicador entre desmontagens para evitar que recomece da esquerda.
let lastIndicator = { width: 0, left: 0, hasValue: false };

const TABS = [
  { to: "/candidato/dados-pessoais", label: "Dados Pessoais" },
  { to: "/candidato/formacao", label: "Formação" },
  { to: "/candidato/ultimos-trabalhos", label: "Últimos Trabalhos" },
  { to: "/candidato/preferencias", label: "Preferências" },
];

export default function ProfileTabs() {
  const location = useLocation();
  const itemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState(() =>
    lastIndicator.hasValue ? { width: lastIndicator.width, left: lastIndicator.left } : { width: 0, left: 0 }
  );
  const [enableTransition, setEnableTransition] = useState(lastIndicator.hasValue);

  useLayoutEffect(() => {
    const activeIndex = TABS.findIndex((tab) => location.pathname.startsWith(tab.to));
    const el = itemRefs.current[activeIndex];
    if (el) {
      const { offsetWidth, offsetLeft } = el;
      const nextStyle = { width: offsetWidth, left: offsetLeft };
      setIndicatorStyle(nextStyle);
      lastIndicator = { ...nextStyle, hasValue: true };
      // Ativa transição apenas após o primeiro posicionamento desta montagem.
      if (!enableTransition) {
        requestAnimationFrame(() => setEnableTransition(true));
      }
    }
  }, [location.pathname, enableTransition]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const activeIndex = TABS.findIndex((tab) => location.pathname.startsWith(tab.to));
      const el = itemRefs.current[activeIndex];
      if (el) {
        const { offsetWidth, offsetLeft } = el;
        setIndicatorStyle({ width: offsetWidth, left: offsetLeft });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  return (
    <div className="mt-6 flex items-center justify-center gap-6 border-b border-base-300 text-sm md:text-base relative">
      {TABS.map(({ to, label }, index) => (
        <NavLink
          key={to}
          to={to}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={({ isActive }) => {
            const base = "relative pb-2 -mb-px transition-colors duration-600";
            const state = isActive
              ? "text-base-content font-semibold"
              : "text-base-content/70 hover:text-base-content";
            return `${base} ${state}`;
          }}
        >
          {label}
        </NavLink>
      ))}
      <span
        className="absolute bottom-[-2px] h-0.5 bg-base-content"
        style={{
          width: indicatorStyle.width,
          left: indicatorStyle.left,
          transition: enableTransition ? "all 260ms ease" : "none",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

