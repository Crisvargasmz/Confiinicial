import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
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

const ModalRegistroProducto = ({
  show,
  onHide,
  nuevoProducto,
  handleInputChange,
  handleImageChange,
  handleAddProducto,
  categorias
}) => {
  const { t } = useTranslation();

  // Función para rastrear el registro de productos
  const trackProductRegistration = () => {
    ReactGA.event({
      category: "Productos",
      action: "Registro de Producto",
      label: nuevoProducto.nombre,
      value: nuevoProducto.precio
    });
  };

  // Modificar handleAddProducto para incluir el tracking
  const handleAddProductoWithTracking = () => {
    handleAddProducto();
    trackProductRegistration();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('productos.nuevoProducto')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.nombre')}</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoProducto.nombre}
              onChange={handleInputChange}
              placeholder={t('productos.nombre')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.precio')}</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={nuevoProducto.precio}
              onChange={handleInputChange}
              placeholder={t('productos.precio')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.categoria')}</Form.Label>
            <Form.Select
              name="categoria"
              value={nuevoProducto.categoria}
              onChange={handleInputChange}
            >
              <option value="">{t('productos.seleccionarCategoria')}</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.imagen')}</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.cancelar')}
        </Button>
        <Button variant="primary" onClick={handleAddProductoWithTracking}>
          {t('common.guardar')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;