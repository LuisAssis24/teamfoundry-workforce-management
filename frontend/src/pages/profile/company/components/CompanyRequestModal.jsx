import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "../../../../components/ui/Modal/Modal.jsx";
import InputField from "../../../../components/ui/Input/InputField.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";

/**
 * Modal multi-passo para criar requisições.
 * Passo 1: info geral; Passo 2: funções/quantidades/salários.
 */
export default function CompanyRequestModal({ open, onClose, onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({
    teamName: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [roles, setRoles] = useState([{ role: "", quantity: 1, salary: "" }]);
  const [error, setError] = useState("");

  const handleAddRole = () => {
    setRoles((prev) => [...prev, { role: "", quantity: 1, salary: "" }]);
  };

  const handleRemoveRole = (index) => {
    setRoles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRoleChange = (index, field, value) => {
    setRoles((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const goToRoles = () => {
    if (!info.teamName.trim()) {
      setError("Indique o nome da requisição.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roles.some((r) => !r.role.trim())) {
      setError("Preencha a função em todas as caixas.");
      return;
    }
    setError("");
    // Validação simples: pelo menos uma função preenchida
    if (roles.length === 0) {
      setError("Adicione pelo menos uma função.");
      return;
    }
    const payload = {
      ...info,
      startDate: info.startDate ? `${info.startDate}T00:00:00` : null,
      endDate: info.endDate ? `${info.endDate}T00:00:00` : null,
      roles: roles.map((r) => ({
        role: r.role.trim(),
        quantity: Math.max(1, Number(r.quantity) || 1),
        salary: r.salary ? Number(r.salary) : null,
      })),
    };
    if (payload.roles.some((r) => !r.role)) {
      setError("Preencha a função em todas as caixas.");
      return;
    }
    await onSubmit(payload);
    setRoles([{ role: "", quantity: 1, salary: "" }]);
    setInfo({ teamName: "", description: "", startDate: "", endDate: "", location: "" });
    setStep(1);
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova requisição" className="max-w-3xl">
      {error && (
        <div className="alert alert-error text-sm mb-3" role="alert">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Nome da equipa"
            value={info.teamName}
            onChange={(e) => setInfo((prev) => ({ ...prev, teamName: e.target.value }))}
            required
          />
          <InputField
            label="Descrição"
            as="textarea"
            value={info.description}
            onChange={(e) => setInfo((prev) => ({ ...prev, description: e.target.value }))}
            inputClassName="min-h-[120px]"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Local"
              value={info.location}
              onChange={(e) => setInfo((prev) => ({ ...prev, location: e.target.value }))}
            />
            <InputField
              label="Data de início"
              type="date"
              value={info.startDate}
              onChange={(e) => setInfo((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <InputField
              label="Data de fim"
              type="date"
              value={info.endDate}
              onChange={(e) => setInfo((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <Button label="Avançar" fullWidth={false} onClick={goToRoles} />
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Funções solicitadas</h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAddRole}
            >
              <i className="bi bi-plus-lg mr-1" aria-hidden="true" /> Adicionar
            </button>
          </div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {roles.map((role, idx) => (
              <div
                key={idx}
                className="relative border border-base-300 rounded-xl p-4 shadow-sm bg-base-100"
              >
                <button
                  type="button"
                  className="btn btn-ghost btn-xs absolute right-2 top-2"
                  onClick={() => handleRemoveRole(idx)}
                  aria-label="Remover"
                >
                  <i className="bi bi-x" aria-hidden="true" />
                </button>
                <div className="grid md:grid-cols-3 gap-3">
                  <InputField
                    label="Função"
                    value={role.role}
                    onChange={(e) => handleRoleChange(idx, "role", e.target.value)}
                    required
                  />
                  <InputField
                    label="Quantidade"
                    type="number"
                    min={1}
                    value={role.quantity}
                    onChange={(e) => handleRoleChange(idx, "quantity", e.target.value)}
                    required
                  />
                  <InputField
                    label="Salário (€)"
                    type="number"
                    min={0}
                    step="0.01"
                    value={role.salary}
                    onChange={(e) => handleRoleChange(idx, "salary", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button label="Voltar" variant="ghost" fullWidth={false} onClick={() => setStep(1)} />
            <Button label={loading ? "A criar..." : "Criar requisição"} type="submit" fullWidth={false} disabled={loading} />
          </div>
        </form>
      )}
    </Modal>
  );
}

CompanyRequestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
