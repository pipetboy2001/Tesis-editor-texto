// ModalEditarContenido.jsx

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ButtonBootstrap from 'react-bootstrap/Button';

const ModalEditarContenido = ({
  showModal,
  onClose,
  onGuardar,
  valorInicial,
  bold,
  italic,
  underline,
  alineacion,
  orden, // Receive orden as prop
  tipo,  // Receive tipo as prop
}) => {
  const [nuevoContenido, setNuevoContenido] = useState(valorInicial);

  
    const handleChange = (e) => {
      setNuevoContenido(e.target.value);
    };
  
    return (
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
        {/* Use orden and tipo in the title */}
        <Modal.Title>{`${orden} - ${tipo}`}</Modal.Title>
      </Modal.Header>
        <Modal.Body>
         
          <label>Modificar Contenido:</label>
          <textarea
            className="form-control"
            value={nuevoContenido}
            onChange={handleChange}
            style={{
              whiteSpace: 'pre-wrap',
              fontWeight: bold ? 'bold' : 'normal',
              fontStyle: italic ? 'italic' : 'normal',
              textDecoration: underline ? 'underline' : 'none',  // Asegúrate de incluir esta línea para el subrayado
              textAlign: alineacion,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonBootstrap variant="primary" onClick={() => onGuardar(nuevoContenido)}>
            Guardar
          </ButtonBootstrap>
          <ButtonBootstrap variant="secondary" onClick={onClose}>
            Cancelar
          </ButtonBootstrap>
        </Modal.Footer>
      </Modal>
    );
  };
  
  export default ModalEditarContenido;
  