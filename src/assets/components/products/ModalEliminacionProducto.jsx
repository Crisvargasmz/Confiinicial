import React from "react";
import { Modal, Button } from "react-bootstrap";
import ReactGA from "react-ga4";
import { useTranslation } from 'react-i18next';

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
  show,
  onHide,
  productoAEliminar,
  handleDeleteProducto,
}) => {
  const { t } = useTranslation();

  const trackProductDelete = () => {
    ReactGA.event({
      category: "Productos",
      action: "Eliminacion Producto"
    });
  };

  const handleDeleteProductoWithTracking = () => {
    handleDeleteProducto();
    trackProductDelete();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('common.confirmar')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('productos.confirmarEliminar')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.cancelar')}
        </Button>
        <Button variant="danger" onClick={handleDeleteProductoWithTracking}>
          {t('common.eliminar')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;
