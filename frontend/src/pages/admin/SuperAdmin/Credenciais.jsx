import { useMemo, useState } from "react";
import CompanyCredentialsList from "../../../components/ui/CompanyCredentialsList/CompanyCredentialsList.jsx";
import Button from "../../../components/ui/Button/Button.jsx";
import Modal from "../../../components/ui/Modal/Modal.jsx";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "super-admin", label: "Super Admin" },
];

const getInitialCreateForm = () => ({
  username: "",
  role: "admin",
  password: "",
  confirmPassword: "",
  superAdminPassword: "",
});

export default function Credenciais() {
  const [businessCompanies] = useState([
    {
      id: 1,
      companyName: "Clebin Ltda",
      credentialEmail: "credenciais@clebin.com",
      website: "https://clebin.com",
      address: "Rua das Flores, 123, Porto",
      nif: "999888444",
      country: "Portugal",
      responsibleName: "Crebin Cria",
      responsibleEmail: "clebincria@ua.pt",
    },
    {
      id: 2,
      companyName: "StartUp Azul",
      credentialEmail: "credencial@startupazul.com",
      website: "https://startupazul.com",
      address: "Avenida Paulista, 1000, São Paulo",
      nif: "123456789",
      country: "Brasil",
      responsibleName: "Maria Souza",
      responsibleEmail: "maria@startupazul.com",
    },
    {
      id: 3,
      companyName: "Tech Green",
      credentialEmail: "credencial@techgreen.pt",
      website: "https://techgreen.pt",
      address: "Praça do Comércio, 45, Lisboa",
      nif: "987654321",
      country: "Portugal",
      responsibleName: "Joao Ribeiro",
      responsibleEmail: "joao@techgreen.pt",
    },
    {
      id: 4,
      companyName: "Innova Labs",
      credentialEmail: "credencial@innovalabs.es",
      website: "https://innovalabs.es",
      address: "Calle Mayor, 77, Madrid",
      nif: "456123789",
      country: "Espanha",
      responsibleName: "Ana Garcia",
      responsibleEmail: "ana@innovalabs.es",
    },
  ]);

  const [adminCredentials, setAdminCredentials] = useState([
    { id: 101, username: "administrador 01", role: "admin" },
    { id: 102, username: "administrador 02", role: "admin" },
    { id: 103, username: "administrador 03", role: "super-admin" },
  ]);

  const [companyInModal, setCompanyInModal] = useState(null);
  const [companyPendingRejection, setCompanyPendingRejection] = useState(null);
  const [adminPendingDisable, setAdminPendingDisable] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [adminBeingEdited, setAdminBeingEdited] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    role: "admin",
    changePassword: false,
    password: "",
    confirmPassword: "",
    superAdminPassword: "",
  });
  const [createForm, setCreateForm] = useState(getInitialCreateForm);

  const businessFields = useMemo(
      () => [
        { key: "companyName", label: "Nome Empresa:" },
        { key: "credentialEmail", label: "Email Credencial:" },
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
        {
          key: "role",
          label: "Cargo administrativo:",
          getValue: (admin) =>
              admin.role === "super-admin" ? "Super Admin" : "Admin",
        },
      ],
      []
  );

  const handleViewMore = (company) => setCompanyInModal(company);
  const handleAccept = (id) => console.log("Aceitar", id);

  const handleRejectClick = () => setCompanyPendingRejection(companyInModal);

  const handleEdit = (admin) => {
    if (!admin) return;

    setAdminBeingEdited(admin);
    setEditForm({
      username: admin.username,
      role: admin.role,
      changePassword: false,
      password: "",
      confirmPassword: "",
      superAdminPassword: "",
    });
    setIsEditModalOpen(true);
  };

  const handleDisable = (adminId) => {
    const admin = adminCredentials.find((item) => item.id === adminId);
    if (!admin) return;
    setAdminPendingDisable(admin);
  };

  const handleCreate = () => {
    setCreateForm(getInitialCreateForm());
    setIsCreateModalOpen(true);
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateFieldChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChangePassword = () => {
    setEditForm((prev) => ({
      ...prev,
      changePassword: !prev.changePassword,
      password: "",
      confirmPassword: "",
      superAdminPassword: "",
    }));
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setAdminBeingEdited(null);
  };

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleSaveAdmin = () => {
    if (!adminBeingEdited) return;

    setAdminCredentials((prev) =>
        prev.map((admin) =>
            admin.id === adminBeingEdited.id
                ? { ...admin, username: editForm.username, role: editForm.role }
                : admin
        )
    );

    handleCloseEditModal();
  };

  const handleSaveNewAdmin = () => {
    const newAdmin = {
      id: Date.now(),
      username: createForm.username,
      role: createForm.role,
    };

    setAdminCredentials((prev) => [...prev, newAdmin]);
    setCreateForm(getInitialCreateForm());
    handleCloseCreateModal();
  };

  const handleConfirmReject = () => {
    if (!companyPendingRejection) return;
    console.log("Recusar", companyPendingRejection.id);
    setCompanyPendingRejection(null);
    setCompanyInModal(null);
  };

  const handleCancelReject = () => setCompanyPendingRejection(null);

  const handleConfirmDisable = () => {
    if (!adminPendingDisable) return;
    console.log("Desativar", adminPendingDisable.id);
    setAdminPendingDisable(null);
  };

  const handleCancelDisable = () => setAdminPendingDisable(null);

  return (
      <>
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

        <Modal
            open={Boolean(companyInModal)}
            title="Detalhes da Credencial"
            onClose={() => setCompanyInModal(null)}
            actions={
              <div className="w-full flex justify-end gap-3">
                <Button
                    label="Recusar"
                    variant="danger"
                    className="max-w-32 btn-error text-white"
                    onClick={handleRejectClick}
                />
                <Button
                    label="Fechar"
                    variant="outline"
                    className="max-w-32 btn btn-secondary"
                    onClick={() => setCompanyInModal(null)}
                />
              </div>
            }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nome da empresa", value: companyInModal?.companyName },
              { label: "Email da credencial", value: companyInModal?.credentialEmail },
              { label: "NIF", value: companyInModal?.nif },
              { label: "Website", value: companyInModal?.website },
              { label: "País", value: companyInModal?.country },
              { label: "Morada", value: companyInModal?.address },
              { label: "Nome do responsável", value: companyInModal?.responsibleName },
              { label: "Email do responsável", value: companyInModal?.responsibleEmail },
            ].map(({ label, value }) => (
                <label key={label} className="form-control w-full">
                  <span className="label-text font-medium">{label}</span>
                  <input
                      type="text"
                      value={value ?? ""}
                      disabled
                      className="input input-bordered w-full"
                  />
                </label>
            ))}
          </div>
        </Modal>

        <Modal
            open={Boolean(companyPendingRejection)}
            title="Tem certeza?"
            onClose={handleCancelReject}
            actions={
              <div className="flex w-full justify-end gap-3">
                <Button
                    label="Cancelar"
                    variant="outline"
                    className="max-w-32 btn btn-secondary"
                    onClick={handleCancelReject}
                />
                <Button
                    label="Sim"
                    variant="danger"
                    className="max-w-32 btn-error text-white"
                    onClick={handleConfirmReject}
                />
              </div>
            }
        >
          <p className="text-base-content">
            Ao confirmar, a credencial será recusada. Deseja continuar?
          </p>
        </Modal>

        <Modal
            open={Boolean(adminPendingDisable)}
            title="Tem certeza?"
            onClose={handleCancelDisable}
            actions={
              <div className="flex w-full justify-end gap-3">
                <Button
                    label="Cancelar"
                    variant="outline"
                    className="max-w-32 btn btn-secondary"
                    onClick={handleCancelDisable}
                />
                <Button
                    label="Sim"
                    variant="danger"
                    className="max-w-32 btn-error text-white"
                    onClick={handleConfirmDisable}
                />
              </div>
            }
        >
          <p className="text-base-content">
            Ao confirmar, o administrador será desativado. Deseja continuar?
          </p>
        </Modal>

        <Modal
            open={isEditModalOpen}
            title="Editar administrador"
            onClose={handleCloseEditModal}
            actions={
              <div className="flex w-full justify-end gap-3">
                <Button
                    label="Fechar"
                    variant="outline"
                    className="max-w-32 btn btn-secondary"
                    onClick={handleCloseEditModal}
                />
                <Button
                    label="Salvar"
                    variant="primary"
                    className="max-w-32"
                    onClick={handleSaveAdmin}
                />
              </div>
            }
        >
          <div className="space-y-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Username</span>
              <input
                  type="text"
                  value={editForm.username}
                  onChange={(event) =>
                      handleEditFieldChange("username", event.target.value)
                  }
                  className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text font-medium">Cargo</span>
              <select
                  className="select select-bordered w-full"
                  value={editForm.role}
                  onChange={(event) =>
                      handleEditFieldChange("role", event.target.value)
                  }
              >
                {ROLE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-3 pt-5">
              <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={editForm.changePassword}
                  onChange={handleToggleChangePassword}
                  id="alterar-password"
              />
              <label
                  htmlFor="alterar-password"
                  className="font-medium cursor-pointer"
              >
                Alterar password
              </label>
            </div>

            {editForm.changePassword && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control w-full">
                    <span className="label-text font-medium">Password</span>
                    <input
                        type="password"
                        value={editForm.password}
                        onChange={(event) =>
                            handleEditFieldChange("password", event.target.value)
                        }
                        className="input input-bordered w-full"
                    />
                  </label>

                  <label className="form-control w-full">
                    <span className="label-text font-medium">Repetir password</span>
                    <input
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(event) =>
                            handleEditFieldChange("confirmPassword", event.target.value)
                        }
                        className="input input-bordered w-full"
                    />
                  </label>

                  <label className="form-control w-full md:col-span-2">
                <span className="label-text font-medium">
                  Password Super Admin
                </span>
                    <input
                        type="password"
                        value={editForm.superAdminPassword}
                        onChange={(event) =>
                            handleEditFieldChange("superAdminPassword", event.target.value)
                        }
                        className="input input-bordered w-full"
                    />
                  </label>
                </div>
            )}
          </div>
        </Modal>

        <Modal
            open={isCreateModalOpen}
            title="Criar administrador"
            onClose={handleCloseCreateModal}
            actions={
              <div className="flex w-full justify-end gap-3">
                <Button
                    label="Cancelar"
                    variant="outline"
                    className="max-w-32 btn btn-secondary"
                    onClick={handleCloseCreateModal}
                />
                <Button
                    label="Criar"
                    variant="primary"
                    className="max-w-32"
                    onClick={handleSaveNewAdmin}
                />
              </div>
            }
        >
          <div className="space-y-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Username</span>
              <input
                  type="text"
                  value={createForm.username}
                  onChange={(event) =>
                      handleCreateFieldChange("username", event.target.value)
                  }
                  className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text font-medium">Cargo</span>
              <select
                  className="select select-bordered w-full"
                  value={createForm.role}
                  onChange={(event) =>
                      handleCreateFieldChange("role", event.target.value)
                  }
              >
                {ROLE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text font-medium">Password</span>
                <input
                    type="password"
                    value={createForm.password}
                    onChange={(event) =>
                        handleCreateFieldChange("password", event.target.value)
                    }
                    className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text font-medium">Repetir password</span>
                <input
                    type="password"
                    value={createForm.confirmPassword}
                    onChange={(event) =>
                        handleCreateFieldChange("confirmPassword", event.target.value)
                    }
                    className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full md:col-span-2">
              <span className="label-text font-medium">
                Password Super Admin
              </span>
                <input
                    type="password"
                    value={createForm.superAdminPassword}
                    onChange={(event) =>
                        handleCreateFieldChange("superAdminPassword", event.target.value)
                    }
                    className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>
        </Modal>
      </>
  );
}
