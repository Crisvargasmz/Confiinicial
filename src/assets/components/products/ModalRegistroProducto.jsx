import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
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

const ModalRegistroProducto = ({
  showModal,
  setShowModal,
  nuevoProducto,
  handleInputChange,
  handleImageChange,
  handleAddProducto,
  categorias
}) => {
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
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoProducto.nombre}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={nuevoProducto.precio}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={nuevoProducto.categoria}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAddProductoWithTracking}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;