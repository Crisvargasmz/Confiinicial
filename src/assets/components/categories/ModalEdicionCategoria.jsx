import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const ModalEdicionCategoria = ({
  show,
  onHide,
  categoriaEditada,
  handleEditInputChange,
  handleEditCategoria,
}) => {
  const { t } = useTranslation();
  
  if (!categoriaEditada) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('categorias.editarCategoria')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t('categorias.nombre')}</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={categoriaEditada.nombre}
              onChange={handleEditInputChange}
              placeholder={t('categorias.placeholderNombre')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('categorias.descripcion')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={categoriaEditada.descripcion}
              onChange={handleEditInputChange}
              placeholder={t('categorias.placeholderDescripcion')}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.cancelar')}
        </Button>
        <Button variant="primary" onClick={handleEditCategoria}>
          {t('common.guardar')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;