import { useMemo, useState } from "react";
import CompanyCredentialsList from "../../../components/ui/CompanyCredentialsList/CompanyCredentialsList";
import Button from "../../../components/ui/Button/Button";

export default function Credenciais() {
  const [businessCompanies] = useState([
    {
      id: 1,
      companyName: "Clebin Ltda",
      nif: "999888444",
      country: "Portugal",
      responsibleName: "Crebin Cria",
      responsibleEmail: "clebincria@ua.pt",
    },
    {
      id: 2,
      companyName: "StartUp Azul",
      nif: "123456789",
      country: "Brasil",
      responsibleName: "Maria Souza",
      responsibleEmail: "maria@startupazul.com",
    },
    {
      id: 3,
      companyName: "Tech Green",
      nif: "987654321",
      country: "Portugal",
      responsibleName: "Joao Ribeiro",
      responsibleEmail: "joao@techgreen.pt",
    },
    {
      id: 4,
      companyName: "Innova Labs",
      nif: "456123789",
      country: "Espanha",
      responsibleName: "Ana Garcia",
      responsibleEmail: "ana@innovalabs.es",
    },
  ]);

  const [adminCredentials] = useState([
    { id: 101, username: "administrador 01", role: "Administrador geral" },
    { id: 102, username: "administrador 02", role: "Administrador geral" },
    { id: 103, username: "administrador 03", role: "Administrador geral" },
  ]);

  const businessFields = useMemo(
    () => [
      { key: "companyName", label: "Nome Empresa:" },
      { key: "nif", label: "NIF:" },
      { key: "country", label: "Pais:" },
      { key: "responsibleName", label: "Nome Responsavel:" },
      { key: "responsibleEmail", label: "Email Responsavel:" },
    ],
    []
  );

  const adminFields = useMemo(
    () => [
      { key: "username", label: "Username administrativo:" },
      { key: "role", label: "Cargo administrativo:" },
    ],
    []
  );

  const handleViewMore = (id) => console.log("Ver Mais", id);
  const handleAccept = (id) => console.log("Aceitar", id);
  const handleEdit = (id) => console.log("Editar", id);
  const handleDisable = (id) => console.log("Desativar", id);
  const handleCreate = () => console.log("Criar novo");

  return (
    <section className="space-y-12">
      <CompanyCredentialsList
        title="Credenciais Empresariais"
        companies={businessCompanies}
        fieldConfig={businessFields}
        onViewMore={handleViewMore}
        onAccept={handleAccept}
        onSearch={(value) => console.log("Pesquisar empresa:", value)}
        searchPlaceholder="Pesquisar empresa"
        viewVariant="primary"
        acceptVariant="secondary"
        viewButtonClassName="text-white"
        acceptButtonClassName="btn-outline"
      />

      <CompanyCredentialsList
        title="Credenciais Administrativas"
        companies={adminCredentials}
        fieldConfig={adminFields}
        onViewMore={handleEdit}
        onAccept={handleDisable}
        viewLabel="Editar"
        acceptLabel="Desativar"
        viewVariant="primary"
        acceptVariant="secondary"
        acceptButtonClassName="btn-outline"
        headerActions={
          <Button
            label="Criar"
            variant=""
            className="w-auto md:w-auto btn-outline"
            onClick={handleCreate}
          />

        }
      />
    </section>
  );
}
