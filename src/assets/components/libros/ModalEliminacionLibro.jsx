import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const ModalEliminacionLibro = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteLibro,
}) => {
  const { t } = useTranslation();
  
  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("libros.eliminarLibro")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t("libros.confirmarEliminacion")}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          {t("libros.cancelar")}
        </Button>
        <Button variant="danger" onClick={handleDeleteLibro}>
          {t("common.eliminar")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionLibro; 