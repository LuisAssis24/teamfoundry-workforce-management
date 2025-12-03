import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../components/ui/Modal/Modal.jsx";
import Button from "../../../../../components/ui/Button/Button.jsx";

export default function AssignAdminModal({
  open,
  onClose,
  onAssign,
  adminList,
  isLoading,
  isBusy,
  errorMessage,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      return undefined;
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const filteredAdmins = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return adminList;
    return adminList.filter((admin) => admin.name.toLowerCase().includes(term));
  }, [adminList, searchTerm]);

  return (
    <Modal open={open} onClose={onClose} title="Selecionar Administrador" className="max-w-3xl w-full">
      <div className="space-y-6 min-h-[420px] max-h-[520px] overflow-y-auto pr-1">
        {errorMessage && (
          <div className="alert alert-error shadow">
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="w-full">
          <input
            type="text"
            className="input input-bordered w-full text-body"
            placeholder="Pesquisar administrador..."
            style={{ borderRadius: "0.5rem" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-12 gap-4 border-b border-base-300 pb-3">
          <div className="col-span-3">
            <span className="text-label font-semibold text-base-content">Responsável</span>
          </div>
          <div className="col-span-6 text-center">
            <span className="text-label font-semibold text-base-content">
              Total de requisições atribuídas
            </span>
          </div>
          <div className="col-span-3" />
        </div>

        {isLoading ? (
          <div className="py-6 text-center text-base-content/70">Carregando administradores...</div>
        ) : filteredAdmins.length === 0 ? (
          <div className="py-6 text-center text-base-content/70">Nenhum administrador disponível.</div>
        ) : (
          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="grid grid-cols-12 gap-4 py-3 border-b border-base-200 items-center"
              >
                <div className="col-span-3">
                  <span className="text-body text-base-content">{admin.name}</span>
                </div>
                <div className="col-span-6 flex justify-center">
                  <span className="text-body text-base-content font-medium">{admin.requestCount}</span>
                </div>
                <div className="col-span-3 flex justify-end">
                  <Button
                    variant="secondary"
                    label={isBusy ? "Atribuindo..." : "Escolher"}
                    onClick={() => onAssign(admin)}
                    className="w-auto"
                    disabled={isBusy}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

AssignAdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  adminList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      requestCount: PropTypes.number.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  isBusy: PropTypes.bool,
  errorMessage: PropTypes.string,
};

AssignAdminModal.defaultProps = {
  adminList: [],
  isLoading: false,
  isBusy: false,
  errorMessage: null,
};
