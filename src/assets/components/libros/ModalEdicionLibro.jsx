import React from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const ModalEdicionLibro = ({
  showEditModal,
  setShowEditModal,
  libroEditado,
  handleEditInputChange,
  handleEditImageChange,
  handleEditLibro,
  categorias
}) => {
  const { t } = useTranslation();
  
  if (!libroEditado) return null;

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("libros.editarLibro")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t("libros.tituloLibro")}</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={libroEditado.titulo}
              onChange={handleEditInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("libros.autor")}</Form.Label>
            <Form.Control
              type="text"
              name="autor"
              value={libroEditado.autor}
              onChange={handleEditInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("libros.categoria")}</Form.Label>
            <Form.Select
              name="categoria"
              value={libroEditado.categoria}
              onChange={handleEditInputChange}
            >
              <option value="">{t("productos.seleccionarCategoria")}</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("productos.imagenActual")}</Form.Label>
            {libroEditado.imagen && (
              <Image src={libroEditado.imagen} width="100" className="mb-2" />
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
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          {t("libros.cancelar")}
        </Button>
        <Button variant="primary" onClick={handleEditLibro}>
          {t("libros.guardar")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionLibro; 