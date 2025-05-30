import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const ModalEliminacionCategoria = ({
  show,
  onHide,
  categoriaAEliminar,
  handleDeleteCategoria,
}) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('common.confirmar')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('categorias.confirmarEliminar')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.cancelar')}
        </Button>
        <Button variant="danger" onClick={handleDeleteCategoria}>
          {t('common.eliminar')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCategoria;