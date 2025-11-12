import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../../api/client.js";
import CompanyCredentialsList from "./components/CompanyCredentialsList.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import Modal from "../../../../components/ui/Modal/Modal.jsx";


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

const getInitialEditForm = () => ({
  username: "",
  role: "admin",
  changePassword: false,
  password: "",
  confirmPassword: "",
  superAdminPassword: "",
});

const normalizeRole = (role) => {
  if (!role) return "admin";
  const lower = String(role).toLowerCase();
  return lower === "superadmin" ? "super-admin" : lower;
};

export default function Credenciais() {
  const [businessCompanies, setBusinessCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companyError, setCompanyError] = useState(null);

  const [adminCredentials, setAdminCredentials] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [adminError, setAdminError] = useState(null);

  const [createAdminError, setCreateAdminError] = useState(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const [editAdminError, setEditAdminError] = useState(null);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  const [companyInModal, setCompanyInModal] = useState(null);
  const [companyPendingRejection, setCompanyPendingRejection] = useState(null);
  const [adminPendingDisable, setAdminPendingDisable] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [adminBeingEdited, setAdminBeingEdited] = useState(null);

  const [editForm, setEditForm] = useState(getInitialEditForm);
  const [createForm, setCreateForm] = useState(getInitialCreateForm);

  useEffect(() => {
    let canceled = false;

    async function loadPendingCompanies() {
      setIsLoadingCompanies(true);
      setCompanyError(null);

      try {
        const resp = await apiFetch("/api/super-admin/credentials/companies");
        if (!resp.ok) throw new Error("Falha ao carregar credenciais empresariais.");
        const data = await resp.json();
        if (!canceled) setBusinessCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!canceled) setCompanyError(error.message || "Erro inesperado ao listar credenciais.");
      } finally {
        if (!canceled) setIsLoadingCompanies(false);
      }
    }

    loadPendingCompanies();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;

    async function loadAdminCredentials() {
      setIsLoadingAdmins(true);
      setAdminError(null);

      try {
        const resp = await apiFetch("/api/super-admin/credentials/admins");
        if (!resp.ok) throw new Error("Falha ao carregar credenciais administrativas.");

        const data = await resp.json();
        if (!canceled) {
          const payload = Array.isArray(data) ? data : [];
          setAdminCredentials(
              payload.map((admin) => ({
                ...admin,
                role: normalizeRole(admin.role),
              }))
          );
        }
      } catch (error) {
        if (!canceled) setAdminError(error.message || "Erro inesperado ao listar administradores.");
      } finally {
        if (!canceled) setIsLoadingAdmins(false);
      }
    }

    loadAdminCredentials();
    return () => {
      canceled = true;
    };
  }, []);

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
          getValue: (admin) => (admin.role === "super-admin" ? "Super Admin" : "Admin"),
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
    setEditAdminError(null);
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
    setCreateAdminError(null);
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

  const handleSaveAdmin = async () => {
    if (!adminBeingEdited) return;

    setEditAdminError(null);

    if (!editForm.username.trim()) {
      setEditAdminError("Username é obrigatório.");
      return;
    }

    if (editForm.changePassword) {
      if (!editForm.password.trim() || !editForm.confirmPassword.trim()) {
        setEditAdminError("Para alterar a password, preencha e confirme o novo valor.");
        return;
      }
      if (editForm.password !== editForm.confirmPassword) {
        setEditAdminError("As passwords devem coincidir.");
        return;
      }
    }

    setIsSavingAdmin(true);
    try {
      const payload = {
        username: editForm.username.trim(),
        role: editForm.role === "super-admin" ? "SUPERADMIN" : "ADMIN",
        password: editForm.changePassword ? editForm.password : null,
      };

      const resp = await apiFetch(`/api/super-admin/credentials/admins/${adminBeingEdited.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const message = (await resp.json().catch(() => null))?.error;
        throw new Error(message || "Não foi possível atualizar o administrador.");
      }

      const updated = await resp.json();
      setAdminCredentials((prev) =>
        prev.map((admin) =>
          admin.id === adminBeingEdited.id
            ? {
                ...updated,
                role: normalizeRole(updated.role),
              }
            : admin
        )
      );

      handleCloseEditModal();
    } catch (error) {
      setEditAdminError(error.message || "Erro inesperado ao editar administrador.");
    } finally {
      setIsSavingAdmin(false);
    }
  };

const handleSaveNewAdmin = async () => {
  setCreateAdminError(null);

  if (!createForm.username.trim() || !createForm.password.trim()) {
    setCreateAdminError("Username e password são obrigatórios.");
    return;
  }

  if (createForm.password !== createForm.confirmPassword) {
    setCreateAdminError("As passwords devem coincidir.");
    return;
  }

  setIsCreatingAdmin(true);
  try {
    const payload = {
      username: createForm.username.trim(),
      password: createForm.password,
      role: createForm.role === "super-admin" ? "SUPERADMIN" : "ADMIN",
    };

    const resp = await apiFetch("/api/super-admin/credentials/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const message = (await resp.json().catch(() => null))?.error;
      throw new Error(message || "Não foi possível criar o administrador.");
    }

    const created = await resp.json();
    setAdminCredentials((prev) => [
      ...prev,
      {
        ...created,
        role: normalizeRole(created.role),
      },
    ]);
    setCreateForm(getInitialCreateForm());
    setIsCreateModalOpen(false);
  } catch (error) {
    setCreateAdminError(error.message || "Erro inesperado ao criar administrador.");
  } finally {
    setIsCreatingAdmin(false);
  }
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
        {companyError && (
            <div className="alert alert-error shadow">
              <span>{companyError}</span>
            </div>
        )}

        {isLoadingCompanies ? (
            <div className="bg-base-100 border border-base-200 rounded-3xl shadow-xl p-8">
              <p className="text-base-content font-semibold">Carregando credenciais empresariais...</p>
            </div>
        ) : (
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
        )}

        {adminError && (
            <div className="alert alert-error shadow">
              <span>{adminError}</span>
            </div>
        )}

        {isLoadingAdmins ? (
            <div className="bg-base-100 border border-base-200 rounded-3xl shadow-xl p-8">
              <p className="text-base-content font-semibold">Carregando credenciais administrativas...</p>
            </div>
        ) : (
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
                      className="w-full md:w-auto btn-outline"
                      onClick={handleCreate}
                  />
                }
            />
        )}
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
                <input type="text" value={value ?? ""} disabled className="input input-bordered w-full" />
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
        <p className="text-base-content">Ao confirmar, a credencial será recusada. Deseja continuar?</p>
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
        <p className="text-base-content">Ao confirmar, o administrador será desativado. Deseja continuar?</p>
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
                  disabled={isSavingAdmin}
              />
              <Button
                  label={isSavingAdmin ? "Salvando..." : "Salvar"}
                  variant="primary"
                  className="max-w-32"
                  onClick={handleSaveAdmin}
                  disabled={isSavingAdmin}
              />
            </div>
          }
      >
        <div className="space-y-4">
          {editAdminError && (
              <div className="alert alert-error shadow">
                <span>{editAdminError}</span>
              </div>
          )}

          <label className="form-control w-full">
            <span className="label-text font-medium">Username</span>
            <input
                type="text"
                value={editForm.username}
                onChange={(event) => handleEditFieldChange("username", event.target.value)}
                className="input input-bordered w-full"
                disabled={isSavingAdmin}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text font-medium">Cargo</span>
            <select
                className="select select-bordered w-full"
                value={editForm.role}
                onChange={(event) => handleEditFieldChange("role", event.target.value)}
                disabled={isSavingAdmin}
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
                id="change-password-checkbox"
                type="checkbox"
                className="toggle toggle-primary"
                checked={editForm.changePassword}
                onChange={handleToggleChangePassword}
                disabled={isSavingAdmin}
            />
            <label htmlFor="change-password-checkbox" className="text-base font-medium">
              Alterar password?
            </label>
          </div>

          {editForm.changePassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control w-full">
                  <span className="label-text font-medium">Password</span>
                  <input
                      type="password"
                      value={editForm.password}
                      onChange={(event) => handleEditFieldChange("password", event.target.value)}
                      className="input input-bordered w-full"
                      disabled={isSavingAdmin}
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text font-medium">Repetir password</span>
                  <input
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(event) => handleEditFieldChange("confirmPassword", event.target.value)}
                      className="input input-bordered w-full"
                      disabled={isSavingAdmin}
                  />
                </label>

                <label className="form-control w-full md:col-span-2">
                  <span className="label-text font-medium">Password Super Admin</span>
                  <input
                      type="password"
                      value={editForm.superAdminPassword}
                      onChange={(event) => handleEditFieldChange("superAdminPassword", event.target.value)}
                      className="input input-bordered w-full"
                      disabled={isSavingAdmin}
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
                  disabled={isCreatingAdmin}
              />
              <Button
                  label={isCreatingAdmin ? "Criando..." : "Criar"}
                  variant="primary"
                  className="max-w-32"
                  onClick={handleSaveNewAdmin}
                  disabled={isCreatingAdmin}
              />
            </div>
          }
      >
        <div className="space-y-4">
          {createAdminError && (
              <div className="alert alert-error shadow">
                <span>{createAdminError}</span>
              </div>
          )}

          <label className="form-control w-full">
            <span className="label-text font-medium">Username</span>
            <input
                type="text"
                value={createForm.username}
                onChange={(event) => handleCreateFieldChange("username", event.target.value)}
                className="input input-bordered w-full"
                disabled={isCreatingAdmin}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text font-medium">Cargo</span>
            <select
                className="select select-bordered w-full"
                value={createForm.role}
                onChange={(event) => handleCreateFieldChange("role", event.target.value)}
                disabled={isCreatingAdmin}
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
                  onChange={(event) => handleCreateFieldChange("password", event.target.value)}
                  className="input input-bordered w-full"
                  disabled={isCreatingAdmin}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text font-medium">Repetir password</span>
              <input
                  type="password"
                  value={createForm.confirmPassword}
                  onChange={(event) => handleCreateFieldChange("confirmPassword", event.target.value)}
                  className="input input-bordered w-full"
                  disabled={isCreatingAdmin}
              />
            </label>

            <label className="form-control w-full md:col-span-2">
              <span className="label-text font-medium">Password Super Admin</span>
              <input
                  type="password"
                  value={createForm.superAdminPassword}
                  onChange={(event) => handleCreateFieldChange("superAdminPassword", event.target.value)}
                  className="input input-bordered w-full"
                  disabled={isCreatingAdmin}
              />
            </label>
          </div>
        </div>
      </Modal>
    </>
);
}
