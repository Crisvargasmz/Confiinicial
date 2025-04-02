import React from "react";
import { Modal, Button } from "react-bootstrap";
import ReactGA from "react-ga4";

// Inicialización de ReactGA con múltiples trackers
ReactGA.initialize([
  {
    trackingId: "G-71KQ8LCBB0",
    gaOptions: {
      siteSpeedSampleRate: 100
    }
  }
]);


const ModalEliminacionProducto = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteProducto,
}) => {


const trackProductDelete = () => {
ReactGA.event({
category: "Productos",
action: "Eliminacion Producto"
});
};

// Modificar handleAddProducto para incluir el tracking
  const handleDeleteProductoWithTracking = () => {
    handleDeleteProducto();
    trackProductDelete();
  };



  return (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar este producto?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteProductoWithTracking}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;
