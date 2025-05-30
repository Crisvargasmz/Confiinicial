import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const ModalRegistroLibro = ({
  showModal,
  setShowModal,
  nuevoLibro,
  handleInputChange,
  handleAddLibro,
  categorias
}) => {
  const { t } = useTranslation();
  
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("libros.agregarLibro")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t("libros.tituloLibro")}</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={nuevoLibro.titulo}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("libros.autor")}</Form.Label>
            <Form.Control
              type="text"
              name="autor"
              value={nuevoLibro.autor}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("libros.categoria")}</Form.Label>
            <Form.Select
              name="categoria"
              value={nuevoLibro.categoria}
              onChange={handleInputChange}
            >
              <option value="">{t("productos.seleccionarCategoria")}</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {t("libros.cancelar")}
        </Button>
        <Button variant="primary" onClick={handleAddLibro}>
          {t("libros.guardar")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroLibro; 