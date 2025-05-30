import React from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const ModalEdicionProducto = ({
  show,
  onHide,
  productoEditado,
  handleEditInputChange,
  handleEditImageChange,
  handleEditProducto,
  categorias
}) => {
  const { t } = useTranslation();

  if (!productoEditado) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('productos.editarProducto')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.nombre')}</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={productoEditado.nombre}
              onChange={handleEditInputChange}
              placeholder={t('productos.nombre')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.precio')}</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={productoEditado.precio}
              onChange={handleEditInputChange}
              placeholder={t('productos.precio')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('productos.categoria')}</Form.Label>
            <Form.Select
              name="categoria"
              value={productoEditado.categoria}
              onChange={handleEditInputChange}
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
            <Form.Label>{t('productos.imagenActual')}</Form.Label>
            {productoEditado.imagen && (
              <Image src={productoEditado.imagen} width="100" className="mb-2" />
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.cancelar')}
        </Button>
        <Button variant="primary" onClick={handleEditProducto}>
          {t('common.guardar')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;