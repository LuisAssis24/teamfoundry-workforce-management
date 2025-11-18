import React, { useEffect, useState } from 'react';
import WorkRequestCard from '../../../../components/ui/WorkManagement/WorkRequestCard';
import AssignAdminModal from '../../../../components/ui/WorkManagement/AssignAdminModal';
import { teamRequestsAPI } from '../../../../api/teamRequests';

export default function GestaoTrabalho() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminList] = useState([]);
  const [workRequests, setWorkRequests] = useState([]);

  // Buscar requisicoes da API ao montar o componente
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await teamRequestsAPI.getAll();
        const transformedData =
          data && data.length > 0
            ? data.map((request) => ({
                id: request.id,
                company: request.company || null,
                teamName: request.teamName || 'N/A',
                description: request.description || 'N/A',
                state: request.state || 'PENDING',
                responsibleAdminId: request.responsibleAdminId,
                startDate: request.startDate || null,
                endDate: request.endDate || null,
                createdAt: request.createdAt || null,
              }))
            : [];

        setWorkRequests(transformedData);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar requisicoes:', err);
        setError('Erro ao buscar requisicoes de equipa.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAssignAdmin = (requestId) => {
    setSelectedRequestId(requestId);
    setIsAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
    setSelectedRequestId(null);
  };

  const handleAssignAdminConfirm = (admin) => {
    console.log(`Atribuindo admin ${admin.name} a requisicao ${selectedRequestId}`);
    handleCloseModal();
  };

  const filteredRequests = workRequests.filter((request) => {
    const teamName = (request.teamName || '').toLowerCase();
    return teamName.includes(searchTerm.toLowerCase());
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Gestao de Trabalho</h1>
        <p className="text-body text-base-content/70 mt-2">
          Configure fluxos de trabalho, cargos e equipes empresariais.
        </p>
      </header>

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
                onChange={handleSearch}
              />
              <span className="btn btn-ghost btn-circle btn-sm pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7 7 0 1010.3 17a7 7 0 006.35-6.35z"
                  />
                </svg>
              </span>
            </label>
          </div>
        </header>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-md mb-4">
            <span className="text-body">{error}</span>
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="alert alert-info shadow-md">
            <span className="text-body">Nenhuma requisicao encontrada.</span>
          </div>
        )}

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <WorkRequestCard
              key={request.id}
              company={request.company}
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
      </section>

      <AssignAdminModal
        open={isAssignModalOpen}
        onClose={handleCloseModal}
        onAssign={handleAssignAdminConfirm}
        adminList={adminList}
      />
    </section>
  );
}
