import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

const AssignAdminModal = ({ open, onClose, onAssign, adminList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtra a lista de admins baseado no termo de pesquisa
  const filteredAdmins = adminList.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Selecionar Administrador"
    >
      <div className="space-y-6">
        {/* Barra de pesquisa */}
        <div className="w-full">
          <input
            type="text"
            className="input input-bordered w-full text-body"
            placeholder="Pesquisar administrador..."
            style={{ borderRadius: '0.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Cabeçalho da lista */}
        <div className="grid grid-cols-12 gap-4 border-b border-base-300 pb-3">
          <div className="col-span-3">
            <span className="text-label font-semibold text-base-content">Responsável</span>
          </div>
          <div className="col-span-6 text-center">
            <span className="text-label font-semibold text-base-content">Total de requisições (em funcionários)</span>
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Lista de administradores */}
        <div className="space-y-4">
          {filteredAdmins.map((admin) => (
            <div key={admin.id} className="grid grid-cols-12 gap-4 py-3 border-b border-base-200 items-center">
              <div className="col-span-3">
                <span className="text-body text-base-content">{admin.name}</span>
              </div>
              <div className="col-span-6 flex justify-center">
                <span className="text-body text-base-content font-medium">{admin.requestCount}</span>
              </div>
              <div className="col-span-3 flex justify-end">
                <Button
                  variant="secondary"
                  label="Escolher"
                  onClick={() => onAssign(admin)}
                  className="w-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

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
  ).isRequired,
};

export default AssignAdminModal;