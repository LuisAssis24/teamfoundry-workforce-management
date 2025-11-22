import { useEffect, useMemo, useState } from "react";
import WorkRequestCard from "../../../../components/ui/WorkManagement/WorkRequestCard.jsx";
import AssignAdminModal from "../../../../components/ui/WorkManagement/AssignAdminModal.jsx";
import { teamRequestsAPI } from "../../../../api/teamRequests.js";

export default function GestaoTrabalho() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [workRequests, setWorkRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  const [adminOptions, setAdminOptions] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [adminError, setAdminError] = useState(null);

  const [assignError, setAssignError] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    let canceled = false;

    async function loadRequests() {
      setIsLoadingRequests(true);
      setRequestsError(null);

      try {
        const data = await teamRequestsAPI.getSuperAdminList();
        if (!canceled) setWorkRequests(data);
      } catch (err) {
        if (!canceled) setRequestsError(err.message || "Erro ao carregar requisições.");
      } finally {
        if (!canceled) setIsLoadingRequests(false);
      }
    }

    async function loadAdminOptions() {
      setIsLoadingAdmins(true);
      setAdminError(null);

      try {
        const options = await teamRequestsAPI.getAdminOptions();
        if (!canceled) {
          setAdminOptions(
              options.map((item) => ({
                id: item.id,
                name: item.username,
                requestCount: item.requestCount,
              }))
          );
        }
      } catch (err) {
        if (!canceled) setAdminError(err.message || "Erro ao carregar administradores.");
      } finally {
        if (!canceled) setIsLoadingAdmins(false);
      }
    }

    loadRequests();
    loadAdminOptions();
    return () => {
      canceled = true;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return workRequests;

    return workRequests.filter((request) => {
      const team = request.teamName?.toLowerCase() ?? "";
      const company = request.companyName?.toLowerCase() ?? "";
      return team.includes(term) || company.includes(term);
    });
  }, [workRequests, searchTerm]);

  const handleAssignAdmin = (requestId) => {
    setSelectedRequestId(requestId);
    setAssignError(null);
    setIsAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
    setSelectedRequestId(null);
    setAssignError(null);
  };

  const handleAssignAdminConfirm = async (admin) => {
    if (!selectedRequestId || !admin) return;

    setAssignError(null);
    setIsAssigning(true);

    try {
      const updated = await teamRequestsAPI.assignToAdmin(selectedRequestId, admin.id);
      setWorkRequests((prev) =>
          prev.map((request) => (request.id === updated.id ? updated : request))
      );
      handleCloseModal();
    } catch (err) {
      setAssignError(err.message || "Erro inesperado ao atribuir administrador.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Gestao de Trabalho</h1>
          <p className="text-body text-base-content/70 mt-2">
            Configure fluxos de trabalho, cargos e equipes empresariais.
          </p>
        </header>

        {requestsError && (
            <div className="alert alert-error shadow">
              <span>{requestsError}</span>
            </div>
        )}
        {adminError && (
            <div className="alert alert-warning shadow">
              <span>{adminError}</span>
            </div>
        )}

        <section className="bg-base-100 border border-base-200 rounded-3xl shadow-xl p-8 space-y-6 md:p-10">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">Requisicoes</h2>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 w-full md:w-auto md:justify-end">
              <label className="input input-bordered flex items-center gap-2 w-full md:w-72">
                <input
                    type="search"
                    className="grow"
                    placeholder="Pesquisar requisicao"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <span className="btn btn-ghost btn-circle btn-sm pointer-events-none">
                <i className="bi bi-search" aria-hidden="true" />
              </span>
              </label>
            </div>
          </header>

          {isLoadingRequests ? (
              <div className="py-6 text-center text-base-content/70">
                Carregando requisições...
              </div>
          ) : filteredRequests.length === 0 ? (
              <div className="alert alert-info shadow-md">
                <span className="text-body">Nenhuma requisicao encontrada.</span>
              </div>
          ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                    <WorkRequestCard
                        key={request.id}
                        company={{ name: request.companyName }}
                        teamName={request.teamName}
                        description={request.description}
                        state={request.state}
                        responsibleAdminId={request.responsibleAdminId}
                        startDate={request.startDate}
                        endDate={request.endDate}
                        createdAt={request.createdAt}
                        onAssignAdmin={() => handleAssignAdmin(request.id)}
                    />
                ))}
              </div>
          )}
        </section>

        <AssignAdminModal
            open={isAssignModalOpen}
            onClose={handleCloseModal}
            onAssign={handleAssignAdminConfirm}
            adminList={adminOptions}
            isLoading={isLoadingAdmins}
            isBusy={isAssigning}
            errorMessage={assignError}
        />
      </section>
  );
}
