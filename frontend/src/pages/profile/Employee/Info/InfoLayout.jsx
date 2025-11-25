import PropTypes from "prop-types";
import ProfileHeader from "./components/ProfileHeader.jsx";
import Tabs from "../../../../components/sections/Tabs.jsx";

const PROFILE_TABS = [
  { to: "/candidato/dados-pessoais", label: "Dados Pessoais" },
  { to: "/candidato/certificacoes", label: "Certificações" },
  { to: "/candidato/ultimos-trabalhos", label: "Últimos Trabalhos" },
  { to: "/candidato/preferencias", label: "Preferências" },
];

/**
 * Layout partilhado das secções de perfil para evitar repetição
 * do cabeçalho e tabs.
 */
export default function InfoLayout({ name, children }) {
  return (
    <section>
      <ProfileHeader name={name} />
      <Tabs tabs={PROFILE_TABS} />
      {children}
    </section>
  );
}

InfoLayout.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
};
