import React from 'react';
import Button from  '../Button/Button';
import PropTypes from 'prop-types';

const WorkRequestCard = ({ 
  companyName,
  jobRole,
  workforceCount,
  administrator,
  startDate,
  endDate,
  status,
  onAssignAdmin
}) => {
  // Determinar cor do status
  const getStatusColor = () => {
    switch (status) {
      case 'Por fazer':
        return 'text-warning'; // Amarelo
      case 'Em andamento':
        return 'text-info'; // Azul claro
      case 'Concluído':
        return 'text-success'; // Verde
      default:
        return 'text-neutral';
    }
  };

  return (
    <div className="bg-base-100 rounded-box shadow-sm p-6 mb-4 border border-base-200">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-2">
              <p className="text-label font-medium text-base-content">
                <span className="font-semibold">Nome Empresa:</span> {companyName}
              </p>
              <p className="text-label text-base-content">
                <span className="font-semibold">Função:</span> {jobRole}
              </p>
              <p className="text-label text-base-content">
                <span className="font-semibold">Mão de Obra:</span> {workforceCount}
              </p>
              <p className="text-label text-base-content">
                <span className="font-semibold">Administrador:</span> {administrator || 'N/A'}
              </p>
            </div>
            
            {/* Coluna direita */}
            <div className="space-y-2">
              <p className="text-label text-base-content">
                <span className="font-semibold">Data de início:</span> {startDate}
              </p>
              <p className="text-label text-base-content">
                <span className="font-semibold">Data de finalização:</span> {endDate}
              </p>
              <p className="text-label text-base-content">
                <span className="font-semibold">Status:</span>{' '}
                <span className={`font-semibold ${getStatusColor()}`}>
                  {status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Botão */}
        <div className="flex-shrink-0">
          <Button
            variant={administrator === 'N/A' ? 'success' : 'primary'}
            onClick={onAssignAdmin}
            label={administrator === 'N/A' ? 'Atribuir Utilizador' : 'Modificar Utilizador'}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
};

WorkRequestCard.propTypes = {
  companyName: PropTypes.string.isRequired,
  jobRole: PropTypes.string.isRequired,
  workforceCount: PropTypes.number.isRequired,
  administrator: PropTypes.string,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onAssignAdmin: PropTypes.func.isRequired,
};

WorkRequestCard.defaultProps = {
  administrator: 'N/A'
};

export default WorkRequestCard;