import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Paginacion from "../ordenamiento/Paginacion";
import { useTranslation } from 'react-i18next';

const TablaLibros = ({ libros, openEditModal, openDeleteModal, totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t("libros.tituloLibro")}</th>
            <th>{t("libros.autor")}</th>
            <th>{t("libros.categoria")}</th>
            <th>{t("common.acciones")}</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id}>
              <td>{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>{libro.categoria}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(libro)}
                  title={t("common.editar")}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => openDeleteModal(libro)}
                  title={t("common.eliminar")}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default TablaLibros; 